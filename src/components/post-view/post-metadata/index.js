import React from "react"
import Image from "gatsby-image"
import styles from "./style.module.css"

const PostMetadata = ({ post }) => {

  const { frontmatter } = post
  const { author } = frontmatter

  return (
    <div className={styles.container}>
      <Image className={styles.img} fixed={author.profileImg.childImageSharp.mediumPic}/>
      <div className={styles.textDiv}>
        <h2 className={styles.authorName}>{author.name}</h2>
        <div className={styles.belowName}>
          <p className={styles.date}>{frontmatter.date}</p>
          <p className={styles.wordCount}>{post.wordCount.words} words</p>
        </div>
      </div>
    </div>
  )

}

export default PostMetadata
