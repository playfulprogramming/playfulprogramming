import styles from "./series-toc.module.scss";
import { RenderedPostInfo } from "types/PostInfo";
import { SeriesPostInfo, SlugPostInfo } from "constants/queries";
import { useRouter } from "next/router";
import Link from "next/link";

interface SeriesToCListItem {
  post: SeriesTocProps["postSeries"][0];
  isActive: boolean;
  partNum: number;
}

const SeriesToCListItem = ({ post, isActive, partNum }: SeriesToCListItem) => {
  const liClass = isActive ? styles.isActive : "";

  const titleName = post.title.replace(new RegExp(`^${post.series}: `), "");

  return (
    <li className={liClass || ""} role="listitem">
      <Link href={`/posts/${post.slug}`} passHref>
        <a>
          Part {partNum}: {titleName}
        </a>
      </Link>
    </li>
  );
};

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
  const router = useRouter();

  const seriesText = `Part of our series: ${post.series}`;

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
        {postSeries.map((seriesPost, i) => {
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
