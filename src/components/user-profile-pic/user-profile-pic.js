import * as React from "react"
import Image from "gatsby-image"

import styles from "./user-profile-pic.module.scss"

/**
 * @param {Array.<{unicorn: UnicornInfo, onClick: MouseEventHandler}>} authors
 * @param {string} className
 * @param {boolean} mediumPic true to use medium pic, false to use small pic
 */
export const UserProfilePic = ({ authors, className, mediumPic }) => {
  const hasTwoAuthors = authors.length !== 1;

  const authorsLinks = authors.map(({ unicorn, onClick }, i) => {
    const classesToApply = hasTwoAuthors ? styles.twoAuthor : "";
    const pic = mediumPic ? unicorn.profileImg.childImageSharp.mediumPic : unicorn.profileImg.childImageSharp.smallPic;

    return (
      <div
        key={unicorn.id}
        onClick={onClick}
        className={`pointer ${styles.profilePicContainer} ${classesToApply}`}
        style={{
          borderColor: unicorn.color,
        }}
      >
        <Image
          data-testid={`author-pic-${i}`}
          fixed={pic}
          alt={unicorn.name}
          className={`circleImg ${styles.profilePicImage} ${classesToApply}`}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      </div>
    )
  });

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {authorsLinks}
    </div>
  );
}
