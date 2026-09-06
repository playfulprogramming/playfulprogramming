import { unified } from "unified";
import { getMarkdownVFile } from "./getMarkdownVFile.ts";
import type { MarkdownFileInfo, MarkdownVFile } from "./types.ts";
import { createHtmlPlugins } from "./createHtmlPlugins.ts";
import type * as components from "./components/index.ts";

export type MarkdownHtml = MarkdownVFile["data"] & {
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
		...vfile.data,
		content: (await result.result) as components.PlayfulNode[],
	};
}
