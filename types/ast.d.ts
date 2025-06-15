/**
 * Primitive literal values that can appear in a formula AST node.
 */
export type ASTValue = string | number | boolean;

/**
 * Zero-based character offsets of a token / node in the original formula
 * string. `end` is **exclusive** (matches JS substring semantics).
 */
export interface Position {
  /** Index of the first character. */
  start: number;
  /** Index just past the last character. */
  end: number;
}

/**
 * Generic Excel-formula AST node.
 *
 * ─ `type`  Excel operator / function / token name (`"IF"`, `"+"`, `"NUMBER"`, …).
 * ─ `value` Literal or sub-node, used by atoms (`NUMBER`, `BOOLEAN`, `ARRAY`) and
 *           wrapper constructs like `Group`.
 * ─ `args`  Ordered child nodes (function arguments, operator operands, etc.).
 * ─ `name`  Optional semantic label injected by normalisation passes
 *           (e.g. `"array"`, `"include"`, `"ifEmpty"` inside a `FILTER`).
 * ─ `loc`   Character span in the source formula (useful for diagnostics).
 */
export interface ASTNode {
  type: string;
  value?: ASTValue | ASTNode;
  args: ASTNode[];
  name?: string;
  loc: Position;
}

/**
 * Raw lexical token produced by the scanner.
 *
 * ─ `type`  Lexer token kind (`"NUMBER"`, `"LPAREN"`, `"+"`, …).
 * ─ `text`  Exact substring matched in the formula.
 * ─ `pos`   Source span.
 */
export interface Token {
  type: string;
  text: string;
  pos: Position;
}
