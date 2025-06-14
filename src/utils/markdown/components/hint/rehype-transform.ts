import { Root } from "hast";
import { Plugin } from "unified";
import { find } from "unist-util-find";
import {
	ComponentElement,
	isComponentElement,
} from "../rehype-parse-components";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { RehypeFunctionComponent } from "../types";
import { createComponent } from "../components";

export const rehypeDetailsElement: Plugin<[], Root> = () => {
	return (tree, _) => {
		visit(
			tree,
			{ type: "element", tagName: "details" },
			(node, index, parent) => {
				if (typeof index === "undefined") return;
				if (parent !== tree && !isComponentElement(parent)) return;

				const summary = find(node, { type: "element", tagName: "summary" });
				if (!summary) return;

				const replacement: ComponentElement = {
					type: "element",
					tagName: "playful-component",
					position: node.position,
					properties: {
						name: "hint",
					},
					data: {
						position: {},
						attributes: {
							title: toString(summary as never),
						},
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
