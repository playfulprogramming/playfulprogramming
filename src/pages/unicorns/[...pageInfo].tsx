import { getAllPostsForListView, ListViewPosts, unicorns } from "utils/fs/api";
import * as React from "react";

import { Languages, UnicornInfo } from "../../types";
import { postsPerPage } from "constants/pagination";
import { SEO } from "components/seo";
import { PostListProvider } from "constants/post-list-context";
import { ProfileHeader } from "../../page-components/unicorns/profile-header";
import { WordCount } from "../../page-components/unicorns/word-count";
import { FilterSearchBar } from "components/filter-search-bar";
import { PostList } from "components/post-card-list";
import { Pagination } from "components/pagination";
import { useRouter } from "next/router";

type Props = {
  unicorn: UnicornInfo;
  authoredPosts: ListViewPosts;
  basePath: string;
  pageNum: number;
  numberOfPages: number;
  wordCount: number;
};

const UnicornPage = ({
  authoredPosts,
  unicorn,
  basePath,
  pageNum,
  numberOfPages,
  wordCount,
}: Props) => {
  const router = useRouter() || {};

  return (
    <>
      <SEO
        title={unicorn.name}
        description={unicorn.description}
        unicornsData={[unicorn]}
        type="profile"
        pathName={router.asPath}
      />
      <PostListProvider
        posts={authoredPosts}
        numberOfPages={numberOfPages}
        limitNumber={postsPerPage}
        pageIndex={pageNum}
      >
        <ProfileHeader unicornData={unicorn} />
        <main>
          <FilterSearchBar>
            <WordCount
              wordCount={wordCount}
              numberOfArticles={authoredPosts.length}
            />
          </FilterSearchBar>
          <PostList
            listAriaLabel={`List of posts written by ${unicorn.name}`}
          />
        </main>
        <Pagination absolutePath={basePath} />
      </PostListProvider>
    </>
  );
};

export default UnicornPage;

type Params = {
  params: {
    // unicornId, "page", pageNum
    pageInfo: [string, string, string] | [string];
  };
};

export async function getStaticProps({
  params,
  locale,
}: Params & { locale: Languages }) {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }
  const allPosts = getAllPostsForListView("en");

  const [unicornId, _, paramsPageNum] = params.pageInfo;

  const unicorn = unicorns.find((unicorn) => unicorn.id === unicornId);

  const pageNum = Number(paramsPageNum || 1);

  const authoredPosts = allPosts.filter((post) =>
    post.authors.some((author) => author.id === unicornId)
  );

  const numberOfPages = Math.ceil(authoredPosts.length / postsPerPage);

  const wordCount = authoredPosts.reduce((acc, post) => {
    return acc + post.wordCount;
  }, 0);

  return {
    props: {
      pageNum: pageNum,
      path: `/unicorns/${params.pageInfo.join("/")}`,
      basePath: `/unicorns/${params.pageInfo[0]}`,
      authoredPosts,
      unicorn,
      wordCount,
      numberOfPages,
    },
  };
}

export async function getStaticPaths() {
  // TODO: Handle other languages
  const posts = getAllPostsForListView("en");

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
    paths.push({
      params: {
        pageInfo: [unicorn.id],
      },
    });

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
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}
