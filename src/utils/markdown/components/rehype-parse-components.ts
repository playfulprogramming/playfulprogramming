import { is } from "unist-util-is";
import * as hast from "hast";
import { unified, Plugin } from "unified";
import rehypeParse from "rehype-parse";
import { logError } from "../logger";
import { VFile } from "vfile";

const unifiedRehype = unified().use(rehypeParse, { fragment: true });

const COMPONENT_PREFIX = "::";
const START_PREFIX = "::start:";
const END_PREFIX = "::end:";

export type ComponentElement = hast.Element & {
	tagName: "playful-component";
	properties: hast.Properties & {
		name: string;
	};
	data: hast.ElementData & {
		attributes: Record<string, string>;
	};
};

export function isComponentElement(node: unknown): node is ComponentElement {
	return !!(
		typeof node === "object" &&
		node &&
		"type" in node &&
		node.type === "element" &&
		"tagName" in node &&
		node.tagName == "playful-component"
	);
}

const isNodeComment = (node: unknown): node is hast.Comment =>
	!!(
		typeof node === "object" &&
		node &&
		"type" in node &&
		node.type === "comment"
	);

const isNodeElement = (node: unknown): node is hast.Element =>
	(typeof node === "object" &&
		node &&
		"type" in node &&
		node["type"] === "element") ??
	false;

export const rehypeParseComponents: Plugin<[], hast.Root> = function () {
	function parseComponents(
		tree: hast.Root,
		vfile: VFile,
	): hast.ElementContent[] {
		for (let index = 0; index < tree.children.length; index++) {
			const node = tree.children[index];

			if (!isNodeComment(node)) continue;
			const parent = tree;

			// ` ::start:in-content-ad title="Hello world" `
			const value = String(node.value).trim();
			if (!value.startsWith(COMPONENT_PREFIX)) continue;

			const isRanged = value.startsWith(START_PREFIX);
			// `in-content-ad title="Hello world"`
			const valueContent = isRanged
				? value.substring(START_PREFIX.length)
				: value.substring(COMPONENT_PREFIX.length);

			// Parse the attributes/tagNode from the start tag
			const componentNode = unifiedRehype.parse(`<${valueContent}/>`)
				.children[0];
			if (!isNodeElement(componentNode)) {
				logError(vfile, node, `Unable to parse component: ${valueContent}`);
				continue;
			}

			// If the component is ranged, find the index of its end tag
			let indexEnd = 0;
			if (isRanged) {
				for (let i = index + 1; i < parent.children.length; i++) {
					const nodeEnd = parent.children[i];
					if (
						is(nodeEnd, {
							type: "comment",
							value: ` ${END_PREFIX}${componentNode.tagName} `,
						})
					) {
						indexEnd = i;
						break;
					}
				}

				if (indexEnd == 0) {
					logError(
						vfile,
						node,
						`Ranged component with "${START_PREFIX}${componentNode.tagName}" is missing a corresponding "${END_PREFIX}${componentNode.tagName}"!`,
					);
				}
			}

			// Fetch all nodes between the ranged comments (if indexEnd=0, this will be an empty array)
			const componentChildren = parent.children.slice(index + 1, indexEnd);
			const parsedComponentChildren = parseComponents(
				{ type: "root", children: componentChildren as hast.RootContent[] },
				vfile,
			);

			const replacement: ComponentElement = {
				type: "element",
				tagName: "playful-component",
				position: node.position,
				properties: {
					name: componentNode.tagName,
				},
				data: {
					position: {},
					attributes: Object.fromEntries(
						Object.entries(componentNode.properties).map(([key, value]) => [
							key,
							Array.isArray(value) ? value.join(" ") : String(value),
						]),
					),
				},
				children: parsedComponentChildren,
			};

			tree.children.splice(
				index,
				isRanged ? indexEnd - index + 1 : 1,
				replacement,
			);
		}

		return tree.children as hast.ElementContent[];
	}

	return async (tree, vfile) => {
		parseComponents(tree, vfile);
	};
};
