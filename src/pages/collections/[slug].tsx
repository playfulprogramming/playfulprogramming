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
import Link from "next/link";
import { ThemeContext } from "constants/theme-context";
import { SEO } from "components/seo";
import { useRouter } from "next/router";

const collectionQuery = {
  associatedSeries: true,
  posts: true,
  title: true,
  authors: {
    socials: true,
    name: true,
    lastName: true,
    firstName: true,
    id: true,
  },
  description: true,
  content: true,
  slug: true,
  coverImg: true,
  buttons: true,
  published: true,
  type: true,
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
  const { colorMode } = React.useContext(ThemeContext);
  const router = useRouter();

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
      <SEO
        title={collection.title}
        description={collection.description}
        unicornsData={collection.authors}
        publishedTime={collection.published}
        type={collection.type}
        pathName={router.asPath}
        shareImage={coverImgPath}
      />
      <div className={styles.mainContainer}>
        <div className="listViewContent">
          <div className={styles.topHeader}>
            <div
              className={`${styles.bigImageContainer} ${
                colorMode === "light" ? styles.lightImage : styles.darkImage
              }`}
            >
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
              <div
                className={`${styles.smallImageContainer} ${
                  colorMode === "light" ? styles.lightImage : styles.darkImage
                }`}
              >
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
          <div
            className={`${styles.topBorderArea} ${
              colorMode === "light" ? "" : styles.darkAreaBorder
            }`}
          />
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
                      <Link href={"/posts/" + post.slug} passHref>
                        <a className={styles.postLink}>
                          <div className={styles.orderContainer}>
                            {post.order}
                          </div>
                          <div>
                            <h3 className={styles.postTitle}>{post.title}</h3>
                            <p className={styles.postDesc}>
                              {post.description}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            className={`${styles.bottomBorderArea} ${
              colorMode === "light" ? "" : styles.darkAreaBorder
            }`}
          />
        </div>
        <div className={`post-body ${styles.markdownContainer}`}>{result}</div>
      </div>
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
