import { getAllPostsForListView, ListViewPosts } from "utils/fs/api";
import React from "react";
import { postsPerPage } from "constants/pagination";
import { PostListTemplate } from "../page-components/post-list/PostList";
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

const Index = (props: Props) => {
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

export default Index;

export async function getStaticProps({ locale }: { locale: Languages }) {
  const posts = getAllPostsForListView(locale);

  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  const pageNum = 1;

  return {
    props: {
      pageNum: pageNum,
      path: `/`,
      posts,
      numberOfPages,
      currentLocale: locale,
      locales: languages,
    },
  };
}
