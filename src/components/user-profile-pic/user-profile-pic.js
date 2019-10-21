import * as React from "react"
import Image from "gatsby-image"
import { Link } from "gatsby"

import { stopPropCallback } from "../../utils/preventCallback"
import styles from "./user-profile-pic.module.scss"

/**
 * @param {Array.<{unicorn: UnicornInfo, ref: React.RefObject}>} authors
 */
export const UserProfilePic = ({ authors }) => {
  const hasTwoAuthors = authors.length !== 1;

  const authorsLinks = authors.map(({ unicorn, ref }, i) => {
    const xyPosition =
      !hasTwoAuthors ? undefined :
        i === 1 ? "12px" : "-7px"

    const classesToApply = hasTwoAuthors ? styles.twoAuthorPicSize : ""

    return (
      <Link
        key={unicorn.id}
        to={`/unicorns/${unicorn.id}`}
        ref={ref}
        onClick={stopPropCallback}
        className={styles.profilePicLink}
        style={{
          borderColor: unicorn.color,
          left: xyPosition,
          top: xyPosition,
        }}
      >
        <Image
          data-testid="authorPic"
          fixed={unicorn.profileImg.childImageSharp.smallPic}
          alt={unicorn.name}
          className={`${styles.profilePic} ${classesToApply}`}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      </Link>
    )
  })

  return (
    <div className={styles.profilePicsContainer}>
      {authorsLinks}
    </div>
  )
}
