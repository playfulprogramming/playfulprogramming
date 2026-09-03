import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import icon from "astro-icon";
import { symlinkDir } from "symlink-dir";
import * as path from "path";
import * as os from "os";
import type { AstroUserConfig } from "astro";
import node from "@astrojs/node";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import projectSettings from "./project.inlang/settings.json" with { type: "json" };

await symlinkDir(path.resolve("content"), path.resolve("public/content"));

const isServerBuild = process.env.BUILD_OUTPUT === "server";

// Astro warns that high concurrency increases memory use and can
// destabilize builds, so cap it rather than trust the raw core count.
const buildConcurrency = Math.min(os.availableParallelism(), 8);

export default defineConfig({
	// import.meta.env does not resolve to env variables in the config script!
	// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
	site:
		process.env.SITE_URL ??
		(process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: undefined) ??
		"https://playfulprogramming.com",
	output: isServerBuild ? "server" : "static",
	build: {
		concurrency: buildConcurrency,
	},
	i18n: {
		defaultLocale: projectSettings.baseLocale,
		locales: projectSettings.locales,
		routing: isServerBuild
			? "manual"
			: {
					prefixDefaultLocale: false,
				},
	},
	adapter: isServerBuild
		? node({
				mode: "standalone",
			})
		: undefined,
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
			config: {
				limitInputPixels: false,
			},
		},
	},
	integrations: [
		icon(),
		preact({
			compat: true,
			babel: {
				generatorOpts: {
					importAttributesKeyword: "with",
				},
			},
		}),
	],
	server: {
		headers: {
			"Cross-Origin-Embedder-Policy": "require-corp",
			"Cross-Origin-Opener-Policy": "same-origin",
		},
	},
	vite: {
		define: {
			__PARAGLIDE_SERVER_OUTPUT__: JSON.stringify(isServerBuild),
		},
		plugins: [
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/paraglide",
				emitTsDeclarations: true,
				strategy: ["url", "globalVariable", "baseLocale"],
			}),
		],
		server: {
			allowedHosts: ["localhost", "web"],
		},
		optimizeDeps: {
			exclude: ["msw", "msw/node", "sharp"],
		},
		resolve: {
			alias: {
				src: path.resolve(import.meta.dirname, "./src"),
			},
		},
		ssr: {
			external: ["svgo"],
			noExternal: [
				"react-aria",
				"react-stately",
				/@react-aria/,
				/@react-stately/,
				/@react-types/,
			],
		},
	},
	markdown: {} as AstroUserConfig["markdown"] as never,
});
