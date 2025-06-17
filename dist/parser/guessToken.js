// lexer/guessTokenType.ts
import { tokenRegexMap } from "../lexer";
/**
 * Map a raw token string to one or more ASTArg descriptors.
 * Leaves `args` off entirely – the parser will attach them.
 */
export function guessTokenType(token) {
    // String literal
    if (tokenRegexMap.LITERAL.test(token)) {
        const unquoted = token.slice(1, -1).replace(/""/g, '"');
        return [
            { type: "Literal", value: unquoted, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Boolean
    if (tokenRegexMap.BOOLEAN.test(token)) {
        return [
            {
                type: "Boolean",
                value: token.toUpperCase() === "TRUE",
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Dynamic errors (#SPILL!, #CALC!, etc.)
    if (tokenRegexMap.DYNAMIC_ERROR.test(token)) {
        return [
            {
                type: "DynamicError",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Standard Excel errors (#DIV/0, #NAME?, etc.)
    if (tokenRegexMap.ERROR.test(token)) {
        return [
            { type: "Error", value: token, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Inline array literal
    if (tokenRegexMap.ARRAY.test(token)) {
        return [
            { type: "Array", value: token, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Three-D reference (Sheet1:Sheet3!A1)
    if (tokenRegexMap.THREE_D_REFERENCE.test(token)) {
        return [
            {
                type: "ThreeDReference",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // External workbook reference ([Book1]Sheet1!A1)
    if (tokenRegexMap.EXTERNAL_REFERENCE.test(token)) {
        return [
            {
                type: "ExternalReference",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Structured table extension ([[#Headers]])
    if (tokenRegexMap.STRUCTURED_EXT.test(token)) {
        return [
            {
                type: "StructuredReferenceExt",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Structured table reference ([Column] or Table[Column])
    if (tokenRegexMap.STRUCTURED_REFERENCE.test(token) ||
        tokenRegexMap.TABLE_COLUMN.test(token)) {
        return [
            {
                type: "StructuredReference",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // R1C1 reference
    if (tokenRegexMap.R1C1.test(token)) {
        return [
            { type: "R1C1", value: token, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Cell or range reference (A1 or A1:B2)
    if (tokenRegexMap.CELL_OR_RANGE.test(token)) {
        return token.includes(":")
            ? [{ type: "Range", value: token, args: [], loc: { start: 0, end: 0 } }]
            : [{ type: "Cell", value: token, args: [], loc: { start: 0, end: 0 } }];
    }
    // Percentage literal (e.g. 12.5%)
    if (tokenRegexMap.PERCENTAGE.test(token)) {
        return [
            {
                type: "Percentage",
                value: parseFloat(token) / 100,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Single-percent operator ("%")
    if (tokenRegexMap.PERCENT_OPERATOR.test(token)) {
        return [
            {
                type: "PercentOperator",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Number
    if (tokenRegexMap.NUMBER.test(token)) {
        return [
            {
                type: "Number",
                value: parseFloat(token),
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Function call (SUM(…)
    if (tokenRegexMap.FUNCTION.test(token)) {
        const name = token.slice(0, -1);
        return [
            { type: "Function", value: name, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Operators (+, -, *, /, ^, &, =, <>, etc.)
    if (tokenRegexMap.OPERATOR.test(token)) {
        return [
            { type: "Operator", value: token, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Parentheses
    if (tokenRegexMap.PARENTHESIS.test(token)) {
        return [
            {
                type: "Parenthesis",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Argument separators (, or ;)
    if (tokenRegexMap.ARG_SEPARATOR.test(token)) {
        return [
            {
                type: "ArgumentSeparator",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Implicit intersection operator (@)
    if (tokenRegexMap.IMPLICIT_INTERSECTION.test(token)) {
        return [
            {
                type: "ImplicitIntersection",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Spill operator (#)
    if (tokenRegexMap.SPILL_OPERATOR.test(token)) {
        return [
            {
                type: "SpillOperator",
                value: token,
                args: [],
                loc: { start: 0, end: 0 },
            },
        ];
    }
    // Wildcard (* or ?)
    if (tokenRegexMap.WILDCARD.test(token)) {
        return [
            { type: "Wildcard", value: token, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Named range (unquoted identifier)
    if (tokenRegexMap.NAMED_RANGE.test(token)) {
        return [
            { type: "NamedRange", value: token, args: [], loc: { start: 0, end: 0 } },
        ];
    }
    // Fallback: anything else as a bare expression
    return [
        { type: "Expression", value: token, args: [], loc: { start: 0, end: 0 } },
    ];
}
