import type { Environment } from "./types.ts";

let isAstro: boolean;
try {
	// This will throw an error if run on node without Vite, as import.meta.env is undefined
	// (when run through Astro, this entire statement will be statically replaced)
	isAstro = import.meta.env.BUILD_OUTPUT !== "server";
} catch (_) {
	isAstro = false;
}

// Environment must either use import.meta.env or process.env depending on where/how this is run
// Since Vite replaces import.meta.env replaces, runtime logic is not possible here
let env: Environment;
if (isAstro) {
	env = (await import("./env-astro.ts")).default;
} else {
	env = (await import("./env-node.ts")).default;
}

export default env;
