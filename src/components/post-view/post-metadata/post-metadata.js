import React, { useRef } from "react"
import Image from "gatsby-image"
import styles from "./post-metadata.module.scss"
import { Link } from "@reach/router"

export const PostMetadata = ({ post }) => {
  const { author } = post.frontmatter
  const authorLinkRef = useRef()

  return (
    <div className={styles.container}>
      <div onClick={() => authorLinkRef.current.click()} className='pointer'>
        <Image className={styles.img} fixed={author.profileImg.childImageSharp.mediumPic}/>
      </div>
      <div className={styles.textDiv}>
        <Link to={`/authors/${author.id}`} ref={authorLinkRef}><h2 className={styles.authorName}>{author.name}</h2>
        </Link>
        <div className={styles.belowName}>
          <p className={styles.date}>{post.frontmatter.published}</p>
          <p className={styles.wordCount}>{post.wordCount.words} words</p>
        </div>
      </div>
    </div>
  )
}
