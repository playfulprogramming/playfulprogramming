import { PostHeadingInfo } from "types/PostInfo";
import { unified } from "unified";
import { getMarkdownVFile } from "./getMarkdownVFile";
import { MarkdownFileInfo, MarkdownVFile } from "./types";
import { createHtmlPlugins } from "./createHtmlPlugins";
import * as components from "./components";

export type MarkdownHtml = {
	headingsWithIds: PostHeadingInfo[];
	content: components.PlayfulNode[];
};

const unifiedChain = unified();
createHtmlPlugins(unifiedChain);

export async function getMarkdownHtml(
	post: MarkdownFileInfo,
	vfilePromise: MarkdownVFile | Promise<MarkdownVFile> = getMarkdownVFile(post),
): Promise<MarkdownHtml> {
	const vfile = await vfilePromise;

	const result = await unifiedChain.process(vfile);

	return {
		headingsWithIds: vfile.data.headingsWithIds,
		content: (await result.result) as components.PlayfulNode[],
	};
}
