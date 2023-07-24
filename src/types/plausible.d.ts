export {};

declare global {
	const plausible: (
		val: string,
		args?: { props?: unknown; callback?: () => void },
	) => void;
}
