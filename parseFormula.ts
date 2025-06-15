// parseFormula.ts
import { tokenize } from "./lexer";
import { collapseBinary, normalizeFilters } from "./transforms";
import type { ASTNode, Token } from "./types";
import { parseTokensPratt } from "./parser";

/**
 * Convert an Excel-style formula into a fully-post-processed AST:
 * ──────────────────────────────────────────────────────────────
 * 1.  Minify the input             → drop the leading “=” and *every* whitespace
 *                                    (new-lines, tabs, spaces, CRs).
 * 2.  Tokenise                     → longest-match scan.
 * 3.  Pratt parse                  → precedence & parentheses.
 * 4.  Post-passes                  → collapseBinary, normalizeFilters.
 * 5.  Prune                        → delete `args` arrays that ended up empty
 *                                    to keep the JSON lean.
 */
export function parseFormula(formula: string, devMode?: boolean): ASTNode {
  /* ── 1  whitespace / “=” ─────────────────────────────────────────────── */
  const cleaned = formula
    .trim() // leading / trailing
    .replace(/^=/, "") // Excel’s mandatory “=”
    .replace(/\s+/g, ""); // every remaining whitespace char

  /* ── 2  lex ──────────────────────────────────────────────────────────── */
  const rawTokens: Token[] = tokenize(cleaned, devMode);

  /* ── 3  Pratt parse ──────────────────────────────────────────────────── */
  const ast = parseTokensPratt(rawTokens);

  /* ── 4  post-process ─────────────────────────────────────────────────── */
  collapseBinary(ast);
  normalizeFilters(ast);

  /* ── 5  prune empty arg arrays ───────────────────────────────────────── */
  pruneEmptyArgs(ast);
  return ast;
}

/* ---------------------------------------------------------------------- */
/*  Helper: recursively delete args: [] to keep output compact            */
/* ---------------------------------------------------------------------- */
function pruneEmptyArgs(node: ASTNode): void {
  if (node.args.length === 0) {
    // remove the property entirely
    // (TS ignores extra runtime keys, so this is safe)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete node.args;
    return;
  }

  for (const child of node.args) pruneEmptyArgs(child);
}
