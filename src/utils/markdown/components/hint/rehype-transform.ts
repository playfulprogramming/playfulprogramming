import type * as hast from "hast";
import type { Plugin } from "unified";
import { find } from "unist-util-find";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { RehypeFunctionComponent } from "../types.ts";
import {
	type ComponentMarkupNode,
	type PlayfulRoot,
	createComponent,
} from "../components.ts";
import { isValidComponentParent } from "../rehype-validate-components.ts";

export const rehypeDetailsElement: Plugin<[], PlayfulRoot> = () => {
	return (tree, _) => {
		visit(
			tree,
			{ type: "element", tagName: "details" },
			(node, index, parent) => {
				if (typeof index === "undefined") return;
				if (!isValidComponentParent(parent)) return;

				const summary = find<hast.Element>(node, {
					type: "element",
					tagName: "summary",
				});
				if (!summary) return;

				const replacement: ComponentMarkupNode = {
					type: "playful-component-markup",
					position: node.position,
					component: "hint",
					attributes: {
						title: toString(summary),
					},
					children: node.children.filter((child) => child !== summary),
				};

				parent.children.splice(index, 1, replacement);
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
