import React, { useMemo } from "react";
import { SEO } from "components/seo";
import { PostListHeader } from "./post-list-header";
import { PostList } from "components/post-card-list";
import { PostListProvider } from "constants/post-list-context";
import { Pagination } from "components/pagination";
import { FilterSearchBar } from "components/filter-search-bar";
import { siteMetadata } from "constants/site-config";
import { useRouter } from "next/router";
import { ListViewPosts } from "utils/fs/api";
import { Languages } from "types/index";

interface PostListTemplateProps {
  numberOfPages: number;
  limitNumber: number;
  pageIndex: number;
  posts: ListViewPosts;
  currentLocale: Languages;
  locales: Record<Languages, string>;
}
export const PostListTemplate = (props: PostListTemplateProps) => {
  const { numberOfPages, limitNumber, pageIndex, posts } = props;

  const SEOTitle = pageIndex === 1 ? "Homepage" : `Post page ${pageIndex}`;

  const router = useRouter();

  const langData = useMemo(() => {
    const otherLangs = props.locales
      ? (Object.keys(props.locales).filter(
          (t) => t !== props.currentLocale
        ) as Languages[])
      : [];

    return {
      otherLangs,
      currentLang: props.currentLocale,
    };
  }, [props.currentLocale, props.locales]);

  return (
    <>
      <SEO title={SEOTitle} langData={langData} />
      <div>
        <PostListProvider
          posts={posts}
          numberOfPages={numberOfPages}
          limitNumber={limitNumber}
          pageIndex={pageIndex}
        >
          <PostListHeader siteDescription={siteMetadata.description} />
          <main>
            <FilterSearchBar />
            <PostList listAriaLabel="List of posts" />
          </main>
          <Pagination absolutePath={router.basePath} />
        </PostListProvider>
      </div>
    </>
  );
};
