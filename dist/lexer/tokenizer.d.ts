import type { Token } from "../types";
/** Tokenise `formula`.  Pass `true` to `debug` to dump the tokens. */
export declare function tokenize(formula: string, debug?: boolean): Token[];
