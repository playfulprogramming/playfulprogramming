import esbuild from "esbuild";

Promise.all([
	esbuild.build({
		format: "esm",
		entryPoints: ["./src/vendor/lit/index.js"],
		bundle: true,
		platform: "browser",
		outfile: "./src/vendor_bundled/lit.js",
	}),
]).catch(console.error);
