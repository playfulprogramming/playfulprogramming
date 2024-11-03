import esbuild from "esbuild";

esbuild
	.build({
		format: "esm",
		entryPoints: ["./src/vendor/dayjs/esm/index.js"],
		bundle: true,
		platform: "browser",
		outfile: "./src/vendor_bundled/dayjs.js",
	})
	.catch(console.error);
