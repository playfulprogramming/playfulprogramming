/**
 * Extracts the return type of a specific overload from an overloaded function, matched by the provided argument types tuple.
 *
 * @template Overload - The overloaded function type.
 * @template Args - A tuple of argument types used to match a specific overload signature.
 *
 * Note:
 * - Supports a **maximum of 5 overloads**. If a function has more, only the last 5 are evaluated from last to first in declaration order. Overloads outside this range may resolve to `never`.
 * - Returns `never` if no overload signature matches the provided `Args`.
 */
export type OverloadReturnType<
	Overload extends (...args: unknown[]) => unknown,
	Args extends unknown[],
> = Extract<
	Overload extends {
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
		(...args: infer A3): infer R3;
		(...args: infer A4): infer R4;
		(...args: infer A5): infer R5;
	}
		? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] | [A5, R5]
		: never,
	[Args, unknown]
>[1];
