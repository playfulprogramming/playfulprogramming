import { getAllPostsForListView, ListViewPosts, unicorns } from "../../api/api";
import * as React from "react";

import "react-medium-image-zoom/dist/styles.css";
import Link from "next/link";
import { UnicornInfo } from "../../types";

type Props = {
  unicorn: UnicornInfo;
  authoredPosts: ListViewPosts;
};

const UnicornPage = ({ authoredPosts, unicorn }: Props) => {
  return (
    <>
      <h1>
        {unicorn.firstName} {unicorn.lastName}
      </h1>
      <ul>
        {authoredPosts.map((post) => (
          <li key={post.slug}>
            <h2>
              <Link href={`/posts/[slug]`} as={`/posts/${post.slug}`}>
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

export default UnicornPage;

type Params = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const allPosts = getAllPostsForListView();

  const unicorn = unicorns.find((unicorn) => unicorn.id === params.id);

  const authoredPosts = allPosts.filter((post) =>
    post.authors.some((author) => author.id === params.id)
  );

  return {
    props: {
      authoredPosts,
      unicorn,
    },
  };
}

export async function getStaticPaths() {
  const paths = unicorns.map((unicorn) => {
    return {
      params: {
        id: unicorn.id,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
