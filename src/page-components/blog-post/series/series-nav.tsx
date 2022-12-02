import styles from "./series-nav.module.scss";
import NavigateNext from "../../../icons/navigate_next.svg?raw";
import NavigateBefore from "../../../icons/navigate_before.svg?raw";
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
            <span style={{ display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: NavigateBefore }}></span>
            Previous Chapter: {getShortTitle(prevPost)}
          </a>
      ) : null}
      {nextPost ? (
          <a  href={`/posts/${nextPost.slug}`} className={`baseBtn appendIcon`}>
            Next Chapter: {getShortTitle(nextPost)}
            <span style={{ display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: NavigateNext }}></span>
          </a>
      ) : (
        <div />
      )}
    </div>
  );
};
