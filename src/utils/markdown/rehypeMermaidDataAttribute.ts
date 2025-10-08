import { visit } from "unist-util-visit";
import type { Root, Element, Text } from "hast";

/**
 * Rehype plugin to preserve Mermaid diagram source in a data attribute.
 */
export function rehypeMermaidDataAttribute() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			const classList = node.properties?.className as string[] | undefined;

			if (node.tagName === "pre" && classList?.includes("mermaid")) {
				const textNode = node.children.find(
					(c): c is Text => c.type === "text",
				);

				const graphSource = textNode?.value?.trim() ?? "";

				// Add the original graph text to a data attribute
				node.properties = {
					...node.properties,
					"data-graph": graphSource,
				};
			}
		});
	};
}
