import React from "react"
import Image from "gatsby-image"
import styles from "./pic-title-header.module.scss"

/**
 *
 * @param image
 * @param socials - Match the object of the authorsJson socials
 * @param title
 * @param description
 * @param author - Is an author pic?
 * @constructor
 */
export const PicTitleHeader = ({ image, socials, title, description, author = false }) => {
  return (
    <div className={styles.container}>
      <Image className={styles.headerPic} style={author ? { borderRadius: "50%" } : {}} fixed={image}
             loading={"eager"}/>
      <div className={styles.noMgContainer}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.subheader}>{description}</h2>
      </div>
    </div>
  )
}
