import React, { createRef, useMemo, useRef } from "react"
import Image from "gatsby-image"
import styles from "./post-metadata.module.scss"
import { Link } from "gatsby"

export const PostMetadata = ({ post }) => {
  const { authors } = post.frontmatter
  const authorLinkRefs = useMemo(() => authors.map(() => createRef()), [authors])

  const getAuthorLinkHandler = i => () => authorLinkRefs[i].current.click()

  const authorImgs = authors.map((author, i, arr) => {
      const hasTwoAuthors = arr.length !== 1
      const xyPosition =
        !hasTwoAuthors ? undefined :
          i === 1 ? "14px" : "-7px"
      const classesToApplyToImg = hasTwoAuthors ? styles.twoAuthorPicSize : ""
      const classesToApplyToContainer = hasTwoAuthors ? styles.twoAuthor : ""

      return (
        <div
          key={author.id}
          onClick={getAuthorLinkHandler(i)}
          className={`pointer ${styles.profilePicLink} ${classesToApplyToContainer}`}
          style={{
            borderColor: author.color,
            left: xyPosition,
            top: xyPosition,
          }}
        >
          <Image
            className={`circleImg ${styles.authorPic} ${classesToApplyToImg}`}
            fixed={author.profileImg.childImageSharp.mediumPic}
            data-testid={`post-meta-author-pic-${i}`}
            alt={`Profile pic for ${author.name}`}
          />
        </div>)
    });

  return (
    <div className={styles.container}>
      <div className={styles.authorPicContainer}>{authorImgs}</div>
      <div className={styles.textDiv}>
        <h2 className={styles.authorName} data-testid="post-meta-author-name">
          {authors.map((author, i) =>
            <Link
              key={author.id}
              to={`/unicorns/${author.id}`}
              ref={authorLinkRefs[i]}
              className={styles.authorLink}
            >
              {i !== 0 && ', '}
              {author.name}
            </Link>
          )}
        </h2>
        <div className={styles.belowName}>
          <p>{post.frontmatter.published}</p>
          <p>{post.wordCount.words} words</p>
        </div>
      </div>
    </div>
  )
}
