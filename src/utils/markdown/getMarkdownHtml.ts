import { PostHeadingInfo } from "types/PostInfo";
import { unified } from "unified";
import { createRemarkPlugins } from "./createRemarkPlugins";
import { createRehypePlugins } from "./createRehypePlugins";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { getMarkdownVFile } from "./getMarkdownVFile";
import { MarkdownFileInfo, MarkdownVFile } from "./types";

export type MarkdownHtml = {
	headingsWithIds: PostHeadingInfo[];
	html: string;
};

const unifiedChain = unified()
	.use(remarkParse, { fragment: true } as never)
	.use(
		createRemarkPlugins({
			format: "html",
		}),
	)
	.use(remarkToRehype, { allowDangerousHtml: true })
	.use(
		createRehypePlugins({
			format: "html",
		}),
	)
	// Voids: [] is required for html generation
	.use(rehypeStringify, { allowDangerousHtml: true, voids: [] });

export async function getMarkdownHtml(
	post: MarkdownFileInfo,
	vfilePromise: Promise<MarkdownVFile> = getMarkdownVFile(post),
): Promise<MarkdownHtml> {
	const vfile = await vfilePromise;

	const result = await unifiedChain.process(vfile).catch((err) => {
		console.error(`Failed to parse markdown file ${vfile.path}:\n`, err);
		return err.toString();
	});

	return {
		headingsWithIds: vfile.data.headingsWithIds,
		html: result.toString(),
	};
}
