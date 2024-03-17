/**
 * Returns true if [value] is not "null" or "undefined".
 * This is meant as a type guard to be used as .filter(isDefined),
 * which will correctly filter any undefineds/nulls from an array.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}
