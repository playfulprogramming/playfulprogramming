export {};

declare global {
	const plausible: (
		val: string,
		args?: { props?: any; callback?: () => void }
	) => void;
}
