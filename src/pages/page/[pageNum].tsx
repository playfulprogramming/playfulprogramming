// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import { getAllPostsForListView, ListViewPosts } from "utils/fs/api";
import * as React from "react";

import { postsPerPage } from "constants/pagination";
import { PostListTemplate } from "../../page-components/post-list/PostList";
import { Languages } from "types/index";

type Props = {
  posts: ListViewPosts;
  path: string;
  pageNum: number;
  numberOfPages: number;
};

const Post = (props: Props) => {
  return (
    <PostListTemplate
      numberOfPages={props.numberOfPages}
      limitNumber={postsPerPage}
      posts={props.posts}
      pageIndex={props.pageNum}
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

export async function getStaticProps({
  params,
  locale,
}: Params & { locale: Languages }) {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }
  const posts = getAllPostsForListView();

  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  const pageNum = Number(params.pageNum);

  return {
    props: {
      pageNum: pageNum,
      path: `/page/${pageNum}/`,
      posts,
      numberOfPages,
    },
  };
}

export async function getStaticPaths() {
  // TODO: Only initially hydrate the current page, then have the server "get"
  // the rest of the posts via GET requests.
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
