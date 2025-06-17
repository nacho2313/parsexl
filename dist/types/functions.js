/**
 * Core catalogue of functions the parser knows about.
 * Keys are *uppercase* Excel names; values are {@link FunctionMeta}.
 * Kept `as const` to preserve literal key names in `TypeMap`.
 */
export const typeMap = {
    IF: {
        args: [
            { name: "condition", required: true },
            { name: "trueResult", required: true },
            { name: "falseResult", required: false },
        ],
        description: "Evaluates a condition and returns different results based on true/false.",
        returnType: "Any",
    },
    LAMBDA: {
        args: [
            { name: "parameters", required: true, variadic: true },
            { name: "body", required: true },
        ],
        customArgParser: true,
        description: "Creates a reusable function with given parameters.",
        returnType: "Function",
    },
    LET: {
        args: [
            { name: "name", required: true, variadic: true },
            { name: "value", required: true, variadic: true },
            { name: "calculation", required: true },
        ],
        customArgParser: true,
        description: "Assigns names to calculation results and returns a final expression.",
        returnType: "Any",
    },
    SUM: {
        args: [{ name: "values", required: true, variadic: true }],
        description: "Adds all numbers (or arrays of numbers) together.",
        returnType: "Number",
    },
    AND: {
        args: [{ name: "conditions", required: true, variadic: true }],
        variadic: true,
        description: "Returns TRUE if all conditions are true.",
        returnType: "Boolean",
    },
    OR: {
        args: [{ name: "conditions", required: true, variadic: true }],
        description: "Returns TRUE if at least one condition is true.",
        returnType: "Boolean",
    },
    NOT: {
        args: [{ name: "condition", required: true }],
        description: "Reverses the logical value of its argument.",
        returnType: "Boolean",
    },
    INDEX: {
        args: [
            { name: "array", required: true },
            { name: "rowNum", required: false },
            { name: "columnNum", required: false },
            { name: "areaNum", required: false },
        ],
        description: "Returns the value of an element in a table or an array, selected by the row and column number.",
        returnType: "Any",
    },
    INDIRECT: {
        args: [
            { name: "refText", required: true },
            { name: "a1Style", required: false, default: true },
        ],
        description: "Returns a reference specified by a text string. Optionally controls whether the reference is in A1 or R1C1 style.",
        returnType: "Reference",
    },
    MATCH: {
        args: [
            { name: "lookupValue", required: true },
            { name: "lookupArray", required: true },
            { name: "matchType", required: false, default: 1 },
        ],
        description: "Searches for a specified item in a range of cells and returns its relative position.",
        returnType: "Number",
    },
    IFERROR: {
        args: [
            { name: "value", required: true },
            { name: "valueIfError", required: true },
        ],
        description: "Returns a specified value if the formula results in an error; otherwise returns the formula result.",
        returnType: "Any",
    },
    VLOOKUP: {
        args: [
            { name: "lookupValue", required: true },
            { name: "tableArray", required: true },
            { name: "colIndexNum", required: true },
            { name: "rangeLookup", required: false, default: true },
        ],
        description: "Searches for a value in the first column of a table array and returns a value in the same row from the specified column.",
        returnType: "Any",
    },
    XLOOKUP: {
        args: [
            { name: "lookupValue", required: true },
            { name: "lookupArray", required: true },
            { name: "returnArray", required: true },
            { name: "ifNotFound", required: false, default: "#N/A" },
            { name: "matchMode", required: false, default: 0 },
            { name: "searchMode", required: false, default: 1 },
        ],
        description: "Searches a range or array and returns an item corresponding to the first match it finds.",
        returnType: "Any",
    },
    CHOOSE: {
        args: [
            { name: "indexNum", required: true },
            { name: "values", required: true, variadic: true },
        ],
        description: "Returns a value from a list of values based on the given index number.",
        returnType: "Any",
    },
    ISERROR: {
        args: [{ name: "value", required: true }],
        description: "Checks whether a value is any Excel error and returns TRUE or FALSE.",
        returnType: "Boolean",
    },
    ISBLANK: {
        args: [{ name: "value", required: true }],
        description: "Returns TRUE if the value is blank (empty), FALSE otherwise.",
        returnType: "Boolean",
    },
    ISNUMBER: {
        args: [{ name: "value", required: true }],
        description: "Checks whether a value is a number and returns TRUE or FALSE.",
        returnType: "Boolean",
    },
    TEXT: {
        args: [
            { name: "value", required: true },
            { name: "formatText", required: true },
        ],
        description: "Formats a number and converts it to text according to a specified format string.",
        returnType: "String",
    },
    TODAY: {
        args: [],
        description: "Returns the current date as a serial number.",
        returnType: "Date",
    },
    VALUE: {
        args: [{ name: "text", required: true }],
        description: "Converts a text string that represents a number to a numeric value.",
        returnType: "Number",
    },
    ROUND: {
        args: [
            { name: "number", required: true },
            { name: "numDigits", required: true },
        ],
        description: "Rounds a number to a specified number of digits.",
        returnType: "Number",
    },
    ROUNDUP: {
        args: [
            { name: "number", required: true },
            { name: "numDigits", required: true },
        ],
        description: "Rounds a number up, away from zero, to a specified number of digits.",
        returnType: "Number",
    },
    ROUNDDOWN: {
        args: [
            { name: "number", required: true },
            { name: "numDigits", required: true },
        ],
        description: "Rounds a number down, toward zero, to a specified number of digits.",
        returnType: "Number",
    },
    LEFT: {
        args: [
            { name: "text", required: true },
            { name: "numChars", required: false, default: 1 },
        ],
        description: "Returns the first character or characters in a text string, based on the number of characters you specify.",
        returnType: "String",
    },
    RIGHT: {
        args: [
            { name: "text", required: true },
            { name: "numChars", required: false, default: 1 },
        ],
        description: "Returns the last character or characters in a text string, based on the number of characters you specify.",
        returnType: "String",
    },
    MID: {
        args: [
            { name: "text", required: true },
            { name: "startNum", required: true },
            { name: "numChars", required: true },
        ],
        description: "Returns a specific number of characters from a text string, starting at the position you specify.",
        returnType: "String",
    },
    LEN: {
        args: [{ name: "text", required: true }],
        description: "Returns the number of characters in a text string.",
        returnType: "Number",
    },
    CONCAT: {
        args: [{ name: "text1", required: true, variadic: true }],
        description: "Combines multiple text strings into one string.",
        returnType: "String",
    },
    FILTER: {
        args: [
            { name: "array", required: true },
            { name: "include", required: true },
            { name: "ifEmpty", required: false },
        ],
        description: "Returns an array of values that meet specified criteria; if no values meet the criteria, returns the ifEmpty argument or a #CALC! error if omitted.",
        returnType: "Array",
    },
    SUBSTITUTE: {
        args: [
            { name: "text", required: true },
            { name: "oldText", required: true },
            { name: "newText", required: true },
            { name: "instanceNum", required: false },
        ],
        description: "Replaces occurrences of oldText with newText in a text string; if instanceNum is specified, only that occurrence is replaced.",
        returnType: "String",
    },
    UNIQUE: {
        args: [
            { name: "array", required: true },
            { name: "byColumn", required: false, default: false },
            { name: "exactlyOnce", required: false, default: false },
        ],
        description: "Returns a list of unique values from the array.",
        returnType: "Array",
    },
    SORT: {
        args: [
            { name: "array", required: true },
            { name: "sortIndex", required: false, default: 1 },
            { name: "sortOrder", required: false, default: 1 },
            { name: "byColumn", required: false, default: false },
        ],
        description: "Sorts the array by row (or column).",
        returnType: "Array",
    },
    SORTBY: {
        args: [
            { name: "array", required: true },
            { name: "sortArray", required: true, variadic: true },
            // pattern: sortArray1, sortOrder1, sortArray2, sortOrder2, …
        ],
        description: "Sorts array based on one or more corresponding sort arrays.",
        returnType: "Array",
    },
    SEQUENCE: {
        args: [
            { name: "rows", required: true },
            { name: "columns", required: false, default: 1 },
            { name: "start", required: false, default: 1 },
            { name: "step", required: false, default: 1 },
        ],
        description: "Generates a numeric sequence as a spill array.",
        returnType: "Array",
    },
    RANDARRAY: {
        args: [
            { name: "rows", required: false, default: 1 },
            { name: "columns", required: false, default: 1 },
            { name: "min", required: false, default: 0 },
            { name: "max", required: false, default: 1 },
            { name: "wholeNumber", required: false, default: false },
        ],
        description: "Returns an array of random numbers.",
        returnType: "Array",
    },
    COUNTIF: {
        args: [
            { name: "range", required: true },
            { name: "criteria", required: true },
        ],
        description: "Counts cells that meet a single criterion.",
        returnType: "Number",
    },
    SUMIF: {
        args: [
            { name: "range", required: true },
            { name: "criteria", required: true },
            { name: "sumRange", required: false },
        ],
        description: "Adds cells specified by a single criterion.",
        returnType: "Number",
    },
    SUMIFS: {
        args: [
            { name: "sumRange", required: true },
            { name: "criteriaRange", required: true, variadic: true },
            // pattern: criteriaRange1, criteria1, criteriaRange2, criteria2, …
        ],
        description: "Adds cells specified by multiple criteria.",
        returnType: "Number",
    },
    AVERAGE: {
        args: [{ name: "values", required: true, variadic: true }],
        description: "Returns the average of its arguments.",
        returnType: "Number",
    },
    AVERAGEIF: {
        args: [
            { name: "range", required: true },
            { name: "criteria", required: true },
            { name: "averageRange", required: false },
        ],
        description: "Averages cells that meet a single criterion.",
        returnType: "Number",
    },
    MIN: {
        args: [{ name: "numbers", required: true, variadic: true }],
        description: "Returns the smallest numeric value in the supplied arguments.",
        returnType: "Number",
    },
    MAX: {
        args: [{ name: "numbers", required: true, variadic: true }],
        description: "Returns the largest numeric value in the supplied arguments.",
        returnType: "Number",
    },
    COUNT: {
        args: [{ name: "values", required: true, variadic: true }],
        description: "Counts the number of numeric values among the supplied arguments.",
        returnType: "Number",
    },
    COUNTA: {
        args: [{ name: "values", required: true, variadic: true }],
        description: "Counts the number of non-empty values among the supplied arguments.",
        returnType: "Number",
    },
    COUNTBLANK: {
        args: [{ name: "range", required: true }],
        description: "Counts the number of empty cells within the specified range.",
        returnType: "Number",
    },
    TEXTJOIN: {
        args: [
            { name: "delimiter", required: true },
            { name: "ignoreEmpty", required: true },
            { name: "text", required: true, variadic: true },
        ],
        description: "Concatenates text items using a delimiter, optionally ignoring empty cells.",
        returnType: "String",
    },
    IFNA: {
        args: [
            { name: "value", required: true },
            { name: "valueIfNA", required: true },
        ],
        description: "Returns valueIfNA if the first argument evaluates to #N/A; otherwise returns the first argument.",
        returnType: "Any",
    },
    ABS: {
        args: [{ name: "number", required: true }],
        description: "Returns the absolute value of a number.",
        returnType: "Number",
    },
    CEILING: {
        args: [
            { name: "number", required: true },
            { name: "significance", required: false, default: 1 },
        ],
        description: "Rounds a number up to the nearest multiple of the specified significance.",
        returnType: "Number",
    },
    FLOOR: {
        args: [
            { name: "number", required: true },
            { name: "significance", required: false, default: 1 },
        ],
        description: "Rounds a number down to the nearest multiple of the specified significance.",
        returnType: "Number",
    },
    RANK: {
        args: [
            { name: "number", required: true },
            { name: "ref", required: true },
            { name: "order", required: false, default: 0 },
        ],
        description: "Returns the rank of a number in a list: 0 for descending (default) or 1 for ascending order.",
        returnType: "Number",
    },
};
