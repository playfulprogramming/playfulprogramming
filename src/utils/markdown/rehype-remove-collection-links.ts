import { Root } from "hast";
import { Plugin } from "unified";
import { PostInfo } from "types/PostInfo";
import { visit } from "unist-util-visit";
import * as api from "utils/api";
import { MarkdownVFile } from "./types";

function normalizeUrl(url: string) {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const rehypeRemoveCollectionLinks: Plugin<[], Root> = () => {
	return (tree, vfile) => {
		const post = (vfile as MarkdownVFile).data.frontmatter as PostInfo;
		const posts = post.collection
			? api.getPostsByCollection(post.collection, "en")
			: [];

		visit(tree, "element", (node, _index, _parent) => {
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
