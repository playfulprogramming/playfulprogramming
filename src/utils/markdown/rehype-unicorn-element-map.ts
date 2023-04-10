import { Root } from "hast";
import { Plugin } from "unified";

import { visit } from "unist-util-visit";

import { EMBED_SIZE } from "./constants";
import { getFullRelativePath, isRelativePath } from "../url-paths";
import { fromHtml } from "hast-util-from-html";

import path from "path";

interface RehypeUnicornElementMapProps {}

function escapeHTML(s) {
	if (!s) return s;
	return s
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

// TODO: Add switch/case and dedicated files ala "Components"
export const rehypeUnicornElementMap: Plugin<
	[RehypeUnicornElementMapProps | never],
	Root
> = () => {
	return async (tree, file) => {
		const splitFilePath = path.dirname(file.path).split(path.sep);
		// "collections" | "blog"
		const parentFolder = splitFilePath.at(-2);
		const slug = splitFilePath.at(-1);

		visit(tree, (node: any) => {
			if (node.tagName === "video") {
				node.properties.muted ??= true;
				node.properties.autoPlay ??= true;
				node.properties.controls ??= true;
				node.properties.loop ??= true;
				node.properties.width ??= "100%";
				node.properties.height ??= "auto";
				node.properties.src = getFullRelativePath(
					"/content/",
					parentFolder,
					slug,
					node.properties.src
				);
			}

			if (node.tagName === "a") {
				const href = node.properties.href;
				const isInternalLink = isRelativePath(href || "");
				if (!isInternalLink) {
					node.properties.target = "_blank";
					node.properties.rel = "nofollow noopener noreferrer";
				}
			}

			if (node.tagName === "table" && !node.properties["has-changed"]) {
				const children = [...node.children];
				const properties = { ...node.properties, "has-changed": true };
				node.tagName = "div";
				node.properties = {
					class: "table-container",
				};
				node.children = [
					{
						tagName: "table",
						type: "element",
						children,
						properties,
					},
				];
			}
		});
	};
};
