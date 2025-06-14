import { getHeaderNodeId, slugs } from "rehype-slug-custom-id";
import { Element, Node } from "hast";
import { toString } from "hast-util-to-string";
import { RehypeFunctionComponent } from "../types";
import { TabInfo } from "./types";
import { createComponent } from "../components";

const isNodeHeading = (n: Element) =>
	n.type === "element" && /h[1-6]/.exec(n.tagName);

const findLargestHeading = (nodes: Element[]) => {
	let largestSize = Infinity;
	for (const node of nodes) {
		if (!isNodeHeading(node)) continue;
		const size = parseInt(node.tagName.substring(1), 10);
		largestSize = Math.min(largestSize, size);
	}
	return largestSize;
};

const isNodeLargestHeading = (n: Element, largestSize: number) =>
	isNodeHeading(n) && parseInt(n.tagName.substring(1), 10) === largestSize;

export const transformTabs: RehypeFunctionComponent = async ({
	children,
	processComponents,
}) => {
	let sectionStarted = false;
	const largestSize = findLargestHeading(children as Element[]);
	const tabs: Array<Omit<TabInfo, "contents"> & { contents: Node[] }> = [];

	for (const localNode of children as Element[]) {
		if (!sectionStarted && !isNodeLargestHeading(localNode, largestSize)) {
			continue;
		}
		sectionStarted = true;

		// If this is a heading, start a new tab entry...
		if (isNodeLargestHeading(localNode, largestSize)) {
			// Make sure that all tabs labeled "thing" aren't also labeled "thing2"
			slugs.reset();
			const { id: headerSlug } = getHeaderNodeId(localNode, {
				enableCustomId: true,
			});

			tabs.push({
				slug: headerSlug,
				name: toString(localNode as never),
				contents: [],
				headers: [],
			});

			continue;
		}

		// For any other heading found in the tab contents, append to the nested headers array
		if (isNodeHeading(localNode) && tabs.length) {
			const lastTab = tabs.at(-1);

			// Store the related tab ID in the attributes of the header
			localNode.properties["data-tabname"] = lastTab?.slug;

			// Add header ID to array
			tabs.at(-1)?.headers?.push(String(localNode.properties.id));
		}

		// Otherwise, append the node as tab content
		tabs.at(-1)?.contents?.push(localNode);
	}

	const tabsProp = await Promise.all(
		tabs.map(async (tab) => {
			const contents = await processComponents(tab.contents);
			return {
				...tab,
				contents,
			};
		}),
	);

	return [
		createComponent("Tabs", {
			tabs: tabsProp,
		}),
	];
};
