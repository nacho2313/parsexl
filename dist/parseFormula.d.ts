import type { ASTNode } from "./types";
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
export declare function parseFormula(formula: string, devMode?: boolean): ASTNode;
