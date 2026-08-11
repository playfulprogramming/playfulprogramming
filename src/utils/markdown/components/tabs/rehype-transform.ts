import { getHeaderNodeId, slugs } from "rehype-slug-custom-id";
import type { Element } from "hast";
import { toString } from "hast-util-to-string";
import type { RehypeFunctionComponent } from "../types.ts";
import type { TabInfo } from "./types.ts";
import { type PlayfulRoot, createComponent } from "../components.ts";
import {
	findLargestHeading,
	isNodeLargestHeading,
	isNodeHeading,
} from "../utils/headings.ts";

export const transformTabs: RehypeFunctionComponent = async ({ children }) => {
	let sectionStarted = false;
	const largestSize = findLargestHeading(children as Element[]);
	const tabs: Array<TabInfo> = [];
	const tabsChildren: PlayfulRoot[] = [];

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
				name: toString(localNode),
				headers: [],
			});
			tabsChildren.push({
				type: "root",
				children: [],
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
		tabsChildren.at(-1)?.children?.push(localNode);
	}

	return [createComponent("Tabs", { tabs }, tabsChildren)];
};
