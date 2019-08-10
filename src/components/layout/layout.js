import React from "react"
import { graphql, Link } from "gatsby"
import BackIcon from "../../assets/icons/back.svg"
import layoutStyles from "./layout.module.scss"
import "../../global.scss"

export const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const isBase = location.pathname === rootPath
  const isBlogPost = location.pathname.startsWith(`${rootPath}posts`)

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
      }}
    >
      <header className={layoutStyles.header}>
        {!isBase && <Link className={`${layoutStyles.backBtn} baseBtn`} to={`/`}><BackIcon/></Link>}
      </header>
      <main className={!isBlogPost ? "listViewContent" : "postViewContent"}>{children}</main>
      <footer>
        {''}
      </footer>
    </div>
  )
}

export const authorFragmentQuery = graphql`
  fragment UserInfo on UsersJson {
    name
    blurbet
    id
    description
    color
    socials {
      twitter
      github
    }
    pronouns {
      they
      them
      their
      theirs
      themselves
    }
    profileImg {
      childImageSharp {
        smallPic: fixed(width: 60) {
          ...GatsbyImageSharpFixed
        }
        mediumPic: fixed(width: 85) {
          ...GatsbyImageSharpFixed
        }
        bigPic: fixed(width: 300, quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export const postFragmentQuery = graphql`
  fragment PostInfo on MarkdownRemark {
    id
    excerpt(pruneLength: 160)
    html
    frontmatter {
      title
      published(formatString: "MMMM DD, YYYY")
      tags
      description
      author {
        ...UserInfo
      }
    }
    fields {
      slug
    }
    wordCount {
      words
    }
  }
`
