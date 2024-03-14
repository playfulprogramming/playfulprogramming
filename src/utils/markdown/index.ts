import { Plugin } from "unified";
import rehypeSlug from "rehype-slug-custom-id";
import rehypeRaw from "rehype-raw";
import { VFile } from "vfile";
import { resolve, relative, dirname } from "path";
import * as branch from "git-branch";
import { rehypeTabs } from "./tabs/rehype-transform";
import { rehypeTooltips } from "./tooltips/rehype-transform";
import { rehypeHints } from "./hints/rehype-transform";
import { rehypeAstroImageMd } from "./rehype-astro-image-md";
import { rehypeUnicornElementMap } from "./rehype-unicorn-element-map";
import { rehypeExcerpt } from "./rehype-excerpt";
import { rehypeUnicornPopulatePost } from "./rehype-unicorn-populate-post";
import { rehypeUnicornGetSuggestedPosts } from "./rehype-unicorn-get-suggested-posts";
import { rehypeUnicornIFrameClickToRun } from "./iframes/rehype-transform";
import { MarkdownConfig } from "./constants";
import {
	rehypeMakeHrefPathsAbsolute,
	rehypeMakeImagePathsAbsolute,
} from "./rehype-absolute-paths";
import { rehypeFixTwoSlashXHTML } from "./rehype-fix-twoslash-xhtml";
import { rehypeHeaderText } from "./rehype-header-text";
import { rehypeHeaderClass } from "./rehype-header-class";
import { rehypeFileTree } from "./file-tree/rehype-file-tree";
import { rehypeTwoslashTabindex } from "./twoslash-tabindex/rehype-transform";
import { rehypeInContentAd } from "./in-content-ad/rehype-transform";
import { rehypeNoEbook } from "./rehype-no-ebook";
import { rehypeExpandDetailsAndSummary } from "./rehype-expand-details-summary";
import { siteMetadata } from "../../constants/site-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RehypePlugin = Plugin<any[]> | [Plugin<any[]>, any];

export function createRehypePlugins(config: MarkdownConfig): RehypePlugin[] {
	return [
		...(config.format === "html"
			? [
					rehypeUnicornPopulatePost,
					rehypeUnicornGetSuggestedPosts,
					[
						rehypeExcerpt,
						{
							maxLength: 150,
						},
					] as RehypePlugin,
			  ]
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
					[
						rehypeUnicornIFrameClickToRun,
						{
							srcReplacements: [
								(val: string, file: VFile) => {
									const iFrameUrl = new URL(val);
									if (!iFrameUrl.protocol.startsWith("uu-code:")) return val;

									const contentDir = dirname(file.path);
									const fullPath = resolve(contentDir, iFrameUrl.pathname);

									const fsRelativePath = relative(process.cwd(), fullPath);

									// Windows paths need to be converted to URLs
									let urlRelativePath = fsRelativePath.replace(/\\/g, "/");

									if (urlRelativePath.startsWith("/")) {
										urlRelativePath = urlRelativePath.slice(1);
									}

									const q = iFrameUrl.search;
									const currentBranch =
										process.env.VERCEL_GIT_COMMIT_REF ?? branch.sync();
									const repoPath = siteMetadata.repoPath;
									const provider = `stackblitz.com/github`;
									return `
										https://${provider}/${repoPath}/tree/${currentBranch}/${urlRelativePath}${q}
									`.trim();
								},
							],
						},
					] as RehypePlugin,
					rehypeUnicornElementMap,
					rehypeTwoslashTabindex,
					rehypeFileTree,
					rehypeExpandDetailsAndSummary,
			  ]
			: [rehypeNoEbook]),
		...(config.format === "html"
			? [
					rehypeHeaderText,
					[
						rehypeHeaderClass,
						{
							// the page starts at h3 (under {title} -> "Post content")
							depth: 2,
							// visually, headings should start at h2-h6
							className: (depth: number) =>
								`text-style-headline-${Math.min(depth + 1, 6)}`,
						},
					] as RehypePlugin,
					rehypeInContentAd,
			  ]
			: []),
	];
}
