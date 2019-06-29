import React, { useRef } from "react"
import { Link } from "gatsby"
import cardStyles from "./post-card.module.scss"
import Image from "gatsby-image"
import { stopPropCallback } from "../../utils/preventCallback"

export const PostCard = ({ title, author, published, tags, excerpt, description, className, slug }) => {
  const headerLink = useRef()
  const authorLink = useRef();
  return (
    <div className={`${cardStyles.card} ${className}`} onClick={() => headerLink.current.click()}>
      <div
        aria-hidden={true}
        onClick={(e) => {
          stopPropCallback(e)
          authorLink.current.click()
        }}
      >
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
      </div>
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
            ref={authorLink}
          >
            {author.name}
          </Link>
        </p>
        <div className={cardStyles.dateTagSubheader}>
          <p className={cardStyles.date}>{published}</p>
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

