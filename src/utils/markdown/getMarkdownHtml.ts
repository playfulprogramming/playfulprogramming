import { type Processor, unified } from "unified";
import { getMarkdownVFile } from "./getMarkdownVFile.ts";
import type { MarkdownFileInfo, MarkdownVFile } from "./types.ts";
import { createHtmlPlugins } from "./createHtmlPlugins.ts";
import type * as components from "./components/index.ts";
import type { Languages } from "#types/index.ts";
import { createTranslator } from "#utils/translations.ts";

export type MarkdownHtml = MarkdownVFile["data"] & {
	content: components.PlayfulNode[];
};

const unifiedChains = new Map<Languages, Processor>();

function getUnifiedChain(locale: Languages) {
	let unifiedChain = unifiedChains.get(locale);
	if (!unifiedChain) {
		unifiedChain = unified();
		createHtmlPlugins(unifiedChain, createTranslator(locale), locale);
		unifiedChains.set(locale, unifiedChain);
	}
	return unifiedChain;
}

export async function getMarkdownHtml(
	post: MarkdownFileInfo,
	vfilePromise: MarkdownVFile | Promise<MarkdownVFile> = getMarkdownVFile(post),
	locale: Languages = "en",
): Promise<MarkdownHtml> {
	const vfile = await vfilePromise;

	const result = await getUnifiedChain(locale).process(vfile);

	return {
		...vfile.data,
		content: (await result.result) as components.PlayfulNode[],
	};
}
