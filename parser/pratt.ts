// ─────────────────────────────────────────────────────────────────────────────
//  /parser/prattParser.ts
//  ---------------------------------------------------------------------------
//  • Pratt / Top-Down Operator Precedence parser dedicated to Excel formulae.
//  • Completely generic: precedence table knows nothing about Excel functions;
//    function-specific arity / argument naming is handled in later passes
//    (normalizeFilters, etc.).
//  • Token expectations:
//
//        LPAREN   "("
//        RPAREN   ")"
//        COMMA    ","
//        IDENT    Function name or named range
//        all operators: token.type === operator-lexeme  ("+", "*", "<=", …)
//
//    Make sure your lexer emits those exact spellings (see tokenize.ts).
// ─────────────────────────────────────────────────────────────────────────────

import type { ASTNode, ASTValue, Token } from "../types";

/* -------------------------------------------------------------------------- */
/*  Pratt symbol specs                                                        */
/* -------------------------------------------------------------------------- */

/** Null-denotation   – handler for tokens that *start* an expression. */
type Nud = (tok: Token) => ASTNode;
/** Left-denotation   – handler for tokens that appear *infix* / *postfix*. */
type Led = (left: ASTNode, tok: Token) => ASTNode;

/**
 * Descriptor for a token in Pratt space.
 *
 * @property lbp  Left-binding power (precedence).  Higher = binds tighter.
 * @property nud  Function that parses the token when it *begins* an expr.
 * @property led  Function that parses the token when it appears *after* a
 *                left operand.
 */
interface SymbolSpec {
  lbp: number;
  nud?: Nud;
  led?: Led;
}

/* -------------------------------------------------------------------------- */
/*  Precedence table                                                          */
/*  ONLY operators belong here – not COMMA                                    */
/* -------------------------------------------------------------------------- */

/** Map of `token.type` **or** raw `token.text` → Pratt spec. */
const table: Record<string, SymbolSpec> = {
  /* ── literals / atoms ──────────────────────────────────────────────── */
  NUMBER: { lbp: 0, nud: literal },
  LITERAL: { lbp: 0, nud: literal },
  BOOLEAN: { lbp: 0, nud: literal },
  ERROR: { lbp: 0, nud: literal },
  CELL: { lbp: 0, nud: literal },
  RANGE: { lbp: 0, nud: literal },
  NAMED_RANGE: { lbp: 0, nud: literal },
  ARRAY: { lbp: 0, nud: literal },

  /* ── prefix  ±x  and infix  x±y ─────────────────────────────────────── */
  "+": { lbp: 50, nud: prefix, led: infixLeft },
  "-": { lbp: 50, nud: prefix, led: infixLeft },

  /* ── postfix   x% ───────────────────────────────────────────────────── */
  "%": { lbp: 80, led: postfix },

  /* ── exponent  x ^ y  (right-assoc) ─────────────────────────────────── */
  "^": { lbp: 70, led: infixRight },

  /* ── multiplicative   x * y   x / y ─────────────────────────────────── */
  "*": { lbp: 60, led: infixLeft },
  "/": { lbp: 60, led: infixLeft },

  /* ── range operator   A1:B2  (lower than * / higher than &) ─────────── */
  ":": { lbp: 40, led: infixLeft },

  /* ── concatenation   "a"&"b" ────────────────────────────────────────── */
  "&": { lbp: 30, led: infixLeft },

  /* ── comparisons ────────────────────────────────────────────────────── */
  "=": { lbp: 30, led: infixLeft },
  "<": { lbp: 30, led: infixLeft },
  ">": { lbp: 30, led: infixLeft },
  ">=": { lbp: 30, led: infixLeft },
  "<=": { lbp: 30, led: infixLeft },
  "<>": { lbp: 30, led: infixLeft },

  /* ── parentheses & identifiers ──────────────────────────────────────── */
  LPAREN: { lbp: 0, nud: parenExpression },
  IDENT: { lbp: 0, nud: identifier },

  /* ── stop / sentinel tokens ─────────────────────────────────────────── */
  ",": { lbp: 0 }, // argument separator
  RPAREN: { lbp: 0 },
  EOF: { lbp: 0 },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Convenience factory that copies the token’s location into the new node.
 *
 * @param type  AST node type string.
 * @param value Decoded literal value or `undefined`.
 * @param args  Child nodes array (default `[]`).
 * @param tok   Source token whose `pos` is forwarded into `loc`.
 */
function node(
  type: string,
  value: ASTValue | undefined,
  args: ASTNode[] = [],
  tok: Token
): ASTNode {
  return { type, value, args, loc: { start: tok.pos.start, end: tok.pos.end } };
}

/* ---------- literal nud --------------------------------------------------- */
/**
 * Handles atoms: NUMBER, LITERAL, BOOLEAN, ERROR, CELL, etc.
 * Applies Excel-specific decoding for quoted string literals.
 */
function literal(tok: Token): ASTNode {
  if (tok.type === "LITERAL") {
    // Strip outer quotes and un-escape doubled quotes.
    const decoded = tok.text.slice(1, -1).replace(/""/g, '"');
    return node("LITERAL", decoded, [], tok);
  }

  if (tok.type === "NUMBER") return node("NUMBER", +tok.text, [], tok);
  if (tok.type === "BOOLEAN")
    return node("BOOLEAN", tok.text.toUpperCase(), [], tok);

  // CELL, RANGE, ERROR, NAMED_RANGE, ARRAY fall through unchanged.
  return node(tok.type, tok.text, [], tok);
}

/* ---------- identifier nud (function call or named range) ----------------- */
/**
 * Parses a bare identifier.  If immediately followed by `(` it becomes a
 * *function call*; otherwise it becomes a *NamedRange* reference.
 * Supports blank arguments (`INDEX(a,,4)` → `Missing` node).
 */
function identifier(tok: Token): ASTNode {
  if (accept("LPAREN")) {
    const args: ASTNode[] = [];

    if (peek().type !== "RPAREN") {
      for (;;) {
        if (peek().type === ",") {
          // blank arg →
          args.push(nodeMissing(peek()));
        } else {
          args.push(expression(0));
        }

        if (!accept(",")) break;

        // comma just consumed, next token could close the call
        if (peek().type === "RPAREN") {
          args.push(nodeMissing(peek())); // trailing blank arg
          break;
        }
      }
    }

    expect("RPAREN");
    return node(tok.text.toUpperCase(), undefined, args, tok);
  }

  // Plain identifier → workbook / LET named range
  return node("NamedRange", tok.text, [], tok);
}

/**
 * Produces a placeholder node for an omitted argument.
 */
function nodeMissing(tok: Token): ASTNode {
  return {
    type: "Missing",
    value: undefined,
    args: [],
    loc: { start: tok.pos.start, end: tok.pos.end },
  };
}

/* ---------- prefix operator nud ------------------------------------------ */
/** Handles unary + / − . */
function prefix(tok: Token): ASTNode {
  const right = expression(70); // binds tighter than any infix except ^
  return node(tok.text, undefined, [right], tok);
}

/* ---------- postfix operator led (currently only %) ---------------------- */
/** Handles Excel percentage postfix (value% → value / 100). */
function postfix(left: ASTNode, tok: Token): ASTNode {
  return node(tok.text, undefined, [left], tok);
}

/* ---------- left-associative infix led ----------------------------------- */
/** Generic left-assoc handler (+,*,&,=, etc.). */
function infixLeft(left: ASTNode, tok: Token): ASTNode {
  const rbp = safeSpec(tok).lbp;
  const right = expression(rbp);

  // Range operator deserves a dedicated node type.
  if (tok.text === ":") {
    return node("Range", undefined, [left, right], tok);
  }

  return node(tok.text, undefined, [left, right], tok);
}

/* ---------- right-associative infix led (exponent) ----------------------- */
function infixRight(left: ASTNode, tok: Token): ASTNode {
  const rbp = safeSpec(tok).lbp - 1;
  const right = expression(rbp);
  return node(tok.text, undefined, [left, right], tok);
}

/* ---------- parenthesised expression ------------------------------------- */
/** `( expr )` – returns inner expression node. */
function parenExpression(_lp: Token): ASTNode {
  void _lp;
  const expr = expression(0);
  expect("RPAREN");
  return expr;
}

/* -------------------------------------------------------------------------- */
/*  Pratt engine                                                              */
/* -------------------------------------------------------------------------- */

let tokens: Token[]; // active token stream
let idx: number; // current cursor

/** Resolve table entry or throw a helpful error. */
function safeSpec(tok: Token): SymbolSpec {
  const spec = table[tok.type] ?? table[tok.text];
  if (!spec)
    throw new Error(`No Pratt spec for token type "${tok.type}" (${tok.text})`);
  return spec;
}

/** Peeks ahead without consuming;  `offset` may be positive. */
function peek(offset = 0): Token {
  return tokens[idx + offset] ?? EOF_TOKEN;
}

/** Consumes one token from the stream (or returns EOF). */
function advance(): Token {
  return tokens[idx++] ?? EOF_TOKEN;
}

/** If next token matches `type`, consume it and return true. */
function accept(type: string): boolean {
  if (peek().type === type) {
    advance();
    return true;
  }
  return false;
}

/** Consume the next token or throw if it isn't `type`. */
function expect(type: string): Token {
  if (peek().type !== type) {
    throw new Error(`Expected ${type} at char ${peek().pos.start}`);
  }
  return advance();
}

/**
 * Core Pratt recursive-descent walker.
 *
 * @param rbp Right-binding power (precedence threshold).
 * @returns   Parsed AST subtree.
 */
function expression(rbp = 0): ASTNode {
  let t = advance();
  const spec = safeSpec(t);
  if (!spec.nud) throw new Error(`Unexpected token ${t.text}`);
  let left = spec.nud(t);

  while (rbp < safeSpec(peek()).lbp) {
    t = advance();
    const ledSpec = safeSpec(t);
    if (!ledSpec.led) throw new Error(`Token ${t.text} cannot appear here`);
    left = ledSpec.led(left, t);
  }
  return left;
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

const EOF_TOKEN: Token = { type: "EOF", text: "", pos: { start: 0, end: 0 } };

/**
 * Parse a token array into an AST using Pratt T.D.O.P.
 *
 * @param ts Token list produced by the lexer.
 * @returns  Root {@link ASTNode}.
 * @throws   If an unexpected token or dangling input is encountered.
 */
export function parseTokensPratt(ts: Token[]): ASTNode {
  tokens = ts;
  idx = 0;
  const ast = expression(0);

  if (peek().type !== "EOF") {
    throw new Error(`Unexpected trailing token ${peek().text}`);
  }
  return ast;
}
