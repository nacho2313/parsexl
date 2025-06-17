import type { ASTNode } from "../types";
/**
 * Map a raw token string to one or more ASTArg descriptors.
 * Leaves `args` off entirely – the parser will attach them.
 */
export declare function guessTokenType(token: string): ASTNode[];
