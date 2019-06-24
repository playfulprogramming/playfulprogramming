import React, { useRef } from "react"
import { Link } from "gatsby"
import cardStyles from "./post-card.module.scss"
import Image from "gatsby-image"
import { stopPropCallback } from "../../utils/preventCallback"

export const PostCard = ({ title, author, date, tags, excerpt, description, className, slug }) => {
  const headerLink = useRef()
  return (
    <div className={`${cardStyles.card} ${className}`} onClick={() => headerLink.current.click()}>
      <Image
        fixed={author.profileImg.childImageSharp.smallPic}
        alt={author.name}
        className={cardStyles.profilePic}
        style={{
          borderColor: author.color,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div className={cardStyles.cardContents}>
        <Link
          to={`/posts${slug}`}
          onClick={stopPropCallback}
          className="unlink"
        >
          <h2 className={cardStyles.header} ref={headerLink}
          >{title}</h2>
        </Link>
        <p className={cardStyles.authorName}>by&nbsp;
          <Link
            onClick={stopPropCallback}
            to={`/authors/${author.id}`}
          >
            {author.name}
          </Link>
        </p>
        <div className={cardStyles.dateTagSubheader}>
          <p className={cardStyles.date}>{date}</p>
          <div>
            {
              tags.map(tag => (
                <Link
                  to={"/"}
                  onClick={stopPropCallback}
                  key={tag}
                  className={cardStyles.tag}
                >
                  {tag}
                </Link>
              ))
            }
          </div>
        </div>
        <p className={cardStyles.excerpt} dangerouslySetInnerHTML={{
          __html: description || excerpt,
        }}
        />
      </div>
    </div>
  )
}

