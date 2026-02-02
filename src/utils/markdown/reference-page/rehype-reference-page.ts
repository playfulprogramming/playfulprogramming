import { Root, Node } from "hast";
import { Plugin } from "unified";
import { PostInfo, RawPostInfo } from "types/PostInfo";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { SuperScriptLink } from "./link";
import * as api from "utils/api";
import { MarkdownVFile } from "../types";

export interface CollectionLinks {
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

interface RehypeReferencePageOptions {
	referenceTitle: string;
}

/**
 * This plugin expects each chapter of the collection to be done one-by-one until the final chapter is reached
 */
export const rehypeReferencePage: Plugin<
	[RehypeReferencePageOptions],
	Root
> = ({ referenceTitle }) => {
	return (tree, vfile) => {
		const post = (vfile as MarkdownVFile).data.frontmatter as PostInfo;
		const collection = post.collection
			? api.getCollectionBySlug(post.collection, "en")
			: undefined;
		const collectionPosts = post.collection
			? api.getPostsByCollection(post.collection, "en")
			: [];
		if (!collection || !collectionPosts.length) return;

		const lastPost = collectionPosts[collectionPosts.length - 1];
		const lastPostNumber = lastPost.order!;

		const links: CollectionLinks[] =
			(vfile as MarkdownVFile).data.collectionLinks ?? [];
		(vfile as MarkdownVFile).data.collectionLinks = links;

		const rawPostInfo = vfile.data.frontmatterData as RawPostInfo;
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "a") {
				return;
			}
			const { href, ...linkProps } = node.properties as Record<string, string>;

			if (!href.startsWith("https:")) {
				return;
			}

			const existingLink = links.find((link) => link.originalHref === href);

			// We've already seen this link before
			if (existingLink) {
				// This relies on the xhtml generation from `html-to-epub` to generate the correct href
				const newHref = `${lastPostNumber + 1}_${referenceTitle.toLowerCase()}.xhtml#${collection.slug}-${existingLink.associatedChapterOrder}`;

				if (parent?.children && index !== undefined) {
					parent.children[index] = SuperScriptLink({
						href: newHref,
						linkProps,
						superScriptNumber: existingLink.countWithinCollection,
						children: node.children,
					});
				}

				return;
			}

			const nodeText = toString(node);
			const countWithinCollection = links.length + 1;
			links.push({
				node,
				associatedChapterOrder: rawPostInfo.order!,
				countWithinCollection,
				originalHref: href,
				originalText: nodeText,
			});

			// This relies on the xhtml generation from `html-to-epub` to generate the correct href
			const newHref = `${lastPostNumber + 1}_${referenceTitle.toLowerCase()}.xhtml#${collection.slug}-${rawPostInfo.order}`;

			if (parent?.children && index !== undefined) {
				parent.children[index] = SuperScriptLink({
					href: newHref,
					linkProps,
					superScriptNumber: countWithinCollection,
					children: node.children,
				});
			}
		});
	};
};
