import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import icon from "astro-icon";
import { siteUrl } from "./src/constants/site-config";
import vercel from "@astrojs/vercel";
import symlink from "symlink-dir";
import * as path from "path";
import { SUPPORTED_IMAGE_SIZES } from "./src/utils/get-picture";
import { AstroUserConfig } from "astro";

await symlink(path.resolve("content"), path.resolve("public/content"));

export default defineConfig({
	site: siteUrl,
	adapter: vercel({
		// Uses Vercel's Image Optimization API: https://vercel.com/docs/image-optimization
		imageService: true,
		imagesConfig: {
			sizes: SUPPORTED_IMAGE_SIZES,
			domains: [],
			formats: ["image/avif", "image/webp"],
		},
		devImageService: "sharp",
	}),
	integrations: [icon(), preact({ compat: true })],
	server: {
		headers: {
			["Cross-Origin-Embedder-Policy"]: "require-corp",
			["Cross-Origin-Opener-Policy"]: "same-origin",
		},
	},
	vite: {
		optimizeDeps: {
			exclude: ["msw", "msw/node", "sharp"],
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
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern",
				},
			},
		},
	},
	markdown: {} as AstroUserConfig["markdown"] as never,
});
