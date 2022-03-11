// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {
  getPostBySlug,
  getAllPosts,
  postsDirectory,
  getAllCollections,
  getCollectionBySlug,
  collectionsDirectory,
} from "utils/fs/api";
import * as React from "react";
import { CollectionInfo } from "types/CollectionInfo";

type Props = {
  // markdownHTML: string;
  slug: string;
  collectionsDirectory: string;
  collection: Partial<CollectionInfo>;
};

const Post = ({ slug, collectionsDirectory, collection }: Props) => {
  // const result = useMarkdownRenderer({
  //   markdownHTML,
  //   serverPath: ["/posts", slug],
  // });

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
  });

  return {
    props: {
      collection: {
        ...collection,
      },
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
