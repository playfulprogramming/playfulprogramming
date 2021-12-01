// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import { getAllPostsForListView, ListViewPosts } from "../../api/api";
import * as React from "react";

import "react-medium-image-zoom/dist/styles.css";
import { postsPerPage } from "../../api/pagination";

type Props = {
  posts: ListViewPosts;
  path: string;
  pageNum: number;
};

const Post = (props: Props) => {
  return (
    <>
      <h1>Page: {props.pageNum}</h1>
      {props.posts.map((post) => {
        return <h1 key={post.title}>{post.title}</h1>;
      })}
    </>
  );
};

export default Post;

type Params = {
  params: {
    pageNum: string;
  };
};

const postListCache = {};

export async function getStaticProps({ params }: Params) {
  const posts = getAllPostsForListView();

  const pageNum = Number(params.pageNum);

  const skipNumber = postsPerPage * (pageNum - 1);

  const postsToSend = posts.filter(
    (_, i) => i >= skipNumber && i < skipNumber + postsPerPage
  );

  return {
    props: {
      pageNum: pageNum,
      path: `/page/${pageNum}/`,
      posts: postsToSend,
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
