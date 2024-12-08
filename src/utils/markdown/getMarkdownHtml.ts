import { PostHeadingInfo } from "types/PostInfo";
import { unified } from "unified";
import { getMarkdownVFile } from "./getMarkdownVFile";
import { MarkdownFileInfo, MarkdownVFile } from "./types";
import { createHtmlPlugins } from "./createHtmlPlugins";
import type { User } from "@clerk/astro/server";

export type MarkdownHtml = {
	headingsWithIds: PostHeadingInfo[];
	html: string;
};

declare module "unified" {
	interface Data {
		user?: User;
	}
}

const unifiedChain = unified();
createHtmlPlugins(unifiedChain);

export interface GetMarkdownHTMLProps {
	fileInfo: MarkdownFileInfo;
	user?: User;
	vfilePromise?: MarkdownVFile | Promise<MarkdownVFile>;
}

export async function getMarkdownHtml({
	fileInfo,
	user,
	vfilePromise = getMarkdownVFile(fileInfo),
}: GetMarkdownHTMLProps): Promise<MarkdownHtml> {
	const vfile = await vfilePromise;

	const result = await unifiedChain
		.data("user", user)
		.process(vfile)
		.catch((err) => {
			console.error(`Failed to parse markdown file ${vfile.path}:\n`, err);
			return err.toString();
		});

	return {
		headingsWithIds: vfile.data.headingsWithIds,
		html: result.toString(),
	};
}
