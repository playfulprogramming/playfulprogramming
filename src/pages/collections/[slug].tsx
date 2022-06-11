// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {
  getAllCollections,
  getCollectionBySlug,
  collectionsDirectory,
  collectionQuery,
  CollectionQueryType,
} from "utils/fs/api";
import * as React from "react";
import markdownToHtml from "utils/markdown/markdownToHtml";
import path from "path";
import { useMarkdownRenderer } from "utils/markdown/useMarkdownRenderer";
import Image from "next/image";
import { getFullRelativePath } from "utils/url-paths";
import styles from "../../page-components/collections/collections.module.scss";
import { AnalyticsLink } from "components/analytics-link";
import Link from "next/link";
import { ThemeContext } from "constants/theme-context";
import { SEO } from "components/seo";
import { useRouter } from "next/router";
import { Languages } from "types/index";
import "react-medium-image-zoom/dist/styles.css";

type Props = {
  markdownHTML: string;
  aboveMarkdownHTML?: string;
  slug: string;
  collectionsDirectory: string;
  collection: CollectionQueryType;
};

const Collection = ({
  slug,
  collectionsDirectory,
  markdownHTML,
  aboveMarkdownHTML,
  collection,
}: Props) => {
  const { colorMode } = React.useContext(ThemeContext);
  const router = useRouter();

  const result = useMarkdownRenderer({
    markdownHTML,
    serverPath: ["/collections", slug],
  });

  const aboveResult = useMarkdownRenderer({
    markdownHTML: aboveMarkdownHTML || "",
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
        shareImage={collection.socialImg || coverImgPath}
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
          {aboveMarkdownHTML && (
            <div className={`post-body ${styles.markdownContainer}`}>
              {aboveResult}
            </div>
          )}
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
                {(collection.chapterList || []).map((post, i) => {
                  return (
                    <li key={post.title} className={styles.postContainer}>
                      <div className={styles.postLink}>
                        <div className={styles.orderContainer}>
                          {post.order}
                        </div>
                        <div>
                          <h3
                            className={`${styles.postTitle} ${styles.noLink}`}
                          >
                            {post.title}
                          </h3>
                          <p className={styles.postDesc}>{post.description}</p>
                        </div>
                      </div>
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

export async function getStaticProps({
  params,
  locale,
}: Params & { locale: Languages }) {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }
  const collection = getCollectionBySlug(params.slug, collectionQuery);

  const { html: markdownHTML } = await markdownToHtml(
    collection.content,
    path.resolve(collectionsDirectory, collection.slug)
  );

  let aboveMarkdownHTML = "";
  if (collection.aboveFoldMarkdown) {
    const { html } = await markdownToHtml(
      collection.aboveFoldMarkdown,
      path.resolve(collectionsDirectory, collection.slug)
    );
    aboveMarkdownHTML = html;
  }

  return {
    props: {
      collection: {
        ...collection,
      },
      markdownHTML,
      aboveMarkdownHTML,
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
