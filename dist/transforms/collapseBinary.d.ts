import type { ASTNode } from "../types";
/**
 * Walk the tree and collapse every     left  op  right
 * triple where **op is a comparison operator** into a single node:
 *
 *     { type: ">", args: [A1, 5] }
 *
 * Pratt already turned arithmetic into single nodes, so we only need to
 * look for Excel’s six relational operators.
 */
export declare function collapseBinary(node: ASTNode): void;
