import { Root, Node } from "hast";
import { Plugin } from "unified";
import { CollectionInfo } from "types/CollectionInfo";
import { RawPostInfo } from "types/PostInfo";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { SuperScriptLink } from "./link";

interface CollectionLinks {
	node: Node;
	originalText: string;
	originalHref: string;
	// The chapter that the link is associated with
	associatedChapterOrder: number;
	/**
	 * A sequential count of the link in the collection (not the chapter)
	 *
	 * @example
	 * If the collection has 3 chapters, each with 3 links, `count` would be `9` in the final link
	 */
	countWithinCollection: number;
}

interface CollectionMeta {
	links: CollectionLinks[];
	collectionMeta: CollectionInfo;
}

export const collectionMetaRecord = new Map<string, CollectionMeta>();

interface RehypeReferencePageOptions {
	collection: CollectionInfo;
}

/**
 * This plugin expects each chapter of the collection to be done one-by-one until the final chapter is reached
 */
export const rehypeReferencePage: Plugin<
	[RehypeReferencePageOptions],
	Root
> = ({ collection }) => {
	let linkCount = 0;

	const links: CollectionLinks[] = [];
	collectionMetaRecord.set(collection.slug, {
		links,
		collectionMeta: collection,
	});

	return (tree, file) => {
		const rawPostInfo = file.data.frontmatterData as RawPostInfo;
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "a") {
				return;
			}
			const { href, ...linkProps } = node.properties as Record<string, string>;
			const nodeText = toString(node);
			linkCount++;
			links.push({
				node,
				associatedChapterOrder: rawPostInfo.order!,
				countWithinCollection: linkCount,
				originalHref: href,
				originalText: nodeText,
			});

			const newHref = `#${collection.slug}-${rawPostInfo.order}`;

			if (parent?.children && index !== undefined) {
				parent.children[index] = SuperScriptLink({
					href: newHref,
					linkProps: linkProps,
					superScriptNumber: linkCount,
					children: node.children,
				});
			}
		});
	};
};
