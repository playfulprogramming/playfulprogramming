import { VFile } from "vfile";
import { MarkdownAstroData } from "@astrojs/markdown-remark";

export type AstroVFile = VFile & {
	data: {
		astro: MarkdownAstroData;
	};
};
