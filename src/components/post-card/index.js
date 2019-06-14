import React from "react"
import { Link } from "gatsby"
import cardStyles from "./style.css"

class PostCard extends React.Component {
  render() {
    const { title, authorName, date, tags, excerpt } = this.props

    return (
      <div className={cardStyles.card}>
        <img src={"https://pbs.twimg.com/profile_images/1137822889938317312/Z9Ci2LoS_400x400.jpg"}
             alt={`Image of ${authorName}`}
         className={cardStyles.profilePic} style={{
          borderColor: "red",
        }}/>
        <div className={cardStyles.cardContents}>
          <h2 className={cardStyles.header}>{title}</h2>
          <div className={cardStyles.authorSubheader}>
            <p>by {authorName}</p>
            <p className={cardStyles.date}>{date}</p>
            {
              tags.map(tag => (
                <Link to={"/"} className={cardStyles.tag}>
                  {tag.name}
                </Link>
              ))
            }
          </div>
          <p className={cardStyles.excerpt}>
            {excerpt}
          </p>
        </div>
      </div>
    )
  }
}

export default PostCard
