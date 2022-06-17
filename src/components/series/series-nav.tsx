import styles from "./series-nav.module.scss";
import { RenderedPostInfo } from "types/PostInfo";
import { SeriesPostInfo, SlugPostInfo } from "constants/queries";
import Link from "next/link";
import NavigateNext from "assets/icons/navigate_next.svg";
import NavigateBefore from "assets/icons/navigate_before.svg";
import { getShortTitle } from "./base";

interface SeriesNavProps {
  post: SlugPostInfo & RenderedPostInfo;
  postSeries: SeriesPostInfo[];
}
export const SeriesNav = ({ post, postSeries }: SeriesNavProps) => {
  const postIndex = postSeries.findIndex((p) => p.order === post.order);

  const prevPost = postSeries[postIndex - 1];
  const nextPost = postSeries[postIndex + 1];

  return (
    <div className={styles.seriesNav}>
      {prevPost ? (
        <Link href={`/posts/${prevPost.slug}`} passHref>
          <a className={`baseBtn prependIcon`}>
            <NavigateBefore />
            Previous Chapter: {getShortTitle(prevPost)}
          </a>
        </Link>
      ) : null}
      {nextPost ? (
        <Link href={`/posts/${nextPost.slug}`} passHref>
          <a className={`baseBtn appendIcon`}>
            Next Chapter: {getShortTitle(nextPost)}
            <NavigateNext />
          </a>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};
