import styles from "./series-toc.module.scss";
import { RenderedPostInfo } from "types/PostInfo";
import { SeriesPostInfo, SlugPostInfo } from "constants/queries";
import { useRouter } from "next/router";
import Link from "next/link";

interface SeriesTocProps {
  post: SlugPostInfo & RenderedPostInfo;
  postSeries: SeriesPostInfo[];
}
export const SeriesToC = ({ post, postSeries }: SeriesTocProps) => {
  const router = useRouter();

  return (
    <div className={styles.seriesTableOfContent}>
      <div className={styles.seriesHeader}>
        Part of our series: {post.series}
      </div>
      <ol aria-labelledby="series-header" role="list">
        {postSeries.map((seriesPost, i) => {
          const isActive = post.order === seriesPost.order;
          const liClass = isActive ? styles.isActive : "";

          const titleName = seriesPost.title.replace(
            new RegExp(`^${post.series}: `),
            ""
          );

          return (
            <li key={seriesPost.slug} className={liClass || ""} role="listitem">
              <Link href={`/posts/${seriesPost.slug}`} passHref>
                <a>
                  Part {i + 1}: {titleName}
                </a>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
