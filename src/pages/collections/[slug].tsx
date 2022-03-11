// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {
  getAllCollections,
  getCollectionBySlug,
  collectionsDirectory,
} from "utils/fs/api";
import * as React from "react";
import { CollectionInfo } from "types/CollectionInfo";
import markdownToHtml from "utils/markdown/markdownToHtml";
import path from "path";
import { useMarkdownRenderer } from "utils/markdown/useMarkdownRenderer";

type Props = {
  markdownHTML: string;
  slug: string;
  collectionsDirectory: string;
  collection: Partial<CollectionInfo>;
};

const Post = ({
  slug,
  collectionsDirectory,
  markdownHTML,
  collection,
}: Props) => {
  const result = useMarkdownRenderer({
    markdownHTML,
    serverPath: ["/collections", slug],
  });

  return (
    <>
      <h1>{collection.title}</h1>
      {collection
        .posts!.sort((a, b) => (a.order! < b.order! ? -1 : 1))
        .map((post) => {
          return (
            <p key={post.order}>
              {post.order} {post.title}
            </p>
          );
        })}
      {result}
    </>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

const seriesPostCacheKey = {};

export async function getStaticProps({ params }: Params) {
  const collection = getCollectionBySlug(params.slug, {
    associatedSeries: true,
    posts: true,
    title: true,
    authors: {
      name: true,
    },
    description: true,
    content: true,
    slug: true,
  });

  const { html: markdownHTML } = await markdownToHtml(
    collection.content,
    path.resolve(collectionsDirectory, collection.slug)
  );

  return {
    props: {
      collection: {
        ...collection,
      },
      markdownHTML,
      collectionsDirectory,
      slug: params.slug,
    } as Props,
  };
}

export async function getStaticPaths() {
  const collections = getAllCollections({ slug: true });

  const paths = collections.map((collection) => {
    return {
      params: {
        slug: collection.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
