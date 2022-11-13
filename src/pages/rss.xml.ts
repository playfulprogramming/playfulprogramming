import rss from "@astrojs/rss";
import { MarkdownInstance } from "astro";
import { siteMetadata, siteUrl } from "constants/site-config";
import { PostInfo } from "types/PostInfo";

const postImportResult = import.meta.glob<MarkdownInstance<PostInfo>>(
	"../../content/blog/**/*.md",
	{ eager: true }
);
const posts = Object.values(postImportResult);

export const get = () =>
	rss({
		title: siteMetadata.title,
		description: siteMetadata.description,
		site: siteUrl,
		items: posts.map((post) => ({
			link: "/posts/" + post.frontmatter.slug,
			title: post.frontmatter.title,
			description: post.frontmatter.description || post.frontmatter.excerpt,
			pubDate: new Date(post.frontmatter.published),
		})),
	});
