// /lexer/tokenize.ts  – scan order = top-to-bottom
export const tokenRegexMap = {
  /* ─── Scalars ────────────────────────────────────────────────────────── */
  LITERAL: /^"(?:[^"]|"")*"/,
  BOOLEAN: /^(?:TRUE|FALSE)/i,

  // no leading sign here  ↓
  NUMBER: /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/,

  // and none here         ↓
  PERCENTAGE: /^\d+(?:\.\d+)?%/,

  /* ─── Errors ─────────────────────────────────────────────────────────── */
  DYNAMIC_ERROR: /^#(?:SPILL|CALC|BLOCKED|FIELD)!/,
  ERROR: /^#(?:NULL|DIV\/0|VALUE|REF|NAME\?|NUM|N\/A|GETTING_DATA)[!?]?/,

  /* ─── References (same as before) ────────────────────────────────────── */
  THREE_D_REFERENCE:
    /^(?:'[^']+'|[A-Za-z_][A-Za-z0-9_]*)\s*:\s*(?:'[^']+'|[A-Za-z_][A-Za-z0-9_]*)!\$?[A-Za-z]{1,3}\$?\d+/,
  EXTERNAL_REFERENCE:
    /^\[[^\]]+\](?:'[^']+'|[A-Za-z_][A-Za-z0-9_]*)!\$?[A-Za-z]{1,3}\$?\d+/,
  RANGE:
    /^(?:'[^']+'|\[[^\]]+]|[A-Za-z_][A-Za-z0-9_]*)!\$?[A-Za-z]{1,3}\$?\d+:\$?[A-Za-z]{1,3}\$?\d+/,
  CELL: /^(?:'[^']+'|\[[^\]]+]|[A-Za-z_][A-Za-z0-9_]*)!\$?[A-Za-z]{1,3}\$?\d+/,
  CELL_OR_RANGE:
    /^(?:[A-Za-z_][A-Za-z0-9_]*!)?\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?/,
  R1C1: /^R\d+C\d+(?::R\d+C\d+)?/,

  STRUCTURED_EXT: /^[A-Za-z_][A-Za-z0-9_]*\[\[[^\]]+\]\]/,
  STRUCTURED_REFERENCE: /^[A-Za-z_][A-Za-z0-9_]*\[[^\]]+\]/,
  TABLE_COLUMN: /^\[@[A-Za-z0-9_]+\]/,

  /* ─── Arrays ─────────────────────────────────────────────────────────── */
  ARRAY: /^\{[^}]*\}/,

  /* ─── Operators & punctuation ────────────────────────────────────────── */
  OPERATOR: /^(?:<=|>=|<>|[+\-*/^&=<>])/, // sits above WILDCARD
  PERCENT_OPERATOR: /^%/,
  WILDCARD: /^[*?]/,
  PARENTHESIS: /^[()]/,
  ARG_SEPARATOR: /^[,;]/,
  IMPLICIT_INTERSECTION: /^@/,
  SPILL_OPERATOR: /^#/,

  /* ─── Identifiers ────────────────────────────────────────────────────── */
  FUNCTION: /^[A-Za-z_][A-Za-z0-9_]*\(/,
  NAMED_RANGE: /^[A-Za-z_][A-Za-z0-9_.]*/,
} as const;

export type TokenRegexMap = typeof tokenRegexMap;
export type TokenPattern = keyof TokenRegexMap;
