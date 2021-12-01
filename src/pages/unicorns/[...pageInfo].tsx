import { getAllPostsForListView, ListViewPosts, unicorns } from "../../api/api";
import * as React from "react";

import "react-medium-image-zoom/dist/styles.css";
import Link from "next/link";
import { UnicornInfo } from "../../types";
import { postsPerPage } from "../../api/pagination";

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
    // unicornId, "page", pageNum
    pageInfo: [string, string, string];
  };
};

export async function getStaticProps({ params }: Params) {
  const allPosts = getAllPostsForListView();

  const [unicornId, _, paramsPageNum] = params.pageInfo;

  const unicorn = unicorns.find((unicorn) => unicorn.id === unicornId);

  const pageNum = Number(paramsPageNum);

  const skipNumber = postsPerPage * (pageNum - 1);

  const authoredPosts = allPosts
    .filter((post) => post.authors.some((author) => author.id === unicornId))
    // These can't be one filter, unfortunately. Otherwise, `i` isn't correct.
    // If we get worse build times, a good optimization might be to reduce this down to a single `for` loop to handle this all
    .filter((_, i) => i >= skipNumber && i < skipNumber + postsPerPage);

  return {
    props: {
      pageNum: pageNum,
      path: `/unicorns/${params.pageInfo}`,
      authoredPosts,
      unicorn,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPostsForListView();

  // Iterate through `posts` only once. Avoids us having to run `filter`
  // multiple times
  const unicornPostsLookup = posts.reduce<Record<string, number>>(
    (prev, post) => {
      for (const author of post.authors) {
        prev[author.id] = (prev[author.id] ?? 0) + 1;
      }
      return prev;
    },
    {}
  );

  let paths: Params[] = [];
  for (let unicorn of unicorns) {
    const unicornPostsSize = unicornPostsLookup[unicorn.id];
    if (unicornPostsSize <= postsPerPage) continue;

    const numberOfPages = Math.ceil(unicornPostsSize / postsPerPage);

    const pageNumbers: number[] = [];
    // `unicorns/[id]/page/1` is just `/unicorns/[id]`
    for (let i = 2; i <= numberOfPages; i++) pageNumbers.push(i);

    for (const pageNum of pageNumbers) {
      paths.push({
        params: {
          pageInfo: [unicorn.id, "page", `${pageNum}`],
          pageNum: `${pageNum}`,
          unicornId: unicorn.id,
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}
