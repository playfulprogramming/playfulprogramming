import { Root, Node } from "hast";
import { Plugin } from "unified";
import { CollectionInfo } from "types/CollectionInfo";
import { PostInfo, RawPostInfo } from "types/PostInfo";
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
	collectionPosts: PostInfo[];
	referenceTitle: string;
}

/**
 * This plugin expects each chapter of the collection to be done one-by-one until the final chapter is reached
 */
export const rehypeReferencePage: Plugin<
	[RehypeReferencePageOptions],
	Root
> = ({ collection, collectionPosts, referenceTitle }) => {
	const lastPost = collectionPosts[collectionPosts.length - 1];
	const lastPostNumber = lastPost.order!;

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

			const existingCollection = collectionMetaRecord.get(collection.slug);
			const existingLink = existingCollection?.links.find(
				(link) => link.originalHref === href,
			);

			// We've already seen this link before
			if (existingLink) {
				// This relies on the xhtml generation from `html-to-epub` to generate the correct href
				const newHref = `${lastPostNumber + 1}_${referenceTitle.toLowerCase()}.xhtml#${collection.slug}-${existingLink.associatedChapterOrder}`;

				if (parent?.children && index !== undefined) {
					parent.children[index] = SuperScriptLink({
						href: newHref,
						linkProps: linkProps,
						superScriptNumber: existingLink.countWithinCollection,
						children: node.children,
					});
				}

				return;
			}

			const nodeText = toString(node);
			linkCount++;
			links.push({
				node,
				associatedChapterOrder: rawPostInfo.order!,
				countWithinCollection: linkCount,
				originalHref: href,
				originalText: nodeText,
			});

			// This relies on the xhtml generation from `html-to-epub` to generate the correct href
			const newHref = `${lastPostNumber + 1}_${referenceTitle.toLowerCase()}.xhtml#${collection.slug}-${rawPostInfo.order}`;

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
