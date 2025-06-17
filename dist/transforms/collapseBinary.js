/**
 * Walk the tree and collapse every     left  op  right
 * triple where **op is a comparison operator** into a single node:
 *
 *     { type: ">", args: [A1, 5] }
 *
 * Pratt already turned arithmetic into single nodes, so we only need to
 * look for Excel’s six relational operators.
 */
export function collapseBinary(node) {
    if (!node.args.length)
        return; // leaf
    const collapsed = [];
    const cmp = new Set(["<", ">", "<=", ">=", "=", "<>"]);
    for (let i = 0; i < node.args.length;) {
        const [left, op, right] = node.args.slice(i, i + 3);
        if (right && cmp.has(op.type)) {
            collapsed.push({
                type: "Expression",
                args: [left, op, right],
                loc: { start: left.loc.start, end: right.loc.end },
            });
            i += 3; // consumed 3 nodes
        }
        else {
            collapsed.push(left);
            i += 1; // step forward by one and test again
        }
    }
    node.args = collapsed;
    // depth-first traversal
    for (const child of node.args)
        collapseBinary(child);
}
