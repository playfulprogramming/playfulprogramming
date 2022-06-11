// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {
  getAllPosts,
  getAllPostsForListView,
  getLocalWithMostPosts,
  listViewPostQuery,
  ListViewPosts,
} from "utils/fs/api";
import * as React from "react";

import { postsPerPage } from "constants/pagination";
import { PostListTemplate } from "../../page-components/post-list/PostList";
import { Languages } from "types/index";
import { languages } from "constants/index";

type Props = {
  posts: ListViewPosts;
  path: string;
  pageNum: number;
  numberOfPages: number;
  currentLocale: Languages;
  locales: Record<Languages, string>;
};

const Post = (props: Props) => {
  return (
    <PostListTemplate
      numberOfPages={props.numberOfPages}
      limitNumber={postsPerPage}
      posts={props.posts}
      pageIndex={props.pageNum}
      currentLocale={props.currentLocale}
      locales={props.locales}
    />
  );
};

export default Post;

type Params = {
  params: {
    pageNum: string;
  };
};

export async function getStaticProps({
  params,
  locale,
}: Params & { locale: Languages }) {
  const posts = getAllPostsForListView(locale);

  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  const pageNum = Number(params.pageNum);

  /**
   * We have to assume the most number of pages in getStaticPaths. Because of
   * this, we can't just have the exact number of page to generate. This
   * is how we restore 404 functionality for languages that don't have as
   * many pages
   */
  if (pageNum > numberOfPages) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageNum: pageNum,
      path: `/page/${pageNum}/`,
      posts,
      numberOfPages,
      currentLocale: locale,
      locales: languages,
    },
  };
}

export async function getStaticPaths({
  locales,
  defaultLocale,
}: {
  locales: Languages[];
  defaultLocale: Languages;
}) {
  const numberOfPosts = getLocalWithMostPosts(locales);

  const numberOfPages = Math.ceil(numberOfPosts / postsPerPage);

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
