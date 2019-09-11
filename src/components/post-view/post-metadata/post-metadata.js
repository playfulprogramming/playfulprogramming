import React, { useRef } from "react"
import Image from "gatsby-image"
import styles from "./post-metadata.module.scss"
import { Link } from "gatsby"

export const PostMetadata = ({ post }) => {
  const { authors } = post.frontmatter
  const authorLinkRef = useRef()

  return (
    <div className={styles.container}>
      <div onClick={() => authorLinkRef.current.click()} className='pointer'>
        <Image
          className={`circleImg ${styles.authorPic}`}
          fixed={authors[0].profileImg.childImageSharp.mediumPic}
          data-testid="post-meta-author-pic"
          alt={`Profile pic for ${authors[0].name}`}
        />
      </div>
      <div className={styles.textDiv}>
        <Link to={`/unicorns/${authors[0].id}`} ref={authorLinkRef} className={styles.authorLink}>
          <h2 className={styles.authorName} data-testid="post-meta-author-name">{authors[0].name}</h2>
        </Link>
        <div className={styles.belowName}>
          <p className={styles.date}>{post.frontmatter.published}</p>
          <p className={styles.wordCount}>{post.wordCount.words} words</p>
        </div>
      </div>
    </div>
  )
}
