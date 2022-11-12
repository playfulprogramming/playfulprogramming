import styles from "./series-nav.module.scss";
import navigateNext from "../../../icons/navigate_next.svg";
import navigateBefore from "../../../icons/navigate_before.svg";
import { getShortTitle } from "./base";
import { PostInfo } from "types/PostInfo";

interface SeriesNavProps {
  post: PostInfo;
  postSeries: PostInfo[];
}
export const SeriesNav = ({ post, postSeries }: SeriesNavProps) => {
  const postIndex = postSeries.findIndex((p) => p.order === post.order);

  const prevPost = postSeries[postIndex - 1];
  const nextPost = postSeries[postIndex + 1];

  return (
    <div className={styles.seriesNav}>
      {prevPost ? (
          <a href={`/posts/${prevPost.slug}`} className={`baseBtn prependIcon`}>
            <img src={navigateBefore} alt="" />
            Previous Chapter: {getShortTitle(prevPost)}
          </a>
      ) : null}
      {nextPost ? (
          <a  href={`/posts/${nextPost.slug}`} className={`baseBtn appendIcon`}>
            Next Chapter: {getShortTitle(nextPost)}
            <img src={navigateNext} alt="" />
          </a>
      ) : (
        <div />
      )}
    </div>
  );
};
