import type { VFile } from "vfile";
import type { PostHeadingInfo } from "#types/PostInfo.ts";
import type { CollectionLinks } from "./reference-page/rehype-reference-page.ts";

export type MarkdownKind = "post" | "collection" | "unicorn" | "page";

export type MarkdownFileInfo = {
	kind: MarkdownKind;
	file: string;
	slug?: string;
};

export interface MarkdownVFile extends VFile {
	data: {
		kind: MarkdownKind;
		file: string;
		slug?: string;
		frontmatter?: MarkdownFileInfo;
		frontmatterData?: object;
		headingsWithIds: PostHeadingInfo[];
		collectionLinks?: CollectionLinks[];
		isKatexMathUsed?: boolean;
	};
}

export function isMarkdownVFile(obj: unknown): obj is MarkdownVFile {
	return (
		(typeof obj === "object" &&
			obj &&
			"data" in obj &&
			typeof obj.data === "object" &&
			obj.data &&
			"kind" in obj.data) ??
		false
	);
}
