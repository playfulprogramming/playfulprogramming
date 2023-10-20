import { VFile } from "vfile";
import { MarkdownAstroData } from "@astrojs/markdown-remark";

export type AstroVFile = VFile & {
	data: {
		astro: MarkdownAstroData;
	};
};

export function isAstroVFile(obj: unknown): obj is AstroVFile {
	return (
		(typeof obj === "object" &&
			obj &&
			"data" in obj &&
			typeof obj.data === "object" &&
			obj.data &&
			"astro" in obj.data) ??
		false
	);
}
