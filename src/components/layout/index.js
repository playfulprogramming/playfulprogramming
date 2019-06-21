import React from "react"
import { graphql, Link } from "gatsby"
import './style.css'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    const isBase = location.pathname.startsWith === rootPath;
    const isBlogPost = location.pathname.startsWith(`${rootPath}/posts`);

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
        }}
      >
        {/*<header>{header}</header>*/}
        <main className={!isBlogPost && 'listViewContent'}>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )
  }
}

export default Layout

export const authorFragmentQuery = graphql`
  fragment AuthorInfo on AuthorsJson {
    name
    blurbet
    id
    description
    color
    socials {
      twitter
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
        smallPic: fixed(width: 60, height: 60) {
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
      license
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
