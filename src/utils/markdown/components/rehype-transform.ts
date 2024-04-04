import { visit } from "unist-util-visit";
import { is } from "unist-util-is";
import { Root, Node, Element } from "hast";
import { unified, Plugin } from "unified";
import { RehypeFunctionComponent } from "./types";
import rehypeParse from "rehype-parse";

type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
};

const unifiedRehype = unified().use(rehypeParse, { fragment: true });

const COMPONENT_PREFIX = "::";
const START_PREFIX = "::start:";
const END_PREFIX = "::end:";

const isNodeElement = (node: unknown): node is Element =>
	(typeof node === "object" &&
		node &&
		"type" in node &&
		node["type"] === "element") ??
	false;

export const rehypeTransformComponents: Plugin<
	[RehypeComponentsProps],
	Root
> = ({ components }) => {
	return (tree) => {
		visit(tree, { type: "comment" }, (node, index, parent) => {
			if (!index || !parent) return;
			// ` ::start:in-content-ad title="Hello world" `
			const value = String((node as { value?: string }).value).trim();
			if (!value.startsWith(COMPONENT_PREFIX)) return;

			const isRanged = value.startsWith(START_PREFIX);
			// `in-content-ad title="Hello world"`
			const valueContent = isRanged
				? value.substring(START_PREFIX.length)
				: value.substring(COMPONENT_PREFIX.length);

			// Parse the attributes/tagNode from the start tag
			const componentNode = unifiedRehype.parse(`<${valueContent}/>`)
				.children[0];
			if (!isNodeElement(componentNode)) {
				console.warn(`Unable to parse component: ${valueContent}`);
				return;
			}

			// Find the component matching the given tag
			const component = components[componentNode.tagName];
			if (!component) {
				console.warn(`Missing component: ${componentNode.tagName}`);
				return;
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
					console.error(
						`Ranged component with "${START_PREFIX}${componentNode.tagName}" is missing a corresponding "${END_PREFIX}${componentNode.tagName}"!`,
					);
				}
			}

			// Create the component nodes
			const replacement = component({
				attributes: Object.fromEntries<string>(
					Object.entries(componentNode.properties).map(([key, value]) => [
						key,
						String(value),
					]),
				),
				// Fetch all nodes between the ranged comments (if indexEnd=0, this will be an empty array)
				children: parent.children.slice(index + 1, indexEnd),
			});

			// Replace child nodes (including comments) with the replacement component
			parent.children.splice(
				index,
				isRanged ? indexEnd - index + 1 : 1,
				...(replacement
					? ((replacement instanceof Array
							? replacement
							: [replacement]) as never)
					: []),
			);

			return;
		});
	};
};
