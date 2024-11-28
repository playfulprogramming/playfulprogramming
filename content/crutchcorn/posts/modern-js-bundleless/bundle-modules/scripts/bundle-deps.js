import esbuild from "esbuild";

Promise.all([
	esbuild.build({
		format: "esm",
		entryPoints: ["./src/vendor/lodash-es/lodash.js"],
		bundle: true,
		platform: "browser",
		outfile: "./src/vendor_bundled/lodash-es.js",
	}),
]).catch(console.error);
