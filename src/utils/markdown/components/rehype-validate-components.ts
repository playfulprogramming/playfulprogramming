import type * as hast from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import {
	type PlayfulRoot,
	isComponentMarkup,
	isComponentNode,
} from "./components.ts";
import { isRoot } from "../unist-is-element.ts";

export function isValidComponentParent(node: hast.Node | undefined) {
	return isRoot(node) || isComponentNode(node) || isComponentMarkup(node);
}

export const rehypeValidateComponents: Plugin<[], PlayfulRoot> = () => {
	return (tree, vfile) => {
		visit(tree, isComponentMarkup, (node, _, parent) => {
			if (!isValidComponentParent(parent)) {
				vfile.fail(
					`Component ${node.component} cannot be placed in ${parent?.type}!`,
					{
						place: node.position,
						source: "rehype-validate-components",
						ruleId: "invalid-parent",
					},
				);
			}
		});

		visit(tree, isComponentNode, (node, _, parent) => {
			if (!isValidComponentParent(parent)) {
				vfile.fail(
					`Component ${node.component} cannot be placed in ${parent?.type}!`,
					{
						place: node.position,
						source: "rehype-validate-components",
						ruleId: "invalid-parent",
					},
				);
			}
		});
	};
};
