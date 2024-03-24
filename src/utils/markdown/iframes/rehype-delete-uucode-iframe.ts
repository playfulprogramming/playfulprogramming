import { BuildVisitor, visit } from "unist-util-visit";
import { Root } from "hast";

export const rehypeDeleteUucodeIframe = () => {
	return (tree: Root) => {
		const iframeVisitor: BuildVisitor<Root, "element"> = (
			node,
			index,
			parent,
		) => {
			if (node.tagName === "iframe") {
				const src = node.properties?.src;
				if (src && String(src).includes("uu-code")) {
					if (!parent || !index) return;
					parent.children.splice(index, 1);
				}
			}
		};

		visit(tree, "element", iframeVisitor);
		return tree;
	};
};
