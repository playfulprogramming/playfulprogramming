import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PostList from "../components/post-card-list"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts"/>
        <div style={{ padding: "0 20px" }}>
          <PostList posts={posts}/>
        </div>
      </Layout>
    )
  }
}

export default BlogIndex

export const query = graphql`
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
        fixed(width: 60, height: 60) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
            author {
              ...AuthorInfo
            }
          }
        }
      }
    }
  }
`
