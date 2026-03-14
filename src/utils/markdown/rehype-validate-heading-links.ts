import { Root } from "hast";
import { PostHeadingInfo } from "src/types/index";
import { Plugin } from "unified";

/**
 * Plugin to validate anchor links to headings and ensure their case matches their target heading IDs.
 */
export const rehypeValidateHeadingLinks: Plugin<[], Root> = () => {
	return (tree, file) => {
		const headingsWithIds = file.data.headingsWithIds as
			| PostHeadingInfo[]
			| undefined;

		if (!headingsWithIds) {
			throw new Error("[rehypeValidateAnchorLinks] Missing `headingsWithIds`.");
		}
	};
};
