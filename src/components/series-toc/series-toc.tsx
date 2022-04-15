import styles from "./series-toc.module.scss";
import { RenderedPostInfo } from "types/PostInfo";
import { SeriesPostInfo, SlugPostInfo } from "constants/queries";
import Link from "next/link";
import { useMemo, useState } from "react";

interface SeriesToCListItem {
  post: SeriesTocProps["postSeries"][0];
  isActive: boolean;
  partNum: number;
  className?: string;
}

const SeriesToCListItem = ({
  post,
  isActive,
  partNum,
  className,
}: SeriesToCListItem) => {
  const liClass = isActive ? styles.isActive : "";

  const titleName = post.title.replace(new RegExp(`^${post.series}: `), "");

  return (
    <li className={`${liClass || ""} ${className || ""}`} role="listitem">
      <Link href={`/posts/${post.slug}`} passHref>
        <a>
          Part {partNum}: {titleName}
        </a>
      </Link>
    </li>
  );
};

function seperatePostsIntoThirds(seriesPosts: SeriesTocProps["postSeries"]) {
  const firstPosts = seriesPosts.splice(0, 2);
  const lastPosts = seriesPosts.splice(seriesPosts.length - 2, 2);
  return {
    firstPosts,
    middlePosts: seriesPosts,
    lastPosts,
  };
}

interface SeriesTocProps {
  post: SlugPostInfo & RenderedPostInfo;
  postSeries: SeriesPostInfo[];
  collectionSlug?: string;
}
export const SeriesToC = ({
  post,
  postSeries,
  collectionSlug,
}: SeriesTocProps) => {
  const seriesText = `Part of our series: ${post.series}`;

  const [areMiddlePostsActive, setMiddlePostsActive] = useState(false);

  const { firstPosts, middlePosts, lastPosts } = useMemo(
    () => seperatePostsIntoThirds(postSeries),
    [postSeries]
  );

  const isActiveInMiddle = useMemo(() => {
    return middlePosts.some((middlePost) => middlePost.order === post.order);
  }, [middlePosts, post.order]);

  return (
    <div className={styles.seriesTableOfContent}>
      <div className={styles.seriesHeader}>
        {collectionSlug ? (
          <Link href={`/collections/${collectionSlug}`} passHref>
            <a>{seriesText}</a>
          </Link>
        ) : (
          seriesText
        )}
      </div>
      <ol aria-labelledby="series-header" role="list">
        {firstPosts.map((seriesPost, i) => {
          const isActive = post.order === seriesPost.order;

          return (
            <SeriesToCListItem
              key={seriesPost.slug}
              isActive={isActive}
              partNum={i + 1}
              post={seriesPost}
            />
          );
        })}
        {middlePosts.length !== 0 ? (
          <>
            <li
              className={
                areMiddlePostsActive
                  ? styles.displayNone
                  : isActiveInMiddle
                  ? styles.isActive
                  : ""
              }
              role="listitem"
            >
              <button aria-expanded={false}>
                {middlePosts.length} more posts
              </button>
            </li>
            {middlePosts.map((seriesPost, i) => {
              const isActive = post.order === seriesPost.order;

              return (
                <SeriesToCListItem
                  className={areMiddlePostsActive ? "" : styles.displayNone}
                  key={seriesPost.slug}
                  isActive={isActive}
                  partNum={i + 1}
                  post={seriesPost}
                />
              );
            })}
          </>
        ) : null}
        {lastPosts.map((seriesPost, i) => {
          const isActive = post.order === seriesPost.order;

          return (
            <SeriesToCListItem
              key={seriesPost.slug}
              isActive={isActive}
              partNum={i + 1}
              post={seriesPost}
            />
          );
        })}
      </ol>
    </div>
  );
};
