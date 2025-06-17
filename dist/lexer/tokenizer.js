// src/lexer/tokenize.ts
// -----------------------------------------------------------------------------
// Excel formula → Token[] for the Pratt parser
// • Splits sheet-qualified ranges (Sheet!$A$1:$B$2) into CELL ":" CELL
// • Treats plain A1 and A1:B2 via legacy CELL_OR_RANGE
// • Pass `debug = true` to print a compact token stream
// -----------------------------------------------------------------------------
import { tokenRegexMap } from "./patterns";
/* kinds that may hide a colon and therefore need splitting */
const RANGEABLE = [
    "CELL",
    "CELL_OR_RANGE", // ← legacy pattern now handled
    "EXTERNAL_REFERENCE",
    "THREE_D_REFERENCE",
];
/* kinds that should ultimately look like CELL to Pratt */
const CELL_LIKE = [
    "CELL",
    "CELL_OR_RANGE", // ← legacy pattern now mapped
    "EXTERNAL_REFERENCE",
    "THREE_D_REFERENCE",
    "R1C1",
    "STRUCTURED_REFERENCE",
    "STRUCTURED_EXT",
    "TABLE_COLUMN",
];
/** Tokenise `formula`.  Pass `true` to `debug` to dump the tokens. */
export function tokenize(formula, debug = false) {
    const src = formula.trim().replace(/^=/, "");
    const tokens = [];
    let i = 0;
    /** push helper */
    const push = (tok) => tokens.push(tok);
    while (i < src.length) {
        /* ── fast path: sheet-qualified range ──────────────────────────────── */
        {
            const sheet = String.raw `(?:'[^']+'|\[[^\]]+]|[A-Za-z_][A-Za-z0-9_]*)`;
            const cell = String.raw `\$?[A-Za-z]{1,3}\$?\d+`;
            const m = new RegExp(`^(${sheet}!${cell}):(${cell})`).exec(src.slice(i));
            if (m) {
                const [full, left, right] = m;
                push({
                    type: "CELL",
                    text: left,
                    pos: { start: i, end: i + left.length },
                });
                push({
                    type: ":",
                    text: ":",
                    pos: { start: i + left.length, end: i + left.length + 1 },
                });
                push({
                    type: "CELL",
                    text: right,
                    pos: { start: i + left.length + 1, end: i + full.length },
                });
                i += full.length;
                continue;
            }
        }
        /* ── longest-match scan ────────────────────────────────────────────── */
        const slice = src.slice(i);
        let kind = null;
        let lexeme = "";
        let len = 0;
        for (const [pattern, rx] of Object.entries(tokenRegexMap)) {
            const m = rx.exec(slice);
            if ((m === null || m === void 0 ? void 0 : m.index) === 0 && m[0].length > len) {
                kind = pattern;
                lexeme = m[0];
                len = m[0].length;
            }
        }
        if (!kind) {
            const ctx = src.slice(Math.max(i - 3, 0), i + 3);
            throw new Error(`Unrecognised input at ${i}: '${src[i]}' (…${ctx}…)`);
        }
        const pos = { start: i, end: i + len };
        /* ── re-tag & emit ─────────────────────────────────────────────────── */
        switch (kind) {
            case "FUNCTION": {
                const name = lexeme.slice(0, -1); // drop '('
                push({ type: "IDENT", text: name, pos });
                push({
                    type: "LPAREN",
                    text: "(",
                    pos: { start: pos.end - 1, end: pos.end },
                });
                break;
            }
            case "PARENTHESIS":
                push({ type: lexeme === "(" ? "LPAREN" : "RPAREN", text: lexeme, pos });
                break;
            case "ARG_SEPARATOR":
                push({ type: ",", text: ",", pos });
                break;
            case "OPERATOR":
            case "PERCENT_OPERATOR":
                push({ type: lexeme, text: lexeme, pos });
                break;
            default:
                if (RANGEABLE.includes(kind) && lexeme.includes(":")) {
                    const colon = lexeme.indexOf(":");
                    const left = lexeme.slice(0, colon);
                    const right = lexeme.slice(colon + 1);
                    push({
                        type: "CELL",
                        text: left,
                        pos: { start: pos.start, end: pos.start + left.length },
                    });
                    push({
                        type: ":",
                        text: ":",
                        pos: { start: pos.start + colon, end: pos.start + colon + 1 },
                    });
                    push({
                        type: "CELL",
                        text: right,
                        pos: { start: pos.start + colon + 1, end: pos.end },
                    });
                }
                else {
                    push({
                        type: CELL_LIKE.includes(kind) ? "CELL" : kind,
                        text: lexeme,
                        pos,
                    });
                }
        }
        i += len;
    }
    push({ type: "EOF", text: "", pos: { start: src.length, end: src.length } });
    /* ── debug dump ─────────────────────────────────────────────────────── */
    if (debug) {
        console.error(tokens
            .map((t, idx) => `${idx}:` + (t.type === t.text ? t.type : `${t.type}(${t.text})`))
            .join(" "));
    }
    return tokens;
}
