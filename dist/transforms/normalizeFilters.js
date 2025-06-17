/**
 * Rebuilds  FILTER(array, include[, ifEmpty])
 * into     FILTER({array}, {include[]}[, {ifEmpty}])
 * and flattens boolean-AND masks:  (A=1)*(B>1) → [A=1, B>1]
 */
const normalised = new WeakSet(); // guards the main walk
const clonedMemo = new WeakMap(); // memoised deep-clone
export function normalizeFilters(node) {
    var _a;
    if (normalised.has(node))
        return node;
    normalised.add(node);
    if (node.type === "FILTER" && node.args.length >= 2) {
        const [arrayArg, includeRaw, ifEmptyRaw] = node.args;
        const includeClauses = flattenMultiplication(includeRaw).map(deepClone);
        const rebuilt = [
            {
                type: "array",
                name: "array",
                args: [deepClone(arrayArg)],
                loc: arrayArg.loc,
            },
            {
                type: "include",
                name: "include",
                args: includeClauses,
                loc: ((_a = includeClauses[0]) !== null && _a !== void 0 ? _a : deepClone(includeRaw)).loc,
            },
        ];
        if (ifEmptyRaw) {
            rebuilt.push({
                type: "ifEmpty",
                name: "ifEmpty",
                args: [deepClone(ifEmptyRaw)],
                loc: ifEmptyRaw.loc,
            });
        }
        node.args = rebuilt;
    }
    // recurse
    for (const child of node.args)
        normalizeFilters(child);
    return node;
}
/* ───────────────────────── helpers ─────────────────────────────────────── */
/** Depth-first clone that memoises already-cloned nodes (breaks cycles). */
function deepClone(n) {
    const found = clonedMemo.get(n);
    if (found)
        return found;
    const copy = { ...n, args: [] };
    clonedMemo.set(n, copy);
    if (n.args)
        copy.args = n.args.map(deepClone);
    return copy;
}
/** Flatten a “*” chain; guarded so a truly cyclic tree cannot loop. */
function flattenMultiplication(n) {
    const seen = new WeakSet();
    function inner(node) {
        var _a;
        if (!node || seen.has(node))
            return [];
        seen.add(node);
        if (node.type === "*" && ((_a = node.args) === null || _a === void 0 ? void 0 : _a.length) === 2) {
            return [...inner(node.args[0]), ...inner(node.args[1])];
        }
        return [node];
    }
    return inner(n);
}
