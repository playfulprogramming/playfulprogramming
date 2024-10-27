import { defineConfig, AstroUserConfig } from "astro/config";

import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { EnumChangefreq as ChangeFreq } from "sitemap";
import { siteUrl } from "./src/constants/site-config";
import vercel from "@astrojs/vercel/static";
import symlink from "symlink-dir";
import * as path from "path";
import { languages } from "./src/constants/index";
import { fileToOpenGraphConverter } from "./src/utils/translations";
import { posts, collections } from "./src/utils/data";
import { SUPPORTED_IMAGE_SIZES } from "./src/utils/get-picture";
import { astroIntegrationCopyGenerated } from "./src/utils/markdown/astro-integration-copy-generated";

await symlink(path.resolve("content"), path.resolve("public/content"));

export default defineConfig({
	site: siteUrl,
	adapter: vercel({
		imageService: true,
		imagesConfig: {
			sizes: SUPPORTED_IMAGE_SIZES,
			domains: [],
			formats: ["image/avif", "image/webp"],
		},
		devImageService: "sharp",
	}),
	integrations: [
		icon(),
		preact({ compat: true }),
		sitemap({
			changefreq: ChangeFreq.DAILY,
			priority: 0.7,
			lastmod: new Date(),
			i18n: {
				defaultLocale: "en",
				locales: Object.keys(languages).reduce(
					(prev, key) => {
						prev[key] = fileToOpenGraphConverter(key as keyof typeof languages);
						return prev;
					},
					{} as Record<string, string>,
				),
			},
			filter(page) {
				const lastPartOfSlug = page
					.split("/")
					.filter((part) => !!part.length)
					.at(-1);

				const relatedPost = posts.get(lastPartOfSlug!);
				if (relatedPost && relatedPost[0]?.originalLink) return false;
				if (relatedPost && relatedPost[0]?.noindex) return false;
				const relatedCollection = collections.get(lastPartOfSlug!);
				if (relatedCollection && relatedCollection[0]?.noindex) return false;
				return true;
			},
			serialize({ url, ...rest }) {
				return {
					url: url.replace(/\/$/g, ""),
					...rest,
				};
			},
		}),
		astroIntegrationCopyGenerated(),
	],
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
