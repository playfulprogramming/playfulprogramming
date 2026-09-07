import type { VFile } from "vfile";
import type { PostHeadingInfo } from "#types/PostInfo.ts";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import type { CollectionLinks } from "./reference-page/rehype-reference-page.ts";

export type MarkdownKind = "post" | "collection" | "person" | "page" | "snitip";

export type MarkdownFileInfo = {
	kind: MarkdownKind;
	file: string;
	slug?: string;
	warnings?: WarningInfo[];
};

export type WarningInfo = {
	message: string;
	path: string;
	offset?: number;
	col?: number;
	line?: number;
};

export interface MarkdownVFile extends VFile {
	snitipScopeId?: string;
	data: {
		kind: MarkdownKind;
		file: string;
		slug?: string;
		frontmatter?: MarkdownFileInfo;
		headingsWithIds: PostHeadingInfo[];
		snitips: Map<string, SnitipInfo>;
		collectionLinks?: CollectionLinks[];
		isKatexMathUsed?: boolean;
		isMermaidUsed?: boolean;
		warnings: WarningInfo[];
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
