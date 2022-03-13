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
import { PickDeep } from "ts-util-helpers";
import Image from "next/image";
import { getFullRelativePath } from "utils/url-paths";
import styles from "../../page-components/collections/collections.module.scss";
import { AnalyticsLink } from "components/analytics-link";

const collectionQuery = {
  associatedSeries: true,
  posts: true,
  title: true,
  authors: {
    name: true,
  },
  description: true,
  content: true,
  slug: true,
  coverImg: true,
  buttons: true,
} as const;

type Props = {
  markdownHTML: string;
  slug: string;
  collectionsDirectory: string;
  collection: PickDeep<CollectionInfo, typeof collectionQuery>;
};

const Collection = ({
  slug,
  collectionsDirectory,
  markdownHTML,
  collection,
}: Props) => {
  const result = useMarkdownRenderer({
    markdownHTML,
    serverPath: ["/collections", slug],
  });

  const coverImgPath = getFullRelativePath(
    "/collections",
    slug,
    collection.coverImg.relativePath
  );

  return (
    <>
      <div className="listViewContent">
        <div className={styles.topHeader}>
          <div className={styles.bigImageContainer}>
            <Image
              alt=""
              src={coverImgPath}
              height={collection.coverImg.height}
              width={collection.coverImg.width}
              layout={"fill"}
              loading="lazy"
              objectFit="contain"
            />
          </div>
          <div className={styles.topDescContainer}>
            <h1 className={styles.title}>{collection.title}</h1>
            <div className={styles.smallImageContainer}>
              <Image
                alt=""
                src={coverImgPath}
                height={collection.coverImg.height}
                width={collection.coverImg.width}
                layout={"intrinsic"}
                loading="lazy"
                objectFit="contain"
              />
            </div>
            <p className={styles.description}>{collection.description}</p>
            <div className={styles.buttonContainer}>
              {collection.buttons?.map((button) => {
                return (
                  <AnalyticsLink
                    className={`baseBtn ${styles.collectionButton}`}
                    key={button.url}
                    category="outbound"
                    href={button.url}
                  >
                    {button.text}
                  </AnalyticsLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.stitchedAreaContainer}>
        <div className={styles.topBorderArea} />
        <div className={styles.postsContainer}>
          <div className={`listViewContent ${styles.postsInnerContainer}`}>
            <h2
              id="chapter-listing-heading"
              className={styles.chapterListingHeader}
            >
              Chapter Listing:
            </h2>
            <ul
              aria-describedby="chapter-listing-heading"
              className={styles.collectionPostList}
            >
              {collection.posts.map((post) => {
                return (
                  <li key={post.order} className={styles.postContainer}>
                    <div className={styles.orderContainer}>{post.order}</div>
                    <div>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postDesc}>{post.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className={styles.bottomBorderArea} />
      </div>
      {result}
    </>
  );
};

export default Collection;

type Params = {
  params: {
    slug: string;
  };
};

const seriesPostCacheKey = {};

export async function getStaticProps({ params }: Params) {
  const collection = getCollectionBySlug(params.slug, collectionQuery);

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
