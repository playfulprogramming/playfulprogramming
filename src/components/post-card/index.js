import React from "react"
import { Link } from "gatsby"
import cardStyles from "./style.module.css"
import Image from "gatsby-image"

class PostCard extends React.Component {
  render() {
    const { title, author, date, tags, excerpt, description, className, slug } = this.props

    return (
      <Link to={`posts${slug}`} className={`${cardStyles.card} ${className}`}>
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
          <h2 className={cardStyles.header}>{title}</h2>
          <p className={cardStyles.authorName}>by <Link  to={`/authors/${author.id}`}>{author.name}</Link></p>
          <div className={cardStyles.dateTagSubheader}>
            <p className={cardStyles.date}>{date}</p>
            <div>
            {
              tags.map(tag => (
                <Link to={"/"} key={tag} className={cardStyles.tag}>
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
      </Link>
    )
  }
}

export default PostCard
