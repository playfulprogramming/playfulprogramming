import React from "react"
import styles from "./post-title-header.module.scss"

export const PostTitleHeader = ({ post }) => {
  const { frontmatter: { title, subtitle, tags } } = post
  
  return (
    <div className={styles.container}>
      <div className={styles.tags}>{tags.map(tag => <p key={tag}>{tag}</p>)}</div>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
    </div>
  )
}
