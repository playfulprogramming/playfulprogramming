import React from "react"
import Image from "gatsby-image"
import styles from "./post-metadata.module.scss"

export const PostMetadata = ({ post }) => {
  const { author } = post.frontmatter

  return (
    <div className={styles.container}>
      <Image className={styles.img} fixed={author.profileImg.childImageSharp.mediumPic}/>
      <div className={styles.textDiv}>
        <h2 className={styles.authorName}>{author.name}</h2>
        <div className={styles.belowName}>
          <p className={styles.date}>{post.frontmatter.date}</p>
          <p className={styles.wordCount}>{post.wordCount.words} words</p>
        </div>
      </div>
    </div>
  )
}
