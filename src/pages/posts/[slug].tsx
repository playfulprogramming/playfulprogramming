// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts, postsDirectory } from "../../api/api";
import * as React from "react";

import markdownToHtml from "../../utils/markdownToHtml";
import { useMarkdownRenderer } from "../../hooks/useMarkdownRenderer";
import "react-medium-image-zoom/dist/styles.css";
import { PickDeep } from "ts-util-helpers";
import { PostInfo, RenderedPostInfo } from "types/PostInfo";
import { SeriesPostInfo, seriesPostsPick } from "constants/queries";

type Props = {
  markdownHTML: string;
  slug: string;
  postsDirectory: string;
  wordCount: number;
  seriesPosts: SeriesPostInfo[];
  post: Omit<SlugPostInfo, "content"> & RenderedPostInfo;
};

const Post = ({
  post,
  markdownHTML,
  slug,
  postsDirectory,
  wordCount,
  seriesPosts,
}: Props) => {
  const result = useMarkdownRenderer({
    markdownHTML,
    slug,
    postsDirectory,
  });

  return (
    <>
      <h1>{post.title}</h1>
      <h2>Word count: {wordCount}</h2>
      <p>Headings: {JSON.stringify(post.headingsWithId)}</p>
      <p>Series: {JSON.stringify(seriesPosts)}</p>
      <>{result}</>
    </>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

const seriesPostCacheKey = {};

const postBySlug = {
  title: true,
  slug: true,
  content: true,
  wordCount: true,
  series: true,
  order: true,
} as const;

type SlugPostInfo = PickDeep<true | false, PostInfo, typeof postBySlug>;

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, postBySlug);

  const isStr = (val: any): val is string => typeof val === "string";
  const slug = isStr(post.slug) ? post.slug : "";

  let seriesPosts: any[] = [];
  if (post.series && post.order) {
    const allPosts = getAllPosts(seriesPostsPick, seriesPostCacheKey);

    seriesPosts = allPosts
      .filter((filterPost) => filterPost.series === post.series)
      .sort((sortPost) => Number(sortPost.order) - Number(post.order));
  }

  const { html: markdownHTML, renderedPost } = await markdownToHtml(post);

  return {
    props: {
      post: renderedPost,
      markdownHTML,
      slug: slug,
      postsDirectory,
      wordCount: post.wordCount,
      seriesPosts,
    } as Props,
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts({ slug: true });

  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
