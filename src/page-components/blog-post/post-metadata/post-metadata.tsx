import React, { createRef, useMemo } from "react";
import styles from "./post-metadata.module.scss";
import Link from "next/link";
import { stopPropCallback } from "uu-utils";
import { UserProfilePic } from "components/user-profile-pic";
import { SlugPostInfo } from "constants/queries";

interface PostMetadataProps {
  post: SlugPostInfo;
}
export const PostMetadata = ({ post }: PostMetadataProps) => {
  const { authors } = post;

  const authorLinks = useMemo(
    () =>
      authors.map((unicorn) => {
        const ref = createRef<HTMLElement>();
        const onClick = (e: MouseEvent) => {
          stopPropCallback(e);
          ref.current!.click();
        };

        return {
          unicorn,
          onClick,
          ref,
        };
      }),
    [authors]
  );

  const originalHost = useMemo(() => {
    if (!post.originalLink) return "";
    const url = new URL(post.originalLink);
    return url.host;
  }, [post.originalLink]);

  return (
    <div className={styles.container}>
      <UserProfilePic
        authors={authorLinks as any}
        className={styles.postMetadataAuthorImagesContainer}
      />
      <div className={styles.textDiv}>
        <h2 className={styles.authorName} data-testid="post-meta-author-name">
          <span>by </span>
          {authors.map((author, i) => {
            return (
              <React.Fragment key={author.id}>
                {i !== 0 && <span>{", "}</span>}
                <Link key={author.id} href={`/unicorns/${author.id}`} passHref>
                  <a
                    ref={authorLinks[i].ref as any}
                    className={styles.authorLink}
                  >
                    {author.name}
                  </a>
                </Link>
              </React.Fragment>
            );
          })}
        </h2>
        <div className={styles.belowName}>
          <p>{post.published}</p>
          <p>{post.wordCount} words</p>
        </div>
      </div>
      {!!post.originalLink && (
        <p className={styles.originalLink}>
          Originally posted at&nbsp;
          <a
            href={post.originalLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {originalHost}
          </a>
        </p>
      )}
    </div>
  );
};
