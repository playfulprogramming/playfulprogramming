import { visit } from "unist-util-visit";
import { is } from "unist-util-is";
import { Root, Parent, Element } from "hast";
import { unified, Plugin } from "unified";
import { RehypeFunctionComponent } from "./types";
import rehypeParse from "rehype-parse";
import { logError } from "../logger";
import { VFile } from "vfile";

type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
};

const unifiedRehype = unified().use(rehypeParse, { fragment: true });

const COMPONENT_PREFIX = "::";
const START_PREFIX = "::start:";
const END_PREFIX = "::end:";

const isNodeParent = (node: unknown): node is Parent =>
	!!(typeof node === "object" && node && "children" in node);

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
	return (tree, vfile) => {
		visit(tree, { type: "comment" }, (node, index, parent) => {
			if (index === undefined || !parent) return;
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
				logError(vfile, node, `Unable to parse component: ${valueContent}`);
				return;
			}

			// Find the component matching the given tag
			const component = components[componentNode.tagName];
			if (!component) {
				logError(
					vfile,
					node,
					`Unknown markdown component ${componentNode.tagName}`,
				);
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
					logError(
						vfile,
						node,
						`Ranged component with "${START_PREFIX}${componentNode.tagName}" is missing a corresponding "${END_PREFIX}${componentNode.tagName}"!`,
					);
				}
			}

			// Create the component nodes
			const replacement = component({
				vfile,
				node,
				attributes: Object.fromEntries<string>(
					Object.entries(componentNode.properties).map(([key, value]) => [
						key,
						String(value),
					]),
				),
				// Fetch all nodes between the ranged comments (if indexEnd=0, this will be an empty array)
				children: parent.children.slice(index + 1, indexEnd),
			});

			const replacementArray =
				replacement instanceof Array ? replacement : [replacement];
			// Replace child nodes (including comments) with the replacement component
			parent.children.splice(
				index,
				isRanged ? indexEnd - index + 1 : 1,
				...(replacement ? (replacementArray as never) : []),
			);

			// Recursively transform the children
			// This allows for nested components like ebook only content in tabs
			replacementArray.forEach((replacement) => {
				if (!isNodeParent(replacement)) return;
				replacement?.children?.map((child) => {
					const tree = { type: "root", children: [child] } as Root;
					(
						rehypeTransformComponents as (
							props: RehypeComponentsProps,
						) => (tree: Root, vfile: VFile) => void
					)({ components })(tree, vfile);
					return tree;
				});
			});

			return;
		});
	};
};
