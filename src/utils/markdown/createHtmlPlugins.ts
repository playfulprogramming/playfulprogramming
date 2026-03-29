import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import {
	TYPE_FRONTMATTER,
	remarkProcessFrontmatter,
} from "./remark-process-frontmatter.ts";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkToRehype from "remark-rehype";
import rehypeSlug from "rehype-slug-custom-id";
import rehypeRaw from "rehype-raw";
import { rehypeAstroImageMd } from "./picture/rehype-transform.ts";
import { rehypePlayfulElementMap } from "./rehype-playful-element-map.ts";
import { rehypeUnicornIFrameClickToRun } from "./iframes/rehype-transform.ts";
import { rehypeHeaderText } from "./rehype-header-text.ts";
import { rehypeValidateHeadingLinks } from "./rehype-validate-heading-links.ts";
import { rehypeHeaderClass } from "./rehype-header-class.ts";
import { Processor } from "unified";
import { rehypeShikiUU } from "./shiki/rehype-transform.ts";
import { rehypeCodeblockMeta } from "./shiki/rehype-codeblock-meta.ts";
import { rehypePostShikiTransform } from "./shiki/rehype-post-shiki-transform.ts";
import {
	rehypeDetailsElement,
	rehypeLinkPreview,
	rehypeTooltips,
	rehypeParseComponents,
	rehypePluginComponents,
	rehypeTransformComponents,
	rehypeValidateComponents,
	transformDetails,
	transformFileTree,
	transformInContentAd,
	transformLinkPreview,
	transformNoop,
	transformTabs,
	transformVoid,
} from "./components/index.ts";
import {
	rehypeCodeEmbed,
	transformCodeEmbed,
} from "./components/code-embed/rehype-transform.ts";
import { rehypeRelativePaths } from "./rehype-relative-paths.ts";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { setMathProperty } from "./katex-css.ts";
import {
	rehypeQuizIndexes,
	transformQuiz,
} from "#utils/markdown/components/quiz/rehype-transform.ts";
import { transformUser } from "#utils/markdown/components/user/rehype-transform.ts";
import { transformQuizRadio } from "./components/quiz/rehype-transform-quiz-radio.ts";

export function createHtmlPlugins(unified: Processor) {
	return (
		unified
			.use(remarkParse, { fragment: true } as never)
			.use(remarkFrontmatter, {
				type: TYPE_FRONTMATTER,
				marker: "-",
			} as never)
			.use(remarkProcessFrontmatter)
			.use(remarkGfm)
			/* start remark plugins here */
			.use(remarkToRehype, { allowDangerousHtml: true })
			// Remove complaining about "div cannot be in p element"
			.use(rehypeUnwrapImages)
			// This is required to handle unsafe HTML embedded into Markdown
			.use(rehypeRaw, { passThrough: ["mdxjsEsm"] })
			.use(rehypeRelativePaths)
			.use(rehypeParseComponents)
			// Do not add the tabs before the slug. We rely on some of the heading
			// logic in order to do some of the subheading logic
			.use(rehypeSlug, {
				maintainCase: true,
				removeAccents: true,
				enableCustomId: true,
			})
			.use(remarkMath)
			.use(rehypeKatex)
			.use(setMathProperty)
			/**
			 * Insert custom HTML generation code here
			 */
			.use(rehypeTooltips)
			.use(rehypeAstroImageMd)
			.use(rehypeLinkPreview)
			.use(rehypeDetailsElement)
			.use(rehypeQuizIndexes)
			.use(rehypeCodeEmbed)
			.use(rehypeUnicornIFrameClickToRun, {
				srcReplacements: [],
			})
			.use(rehypePlayfulElementMap)
			.use(rehypeValidateComponents)
			// Shiki is the last plugin before stringify, to avoid performance issues
			// with node traversal (shiki creates A LOT of element nodes)
			.use(rehypeCodeblockMeta)
			.use(rehypeShikiUU)
			.use(rehypePostShikiTransform)
			.use(rehypeTransformComponents, {
				components: {
					"code-embed": transformCodeEmbed,
					filetree: transformFileTree,
					hint: transformDetails,
					"in-content-ad": transformInContentAd,
					"link-preview": transformLinkPreview,
					"no-ebook": transformNoop,
					"only-ebook": transformVoid,
					tabs: transformTabs,
					"quiz-radio": transformQuizRadio,
					quiz: transformQuiz,
					user: transformUser,
				},
			})
			// rehypeHeaderText must occur AFTER rehypeTransformComponents to correctly ignore headings in role="tabpanel" and <details> elements
			.use(rehypeHeaderText)
			.use(rehypeValidateHeadingLinks)
			.use(rehypeHeaderClass, {
				// the page starts at h3 (under {title} -> "Post content")
				depth: 2,
				// visually, headings should start at h2-h6
				className: (depth: number) =>
					`text-style-headline-${Math.min(depth + 1, 6)}`,
			})
			.use(rehypePluginComponents, {
				htmlOptions: {
					allowDangerousHtml: true,
					voids: [],
				},
			})
	);
}
