import * as hast from "hast";
import { Plugin } from "unified";
import { logError } from "../logger";
import { visit } from "unist-util-visit";
import { isComponentElement } from "./rehype-parse-components";
import { ComponentNode, isComponentNode } from "./components";

export const rehypeValidateComponents: Plugin<[], hast.Root> = () => {
	return (tree, vfile) => {
		visit(tree, isComponentElement, (node, _, parent) => {
			if (
				parent !== tree &&
				!isComponentNode(parent) &&
				!isComponentElement(parent)
			) {
				logError(
					vfile,
					node,
					`Component ${node.properties.name} cannot be placed in ${parent?.type}!`,
				);
				throw new Error();
			}
		});

		visit(
			tree,
			isComponentNode,
			(
				node: ComponentNode,
				_,
				parent: hast.Element | hast.Root | undefined,
			) => {
				if (
					parent !== tree &&
					!isComponentNode(parent) &&
					!isComponentElement(parent)
				) {
					logError(
						vfile,
						node,
						`Component ${node.component} cannot be placed in ${parent?.type}!`,
					);
					throw new Error();
				}
			},
		);
	};
};
