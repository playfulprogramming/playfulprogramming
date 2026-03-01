/**
 * Extracts the return type of a specific overload from an overloaded function, matched by the provided argument types tuple.
 *
 * Note:
 * - Supports a **maximum of 5 overloads**.
 * - Returns `never` if no overload signature matches the provided `Args` or number of overloads exceeds the maximum overload limit.
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
