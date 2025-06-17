/**
 * Single parameter definition for a worksheet function.
 *
 * @property name      Formal parameter name (used by docs & IDE hints).
 * @property required  `true` if caller must supply a value.
 * @property variadic  Marks the *last* parameter as “collect the rest”.
 * @property default   Default value substituted when the arg is omitted
 *                     (Excel‐style blank).  Untyped because it varies.
 */
export interface FunctionArg {
    name: string;
    required: boolean;
    variadic?: boolean;
    default?: unknown;
}
/**
 * Metadata for an Excel worksheet function.
 *
 * @property args            Ordered list of parameter specs.
 * @property description     Human-readable summary for help/tooltips.
 * @property returnType      Textual type label (“Number”, “Any”, …).
 * @property customArgParser Set to `true` if this function needs a
 *                           bespoke argument-normalisation pass.
 * @property variadic        Convenience flag: whole function is variadic
 *                           (alias for last arg having `variadic:true`).
 */
export interface FunctionMeta {
    args: FunctionArg[];
    description: string;
    returnType: string;
    customArgParser?: boolean;
    variadic?: boolean;
}
/**
 * Core catalogue of functions the parser knows about.
 * Keys are *uppercase* Excel names; values are {@link FunctionMeta}.
 * Kept `as const` to preserve literal key names in `TypeMap`.
 */
export declare const typeMap: Record<string, FunctionMeta>;
/** Literal view of {@link typeMap}. */
export type TypeMap = typeof typeMap;
/** All recognised function names (uppercase Excel spelling). */
export type FuncName = keyof TypeMap;
/** Metadata object for a given function name. */
export type FuncDef<F extends FuncName> = TypeMap[F];
/** Tuple of argument definitions for a function. */
export type ArgList<F extends FuncName> = FuncDef<F>["args"];
/** Single parameter definition (union of list elements). */
export type ArgDef<F extends FuncName> = ArgList<F>[number];
/** Declared return type string literal for a function. */
export type ReturnType<F extends FuncName> = FuncDef<F>["returnType"];
