import { Feed } from "feed";
import { MarkdownInstance } from "astro";
import { siteUrl } from "constants/site-config";
import { ExtendedPostInfo } from "types/index";

const postImportResult = import.meta.glob<MarkdownInstance<ExtendedPostInfo>>(
	"../../content/blog/**/*.md",
	{ eager: true },
);
const posts = Object.values(postImportResult);

export const get = () => {
	const feed = new Feed({
		title: "Unicorn Utterances's RSS Feed",
		description:
			"Learning programming from magically majestic words. A place to learn about all sorts of programming topics from entry-level concepts to advanced abstractions",
		id: siteUrl,
		link: siteUrl,
		language: "en",
		image: `${siteUrl}/image.png`,
		favicon: `${siteUrl}/favicon.ico`,
		copyright: `Contributor's rights reserved ${new Date().getFullYear()}, Unicorn Utterances`,
		feedLinks: {
			json: `${siteUrl}/rss.json`,
			atom: `${siteUrl}/rss.xml`,
		},
	});

	posts
		.sort((a, b) =>
			new Date(b.frontmatter.published) > new Date(a.frontmatter.published)
				? 1
				: -1,
		)
		.forEach((post) => {
			const nodeUrl = `${siteUrl}/posts/${post.frontmatter.slug}`;

			feed.addItem({
				title: post.frontmatter.title,
				guid: nodeUrl,
				link: nodeUrl,
				description: post.frontmatter.description || post.frontmatter.excerpt,
				author: post.frontmatter.authorsMeta.map((author) => {
					return {
						name: author.name,
						link: `${siteUrl}/unicorns/${author.id}`,
					};
				}),
				date: new Date(post.frontmatter.published),
				copyright: post.frontmatter.licenseMeta?.displayName,
				extensions: [
					{
						name: "comments",
						objects: `${nodeUrl}#disqus_thread`,
					},
				],
			});
		});

	return { body: feed.rss2() };
};
