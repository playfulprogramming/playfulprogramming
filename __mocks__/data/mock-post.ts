import { MockUnicorn, MockUnicornTwo } from "./mock-unicorn";
import { MockLicense } from "./mock-license";
import { ListViewPosts } from "utils/fs/api";
import { PostInfo, RenderedPostInfo } from "types/PostInfo";

export const MockPost: PostInfo & RenderedPostInfo = {
  excerpt: "This would be an auto generated excerpt of the post in particular",
  title: "Post title",
  published: "10-10-2010",
  tags: ["item1"],
  description: "This is a short description dunno why this would be this short",
  authors: [MockUnicorn],
  license: MockLicense,
  slug: "/this-post-name-here",
  headingsWithId: [],
  wordCount: 10000,
  content: "",
};

export const MockMultiAuthorPost: PostInfo & RenderedPostInfo = {
  excerpt:
    "This would be a second auto generated excerpt of the post in particular",
  title: "Another post title",
  published: "10-20-2010",
  tags: ["item1"],
  description:
    "This is another short description dunno why this would be this short",
  authors: [MockUnicornTwo, MockUnicorn],
  license: MockLicense,
  slug: "/this-other-post-name-here",
  headingsWithId: [],
  wordCount: 100000,
  content: "",
};
