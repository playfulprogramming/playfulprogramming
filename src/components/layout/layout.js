import React from "react"
import { graphql, Link } from "gatsby"
import BackIcon from "../../assets/icons/back.svg"
import layoutStyles from "./layout.module.scss"
import "../../global.scss"

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

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
        {header}
      </header>
      <main className={!isBlogPost ? "listViewContent" : "postViewContent"}>{children}</main>
      <footer>
        {''}
      </footer>
    </div>
  )
}

export const authorFragmentQuery = graphql`
  fragment AuthorInfo on AuthorsJson {
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
      date(formatString: "MMMM DD, YYYY")
      tags
      author {
        ...AuthorInfo
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
