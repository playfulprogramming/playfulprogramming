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
import { posts } from "./src/utils/data";

await symlink(path.resolve("content"), path.resolve("public/content"));

export default defineConfig({
	site: siteUrl,
	adapter: vercel(),
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
				// return true, unless last part of the URL ends with "_noindex"
				// in which case it should not be in the sitemap
				const lastPartOfSlug = page
					.split("/")
					.filter((part) => !!part.length)
					.at(-1);

				if (lastPartOfSlug!.endsWith("_noindex")) return false;
				const relatedPost = posts.get(lastPartOfSlug!);
				if (relatedPost && relatedPost[0]?.originalLink) return false;
				return true;
			},
			serialize({ url, ...rest }) {
				return {
					// remove trailing slash from sitemap URLs
					url: url.replace(/\/$/g, ""),
					...rest,
				};
			},
		}),
	],
	vite: {
		ssr: {
			external: ["svgo", "msw", "msw/node"],
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
