import { Feed } from "feed";
import { getAllPosts } from "./api";
import { siteUrl } from "./api/get-site-config";
import fs from "fs";
import path from "path";

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

const posts = getAllPosts({
  title: true,
  description: true,
  published: true,
  slug: true,
  excerpt: true,
  license: {
    displayName: true,
  },
  authors: {
    id: true,
    name: true,
    socials: {
      website: true,
    },
  },
} as const);

posts.forEach((post) => {
  const nodeUrl = `${siteUrl}/posts${post.slug}`;

  feed.addItem({
    title: post.title,
    guid: nodeUrl,
    link: nodeUrl,
    description: post.description || post.excerpt,
    author: post.authors.map((author) => {
      return {
        name: author.name,
        link: `${siteUrl}/unicorns/${author.id}`,
      };
    }),
    date: new Date(post.published),
    copyright: post.license?.displayName,
    extensions: [
      {
        name: "comments",
        objects: `${nodeUrl}#disqus_thread`,
      },
    ],
  });
});

// Relative to root
fs.writeFileSync(path.resolve("./public/rss.xml"), feed.rss2());
