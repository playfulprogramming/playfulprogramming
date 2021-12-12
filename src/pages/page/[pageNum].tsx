// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import { getAllPostsForListView, ListViewPosts } from "../../api/api";
import * as React from "react";

import { postsPerPage } from "../../api/pagination";
import { PostListTemplate } from "../../page-components/post-list/PostList";
import { getNewIndex } from "constants/search";

type Props = {
  posts: ListViewPosts;
  path: string;
  pageNum: number;
  numberOfPages: number;
  exportedIndex: Record<number | string, string>;
};

const Post = (props: Props) => {
  return (
    <PostListTemplate
      numberOfPages={props.numberOfPages}
      limitNumber={postsPerPage}
      posts={props.posts}
      pageIndex={props.pageNum}
      exportedIndex={props.exportedIndex}
    />
  );
};

export default Post;

type Params = {
  params: {
    pageNum: string;
  };
};

const postListContentsCache = {};

export async function getStaticProps({ params }: Params) {
  const posts = getAllPostsForListView();

  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  const pageNum = Number(params.pageNum);

  const skipNumber = postsPerPage * (pageNum - 1);

  const postsToSend = posts.filter(
    (_, i) => i >= skipNumber && i < skipNumber + postsPerPage
  );

  const index = getNewIndex();

  posts.forEach((post) => {
    index.add(post.slug, JSON.stringify(post));
  });

  const exportedIndex: Record<string | number, string> = {};
  await index.export((key, data) => {
    // Keys don't match between import() and export()
    // export() nests keys like reg, reg.cfg, reg.cfg.map, and reg.cfg.map.ctx
    // but import() wants them flat like reg, cfg, map, ctx
    // @see https://github.com/nextapps-de/flexsearch/issues/290#issuecomment-968255507
    const k = key.toString().split(".").pop() || "";
    exportedIndex[k] = data;
  });

  // Temporary hotpatch for issue with `export` async
  // @see https://github.com/nextapps-de/flexsearch/pull/253
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

  return {
    props: {
      pageNum: pageNum,
      path: `/page/${pageNum}/`,
      posts,
      numberOfPages,
      exportedIndex,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPostsForListView();

  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  const pageNumbers: number[] = [];
  // `page/1` is just `/`
  for (let i = 2; i <= numberOfPages; i++) pageNumbers.push(i);

  const paths = pageNumbers.map((pageNum) => {
    return {
      params: {
        pageNum: `${pageNum}`,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
