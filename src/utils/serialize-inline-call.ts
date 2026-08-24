export const serializeInlineCall =
	<Args extends unknown[]>(fn: (...args: Args) => unknown) =>
	(...args: Args): string => {
		const serializedArgs = args.map((arg) => JSON.stringify(arg)).join(",");
		return `(${fn})(${serializedArgs});`;
	};
