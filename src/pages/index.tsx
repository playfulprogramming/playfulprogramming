import { getAllPostsForListView, ListViewPosts } from "../api";
import React from "react";
import Link from "next/link";

type Props = {
  allPosts: ListViewPosts;
};

const Index = ({ allPosts }: Props) => {
  return (
    <>
      <ul>
        {allPosts.map((post) => (
          <li key={post.slug}>
            <h2>
              <Link href={`/posts/[slug]`} as={`/posts/${post.slug}`} passHref>
                <a>{post.title}</a>
              </Link>
            </h2>
            <p>{post.published}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  let allPosts = getAllPostsForListView();
  return {
    props: { allPosts },
  };
};
