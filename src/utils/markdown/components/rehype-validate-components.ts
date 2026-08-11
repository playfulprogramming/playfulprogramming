import type * as hast from "hast";
import type { Plugin } from "unified";
import { logError } from "../logger.ts";
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
				logError(
					vfile,
					node,
					`Component ${node.component} cannot be placed in ${parent?.type}!`,
				);
				throw new Error();
			}
		});

		visit(tree, isComponentNode, (node, _, parent) => {
			if (!isValidComponentParent(parent)) {
				logError(
					vfile,
					node,
					`Component ${node.component} cannot be placed in ${parent?.type}!`,
				);
				throw new Error();
			}
		});
	};
};
