import { is } from "unist-util-is";
import { Root, Element, Comment, RootContent } from "hast";
import { unified, Plugin } from "unified";
import { RehypeFunctionComponent } from "./types";
import rehypeParse from "rehype-parse";
import { logError } from "../logger";
import { VFile } from "vfile";
import * as components from "./components";
import { toHtml, Options as HtmlOptions } from "hast-util-to-html";

type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
	htmlOptions: HtmlOptions;
};

const unifiedRehype = unified().use(rehypeParse, { fragment: true });

const COMPONENT_PREFIX = "::";
const START_PREFIX = "::start:";
const END_PREFIX = "::end:";

const isNodeComment = (node: unknown): node is Comment =>
	!!(
		typeof node === "object" &&
		node &&
		"type" in node &&
		node.type === "comment"
	);

const isNodeElement = (node: unknown): node is Element =>
	(typeof node === "object" &&
		node &&
		"type" in node &&
		node["type"] === "element") ??
	false;

const isNodeComponent = (node: unknown): node is components.ComponentNode =>
	!!(
		typeof node === "object" &&
		node &&
		"type" in node &&
		node["type"] === "component"
	);

export const rehypeTransformComponents: Plugin<[RehypeComponentsProps], Root> =
	function ({ components, htmlOptions }) {
		async function processComponents(tree: Root, vfile: VFile) {
			const results: Array<{
				start: number;
				end: number;
				replacement: ReturnType<RehypeFunctionComponent>;
			}> = [];

			for (let index = 0; index < tree.children.length; index++) {
				const node = tree.children[index];

				if (isNodeComponent(node)) {
					results.push({
						start: index,
						end: index + 1,
						replacement: [node],
					});
					continue;
				}

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

				// Find the component matching the given tag
				const component = components[componentNode.tagName];
				if (!component) {
					logError(
						vfile,
						node,
						`Unknown markdown component ${componentNode.tagName}`,
					);
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

				const replacement = component({
					vfile,
					node,
					attributes: Object.fromEntries<string>(
						Object.entries(componentNode.properties).map(([key, value]) => [
							key,
							String(value),
						]),
					),
					children: componentChildren,
					processComponents: (tree) =>
						processComponents(
							{ type: "root", children: tree as RootContent[] },
							vfile,
						),
				});

				results.push({
					start: index,
					end: isRanged ? indexEnd + 1 : index + 1,
					replacement,
				});

				if (isRanged) {
					index = indexEnd;
				}
			}

			const nodes: components.Node[] = [];
			for (const [result, index] of results.map((r, i) => [r, i] as const)) {
				const preStart = results[index - 1]?.end ?? 0;
				const preEnd = result.start - 1;
				if (preEnd - preStart > 0) {
					nodes.push({
						type: "html",
						innerHtml: toHtml(
							tree.children.slice(preStart, preEnd),
							htmlOptions,
						),
					});
				}

				const replacement = await result.replacement;
				if (replacement) nodes.push(...replacement);
			}

			if ((results.at(-1)?.end ?? 0) < tree.children.length) {
				const postStart = results.at(-1)?.end ?? 0;
				const postEnd = tree.children.length;
				nodes.push({
					type: "html",
					innerHtml: toHtml(
						tree.children.slice(postStart, postEnd),
						htmlOptions,
					),
				});
			}

			return nodes;
		}

		return async (tree, vfile) => {
			const children = await processComponents(tree, vfile);
			tree.children.splice(0, tree.children.length);
			tree.children.push(...(children as unknown as RootContent[]));
		};
	};
