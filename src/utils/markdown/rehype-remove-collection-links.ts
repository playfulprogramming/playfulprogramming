import { Root } from "hast";
import { Plugin } from "unified";
import { CollectionInfo } from "types/CollectionInfo";
import { RawPostInfo } from "types/PostInfo";
import { visit } from "unist-util-visit";
import { getPostsByCollection } from "utils/api";

interface RehypeRemoveCollectionLinksOptions {
	collection: CollectionInfo;
}

function normalizeUrl(url: string) {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const rehypeRemoveCollectionLinks: Plugin<
	[RehypeRemoveCollectionLinksOptions],
	Root
> = ({ collection }) => {
	const posts = getPostsByCollection(collection.slug, "en");
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "a") {
				return;
			}
			const { href } = node.properties as Record<string, string>;
			const matchingPost = posts.find((post) => {
				const postUrl = normalizeUrl(`/posts/${post.slug}`);
				const normalizedHref = normalizeUrl(href);
				if (normalizedHref.includes("#")) {
					let [hrefWithoutHash] = normalizedHref.split("#");
					hrefWithoutHash = normalizeUrl(hrefWithoutHash);
					return hrefWithoutHash.endsWith(postUrl);
				}
				return normalizedHref.endsWith(postUrl);
			});
			if (!matchingPost && !href.startsWith("#")) return;
			node.tagName = "span";
			delete node.properties.href;
		});
	};
};
