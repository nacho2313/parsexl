import type { ASTNode, Token } from "../types";
/**
 * Parse a token array into an AST using Pratt T.D.O.P.
 *
 * @param ts Token list produced by the lexer.
 * @returns  Root {@link ASTNode}.
 * @throws   If an unexpected token or dangling input is encountered.
 */
export declare function parseTokensPratt(ts: Token[]): ASTNode;
