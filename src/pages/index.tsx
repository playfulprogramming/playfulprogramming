import { getAllPostsForListView, ListViewPosts } from "utils/fs/api";
import React from "react";
import { postsPerPage } from "constants/pagination";
import { PostListTemplate } from "../page-components/post-list/PostList";
import { Languages } from "types/index";

type Props = {
  posts: ListViewPosts;
  path: string;
  pageNum: number;
  numberOfPages: number;
};

const Index = (props: Props) => {
  return (
    <PostListTemplate
      numberOfPages={props.numberOfPages}
      limitNumber={postsPerPage}
      posts={props.posts}
      pageIndex={props.pageNum}
    />
  );
};

export default Index;

export async function getStaticProps({ locale }: { locale: Languages }) {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }

  const posts = getAllPostsForListView();

  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  const pageNum = 1;

  return {
    props: {
      pageNum: pageNum,
      path: `/`,
      posts,
      numberOfPages,
    },
  };
}
