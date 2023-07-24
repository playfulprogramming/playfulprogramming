import { defineConfig, AstroUserConfig } from "astro/config";

import remarkUnwrapImages from "remark-unwrap-images";
import remarkGfm from "remark-gfm";
import remarkEmbedder, { RemarkEmbedderOptions } from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import { TwitchTransformer } from "./src/utils/markdown/remark-embedder-twitch";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import { createRehypePlugins } from "./src/utils/markdown";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { EnumChangefreq as ChangeFreq } from "sitemap";
import { siteUrl } from "./src/constants/site-config";

// TODO: Create types
import behead from "remark-behead";

import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import symlink from "symlink-dir";
import * as path from "path";
import svgr from "vite-plugin-svgr";

await symlink(path.resolve("content"), path.resolve("public/content"));

export default defineConfig({
	site: siteUrl,
	integrations: [
		image(),
		preact({ compat: true }),
		mdx(),
		sitemap({
			changefreq: ChangeFreq.DAILY,
			priority: 0.7,
			lastmod: new Date(),
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
			external: ["svgo"],
			noExternal: [
				"react-aria",
				"react-stately",
				/@react-aria/,
				/@react-stately/,
				/@react-types/,
			],
		},
		plugins: [svgr()],
	},
	markdown: {
		mode: "md",
		syntaxHighlight: false,
		smartypants: false,
		gfm: false,
		remarkPlugins: [
			remarkGfm,
			// Remove complaining about "div cannot be in p element"
			remarkUnwrapImages,
			/* start remark plugins here */
			[behead, { depth: 1 }],
			[
				remarkEmbedder,
				{
					transformers: [oembedTransformer, TwitchTransformer],
				} as RemarkEmbedderOptions,
			],
			[
				remarkTwoslash,
				{
					themes: ["css-variables"],
				} as UserConfigSettings,
			],
		],
		rehypePlugins: createRehypePlugins({ format: "html" }),
	} as AstroUserConfig["markdown"] as never,
});
