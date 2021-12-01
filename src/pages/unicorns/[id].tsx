import { getAllPosts, unicorns } from "../../api/api";
import * as React from "react";

import "react-medium-image-zoom/dist/styles.css";
import Link from "next/link";
import Post from "../../types/post";
import { UnicornInfo } from "../../types";

type Props = {
  unicorn: UnicornInfo;
  authoredPosts: Post[];
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

const authorPageListCache = {};

export async function getStaticProps({ params }: Params) {
  const allPosts = getAllPosts(
    {
      title: true,
      published: true,
      slug: true,
      authors: {
        id: true,
        firstName: true,
        lastName: true,
      },
      excerpt: true,
    } as const,
    authorPageListCache
  );

  const unicorn = unicorns.find((unicorn) => unicorn.id === params.id);

  let authoredPosts = allPosts.filter((post) =>
    post.authors.some((author) => author.id === params.id)
  );

  // sort posts by date in descending order
  authoredPosts = authoredPosts.sort((post1, post2) => {
    const date1 = new Date(post1.published);
    const date2 = new Date(post2.published);
    return date1 > date2 ? -1 : 1;
  });

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
