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
        <Image className="circleImg" fixed={authors[0].profileImg.childImageSharp.mediumPic}/>
      </div>
      <div className={styles.textDiv}>
        <h2 className={styles.authorLink}>
          {authors.map(author => {
            return <Link to={`/unicorns/${author.id}`} ref={authorLinkRef} className={styles.authorName}>{author.name}</Link>
          }).reduce((prev, curr) => {
            return [prev, ", ", curr]
          })} {/*it works but it's not pretty, also messes up styling a bit*/}
        </h2>
        <div className={styles.belowName}>
          <p className={styles.date}>{post.frontmatter.published}</p>
          <p className={styles.wordCount}>{post.wordCount.words} words</p>
        </div>
      </div>
    </div>
  )
}
