import { toString } from "hast-util-to-string";
import { toHtml } from "hast-util-to-html";
import type { Element, ElementContent } from "hast";
import type { RehypeFunctionComponent } from "../types.ts";
import type { ComponentNode } from "../components.ts";
import { isElement } from "#utils/markdown/unist-is-element.ts";
import { isNodeHeading } from "../utils/headings.ts";
import { logError } from "#utils/markdown/logger.ts";
import type { SnitipInfo, SnitipLink } from "#types/SnitipInfo.ts";
import type { MarkdownVFile } from "#utils/markdown/types.ts";
import type { TagInfo } from "#types/TagInfo.ts";
import { getTagById } from "#utils/api.ts";

const isSerializableHastNode = (
	node: ComponentNode["children"][number],
): node is ElementContent =>
	["comment", "element", "raw", "text"].includes(node.type);

function findElementWithId(nodes: ElementContent[]): Element | undefined {
	for (const node of nodes) {
		if (!isElement(node)) continue;
		if (node.properties.id !== undefined) return node;

		const descendant = findElementWithId(node.children);
		if (descendant) return descendant;
	}
}

export const transformSnitip: RehypeFunctionComponent = ({
	vfile,
	node,
	children,
	attributes,
}) => {
	const snitipId = attributes["id"];
	if (!snitipId) {
		logError(vfile, node, "Snitip must have an id!");
		return;
	}

	const headingIndex = children.findIndex(
		(node) => isElement(node) && isNodeHeading(node),
	);

	if (headingIndex < 0) {
		logError(vfile, node, "Snitip must start with a heading!");
		return;
	}

	const heading = children[headingIndex] as Element;
	const imageEl = heading.children
		.filter(isElement)
		.find((node) => node.tagName === "picture")
		?.children?.filter(isElement)
		?.find((node) => node.tagName === "img");

	const title = toString(heading);
	const contents = children.slice(headingIndex + 1);
	const serializableContents = contents.filter(isSerializableHastNode);
	if (serializableContents.length !== contents.length) {
		const unsupportedNode = contents.find(
			(node) => !isSerializableHastNode(node),
		)!;
		logError(
			vfile,
			unsupportedNode,
			"Snitip content cannot contain nested markdown components!",
		);
		return [];
	}

	const elementWithId = findElementWithId(serializableContents);
	if (elementWithId) {
		logError(
			vfile,
			elementWithId,
			"Snitip content cannot contain element IDs!",
		);
		return [];
	}

	const links: SnitipLink[] = [];

	const lastElement = serializableContents.filter(isElement).at(-1);
	if (lastElement?.tagName === "ul") {
		const linkElements = lastElement.children
			.filter(isElement)
			.map((node) => (node.children.length == 1 ? node.children[0] : null));
		const isAnchor = (link: ElementContent | null): link is Element =>
			link !== null && isElement(link) && link.tagName === "a";

		if (linkElements.every(isAnchor)) {
			// If the list is a valid link list, remove it from contents
			const index = serializableContents.indexOf(lastElement);
			if (index != -1) serializableContents.splice(index, 1);

			for (const linkEl of linkElements) {
				links.push({
					name: toString(linkEl),
					href: String(linkEl.properties.href),
				});
			}
		}
	}

	const tagsMeta = new Map<string, TagInfo>();
	if (attributes.tags) {
		for (const tag of attributes.tags.split(",").map((tag) => tag.trim())) {
			if (!tag) continue;
			const tagInfo = getTagById(tag);
			if (!tagInfo) {
				logError(vfile, node, `Tag '${tag}' does not exist!`);
				continue;
			}

			tagsMeta.set(tag, tagInfo);
		}
	}

	const snitip: SnitipInfo = {
		id: snitipId,
		icon: imageEl?.properties?.src?.toString(),
		title,
		content: toHtml(serializableContents),
		links,
		tags: [...tagsMeta.keys()],
		tagsMeta,
		locale: "en",
		locales: ["en"],
	};

	(vfile as MarkdownVFile).data.snitips.set(snitipId, snitip);
	return [];
};
