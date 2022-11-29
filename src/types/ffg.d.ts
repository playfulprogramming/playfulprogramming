export {};

declare global {
	interface Window {
		rafThrottle<T extends (...props: any[]) => any>(
			callback: T
		): (...args: any[]) => void;
	}
}
