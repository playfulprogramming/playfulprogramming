import { RehypePlugins } from "astro";
import rehypeSlug from "rehype-slug-custom-id";
import rehypeRaw from "rehype-raw";
import { rehypeTabs } from "./tabs/rehype-transform";
import { rehypeAstroImageMd } from "./rehype-astro-image-md";
import { rehypeUnicornElementMap } from "./rehype-unicorn-element-map";
import { rehypeExcerpt } from "./rehype-excerpt";
import { rehypeUnicornPopulatePost } from "./rehype-unicorn-populate-post";
import { rehypeWordCount } from "./rehype-word-count";
import { rehypeUnicornGetSuggestedPosts } from "./rehype-unicorn-get-suggested-posts";
import { rehypeUnicornIFrameClickToRun } from "./iframes/rehype-transform";
import { rehypeHeadingLinks } from "./heading-links/rehype-transform";
import { MarkdownConfig } from "./constants";

export function createRehypePlugins(config: MarkdownConfig): RehypePlugins {
	return [
		rehypeUnicornPopulatePost,
		rehypeUnicornGetSuggestedPosts,
		// This is required to handle unsafe HTML embedded into Markdown
		[rehypeRaw, { passThrough: [`mdxjsEsm`] }],
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
		...(config.format === "html" && [
			/**
			 * Insert custom HTML generation code here
			 */
			rehypeTabs,
			rehypeAstroImageMd,
			rehypeUnicornIFrameClickToRun,
			rehypeHeadingLinks,
			rehypeUnicornElementMap,
		]),
		[
			rehypeExcerpt,
			{
				maxLength: 150,
			},
		],
		rehypeWordCount,
	];
}
