import { Plugin } from "unified";
import rehypeSlug from "rehype-slug-custom-id";
import rehypeRaw from "rehype-raw";
import { rehypeTabs } from "./tabs/rehype-transform";
import { rehypeTooltips } from "./tooltips/rehype-transform";
import { rehypeHints } from "./hints/rehype-transform";
import { rehypeAstroImageMd } from "./rehype-astro-image-md";
import { rehypeUnicornElementMap } from "./rehype-unicorn-element-map";
import { rehypeExcerpt } from "./rehype-excerpt";
import { rehypeUnicornPopulatePost } from "./rehype-unicorn-populate-post";
import { rehypeWordCount } from "./rehype-word-count";
import { rehypeUnicornGetSuggestedPosts } from "./rehype-unicorn-get-suggested-posts";
import { rehypeUnicornIFrameClickToRun } from "./iframes/rehype-transform";
import { rehypeHeadingLinks } from "./heading-links/rehype-transform";
import { MarkdownConfig } from "./constants";
import {
	rehypeMakeHrefPathsAbsolute,
	rehypeMakeImagePathsAbsolute,
} from "./rehype-absolute-paths";
import { rehypeFixTwoSlashXHTML } from "./rehype-fix-twoslash-xhtml";
import { rehypeHeaderText } from "./rehype-header-text";
import { rehypeFileTree } from "./file-tree/rehype-file-tree";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RehypePlugin = Plugin<any[]> | [Plugin<any[]>, any];

export function createRehypePlugins(config: MarkdownConfig): RehypePlugin[] {
	return [
		...(config.format === "html"
			? [rehypeUnicornPopulatePost, rehypeUnicornGetSuggestedPosts]
			: []),
		// This is required to handle unsafe HTML embedded into Markdown
		[rehypeRaw, { passThrough: [`mdxjsEsm`] }],
		// When generating an epub, any relative paths need to be made absolute
		...(config.format === "epub"
			? [
					rehypeFixTwoSlashXHTML,
					[rehypeMakeImagePathsAbsolute, { path: config.path }] as RehypePlugin,
					rehypeMakeHrefPathsAbsolute,
			  ]
			: []),
		// Do not add the tabs before the slug. We rely on some of the heading
		// logic in order to do some of the subheading logic
		[
			rehypeSlug,
			{
				maintainCase: true,
				removeAccents: true,
				enableCustomId: true,
			},
		],
		...(config.format === "html"
			? [
					/**
					 * Insert custom HTML generation code here
					 */
					rehypeTabs,
					rehypeHints,
					rehypeTooltips,
					rehypeAstroImageMd,
					rehypeUnicornIFrameClickToRun,
					rehypeHeadingLinks,
					rehypeUnicornElementMap,
			  ]
			: []),
		...(config.format === "html"
			? [
					[
						rehypeExcerpt,
						{
							maxLength: 150,
						},
					] as RehypePlugin,
					rehypeWordCount,
			  ]
			: []),
		...(config.format === "html" ? [rehypeFileTree, rehypeHeaderText] : []),
	];
}
