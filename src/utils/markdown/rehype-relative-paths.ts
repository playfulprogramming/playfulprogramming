import { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { isMarkdownVFile } from "./types";
import { dirname, join, relative } from "path";
import fs from "fs/promises";
import { logError } from "./logger";

/**
 * Transform links to relative files (e.g. [find the slides here](./slides.pptx)) that are placed
 * adjacent to the post markdown so that they resolve to the hosted content dir.
 */
export const rehypeRelativePaths: Plugin<[], Root> = () => {
	return async (tree, vfile) => {
		let path = "";
		if (isMarkdownVFile(vfile)) {
			const file = relative(process.cwd(), vfile.data.file);
			path = dirname(file);
		}

		async function visitor(node: Element) {
			const href = node.properties!.href as string;
			// If the URL is already parsed or absolute, skip it
			if (URL.canParse(href) || href.startsWith("#") || href.startsWith("/"))
				return;

			// Attempt to locate the file in FS
			const fileUrl = join(path, href);
			const fileStat = await fs.stat(fileUrl).catch(() => undefined);
			if (!fileStat?.isFile) {
				logError(vfile, node, "Unable to locate relative file:", fileUrl);
				return;
			}

			// If the file is successfully located, transform to an absolute path
			node.properties!.href = `/${fileUrl}`;
		}

		const promises: Array<Promise<void>> = [];
		visit(tree, { type: "element", tagName: "a" }, (node) => {
			promises.push(visitor(node));
		});
		await Promise.all(promises);
		return tree;
	};
};
