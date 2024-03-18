import rehypeSlug from "rehype-slug-custom-id";
import rehypeRaw from "rehype-raw";
import { rehypeTabs } from "./tabs/rehype-transform";
import { rehypeTooltips } from "./tooltips/rehype-transform";
import { rehypeHints } from "./hints/rehype-transform";
import { rehypeAstroImageMd } from "./picture/rehype-transform";
import { rehypeUnicornElementMap } from "./rehype-unicorn-element-map";
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
import { PluggableList } from "unified";
import { dirname, relative, resolve } from "path";
import { VFile } from "vfile";
import { siteMetadata } from "../../constants/site-config";
import branchDefault from "git-branch";

const branch =
	(branchDefault as never as { default: typeof branchDefault }).default ??
	branchDefault;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRehypePlugins(config: MarkdownConfig): PluggableList {
	const noop = () => {};
	return [
		// This is required to handle unsafe HTML embedded into Markdown
		[rehypeRaw, { passThrough: ["mdxjsEsm"] }],
		// When generating an epub, any relative paths need to be made absolute
		config.format === "epub" ? rehypeFixTwoSlashXHTML : noop,
		config.format === "epub"
			? [rehypeMakeImagePathsAbsolute, { path: config.path }]
			: noop,
		config.format === "epub" ? rehypeMakeHrefPathsAbsolute : noop,
		config.format === "epub" ? rehypeNoEbook : noop,
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
		/**
		 * Insert custom HTML generation code here
		 */
		config.format === "html" ? rehypeTabs : noop,
		config.format === "html" ? rehypeHints : noop,
		config.format === "html" ? rehypeTooltips : noop,
		config.format === "html" ? rehypeAstroImageMd : noop,
		config.format === "html"
			? [
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
			  ]
			: noop,
		config.format === "html" ? rehypeUnicornElementMap : noop,
		config.format === "html" ? rehypeTwoslashTabindex : noop,
		config.format === "html" ? rehypeFileTree : noop,

		config.format === "html" ? rehypeHeaderText : noop,
		config.format === "html"
			? [
					rehypeHeaderClass,
					{
						// the page starts at h3 (under {title} -> "Post content")
						depth: 2,
						// visually, headings should start at h2-h6
						className: (depth: number) =>
							`text-style-headline-${Math.min(depth + 1, 6)}`,
					},
			  ]
			: noop,
		config.format === "html" ? rehypeInContentAd : noop,
	];
}
