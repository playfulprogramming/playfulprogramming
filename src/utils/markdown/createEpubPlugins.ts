import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import {
	TYPE_FRONTMATTER,
	remarkProcessFrontmatter,
} from "./remark-process-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkToRehype from "remark-rehype";
import rehypeSlug from "rehype-slug-custom-id";
import rehypeRaw from "rehype-raw";
import {
	rehypeMakeHrefPathsAbsolute,
	rehypeMakeImagePathsAbsolute,
} from "./rehype-absolute-paths";
import { rehypeFixTwoSlashXHTML } from "./rehype-fix-twoslash-xhtml";
import { Processor } from "unified";
import rehypeStringify from "rehype-stringify";
import { rehypeExpandDetailsAndSummary } from "./rehype-expand-details-summary";
import { rehypeShikiUU } from "./shiki/rehype-transform";
import {
	rehypeTransformComponents,
	transformNoop,
	transformVoid,
	rehypeParseComponents,
} from "./components";
import { rehypePostShikiTransform } from "./shiki/rehype-post-shiki-transform";
import { rehypeRemoveCollectionLinks } from "./rehype-remove-collection-links";
import { rehypeReferencePage } from "./reference-page/rehype-reference-page";

export function createEpubPlugins(unified: Processor) {
	return (
		unified
			.use(remarkParse, { fragment: true } as never)
			.use(remarkFrontmatter, {
				type: TYPE_FRONTMATTER,
				marker: "-",
			} as never)
			.use(remarkProcessFrontmatter)
			.use(remarkGfm)
			.use(remarkToRehype, { allowDangerousHtml: true })
			.use(rehypeUnwrapImages)
			// This is required to handle unsafe HTML embedded into Markdown
			.use(rehypeRaw, { passThrough: ["mdxjsEsm"] } as never)
			.use(rehypeParseComponents)
			// When generating an epub, any relative paths need to be made absolute
			.use(rehypeFixTwoSlashXHTML)
			.use(rehypeMakeImagePathsAbsolute)
			.use(rehypeMakeHrefPathsAbsolute)
			.use(rehypeExpandDetailsAndSummary)
			.use(rehypeSlug as never, {
				maintainCase: true,
				removeAccents: true,
				enableCustomId: true,
			})
			.use(...rehypeShikiUU)
			.use(rehypePostShikiTransform)
			.use(rehypeRemoveCollectionLinks)
			.use(rehypeReferencePage, { referenceTitle: "References" })
			.use(rehypeTransformComponents, {
				components: {
					filetree: transformNoop,
					["in-content-ad"]: transformNoop,
					["link-preview"]: transformNoop,
					["no-ebook"]: transformVoid,
					["only-ebook"]: transformNoop,
					tabs: transformNoop,
				},
			})
			.use(rehypeStringify)
	);
}
