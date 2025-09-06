import { Environment } from "./types";

let isNode = false;
try {
	// This will throw an error if run on node, as import.meta.env is undefined
	// (when run through Astro, this entire statement will be statically replaced by Vite)
	String(import.meta.env.MODE);
} catch (_) {
	isNode = true;
}

let env: Environment;
if (isNode) {
	env = (await import("./env-node")).default;
} else {
	env = (await import("./env-astro")).default;
}

export default env;
