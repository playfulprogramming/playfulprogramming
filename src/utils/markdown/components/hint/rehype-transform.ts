import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { RehypeFunctionComponent } from "../types.ts";
import {
	type ComponentMarkupNode,
	type PlayfulRoot,
	createComponent,
} from "../components.ts";
import { isValidComponentParent } from "../rehype-validate-components.ts";
import { isElement } from "../../unist-is-element.ts";

export const rehypeDetailsElement: Plugin<[], PlayfulRoot> = () => {
	return (tree, _) => {
		visit(
			tree,
			{ type: "element", tagName: "details" },
			(node, index, parent) => {
				if (typeof index === "undefined") return;
				if (!isValidComponentParent(parent) && !isElement(parent)) return;

				const summary = node.children.find(
					(child) => isElement(child) && child.tagName === "summary",
				);
				if (!summary) return;

				// visit continues through the original node after replacement. Keep
				// its children array so nested details replacements are retained.
				node.children.splice(node.children.indexOf(summary), 1);

				const replacement: ComponentMarkupNode = {
					type: "playful-component-markup",
					position: node.position,
					component: "hint",
					attributes: {
						title: toString(summary),
					},
					children: node.children,
				};

				const siblings: PlayfulRoot["children"] = parent.children;
				siblings.splice(index, 1, replacement);
			},
		);
	};
};

export const transformDetails: RehypeFunctionComponent = async ({
	attributes,
	children,
}) => {
	return [
		createComponent(
			"Hint",
			{
				title: String(attributes.title),
			},
			children,
		),
	];
};
