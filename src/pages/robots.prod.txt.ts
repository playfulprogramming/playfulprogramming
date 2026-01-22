import { siteUrl } from "constants/site-config";
import { getAllPosts, getAllCollections } from "utils/api";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import env from "constants/env";

const noIndexPosts = getAllPosts().filter((post) => post.noindex);
const noIndexCollection = getAllCollections().filter(
	(collection) => collection.noindex && collection.pageLayout !== "none",
);

function buildPostUrl(post: PostInfo) {
	return `${post.locale === "en" ? "" : `/${post.locale}`}/posts/${post.slug}`;
}

function buildCollectionUrl(collection: CollectionInfo) {
	return `${collection.locale === "en" ? "" : `/${collection.locale}`}/collections/${collection.slug}`;
}

export const GET = () => {
	let omitPosts = `\n# No index posts\n`;
	for (const post of noIndexPosts) {
		omitPosts += `Disallow: ${buildPostUrl(post)}\n`;
	}

	let omitCollections = `# No index collections\n`;
	for (const collection of noIndexCollection) {
		omitCollections += `Disallow: ${buildCollectionUrl(collection)}\n`;
	}

	const body = `
# *
User-agent: *

# Embedded content
Disallow: /content
${noIndexPosts.length ? omitPosts : ""}
${noIndexCollection.length ? omitCollections : ""}
Allow: /

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap-index.xml
`.trim();
	return new Response(body);
};
