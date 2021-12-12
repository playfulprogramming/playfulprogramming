import { getAllPosts } from "../api";
import { Index } from "flexsearch";

const searchCache = {};

const posts = getAllPosts(
  { content: true, title: true, slug: true },
  searchCache
);

export const index = new Index("memory");

posts.forEach((post) => {
  index.add(post.slug, JSON.stringify(post));
});
