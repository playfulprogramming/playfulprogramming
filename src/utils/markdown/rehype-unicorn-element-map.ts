import { Root, Element } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { getFullRelativePath, isRelativePath } from "../url-paths";

import path from "path";

// TODO: Add switch/case and dedicated files ala "Components"
export const rehypeUnicornElementMap: Plugin<[], Root> = () => {
	return async (tree, file) => {
		const splitFilePath =
			(file.path && path.dirname(file.path).split(path.sep)) || undefined;
		// "collections" | "blog"
		const parentFolder = splitFilePath?.at(-2);
		const slug = splitFilePath?.at(-1);

		visit(tree, (node: Element) => {
			if (node.tagName === "video") {
				node.properties.muted ??= true;
				node.properties.autoPlay ??= true;
				node.properties.controls ??= true;
				node.properties.loop ??= true;
				node.properties.width ??= "100%";
				node.properties.height ??= "auto";
				if (slug) {
					node.properties.src = getFullRelativePath(
						"/content/",
						parentFolder,
						slug,
						node.properties.src.toString(),
					);
				}
			}

			if (node.tagName === "a") {
				const href = node.properties.href;
				const isInternalLink = isRelativePath(href?.toString() || "");
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
