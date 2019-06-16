import React from "react"
import { graphql } from "gatsby"

class BlogAuthor extends React.Component {
  render() {
    const slugData = this.props.data
    const authorData = slugData.authorsJson
    const posts = slugData.allMarkdownRemark.edges.map(({ node }) => node)
    return (<>
      <p>{authorData.name}</p>
      {
        posts.map(post => {
          return <div key={post.fields.slug}>{post.wordCount.words}</div>
        })
      }
    </>)
  }
}

export default BlogAuthor

export const pageQuery = graphql`
  query AuthorBySlug($slug: String!) {
    authorsJson(id: {eq: $slug}) {
      ...AuthorInfo
    }
    allMarkdownRemark(filter: {frontmatter: {author: {id: {eq: $slug}}}}) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 160)
          fields {
            slug
          }
          wordCount {
            words
          }
        }
      }
    }
  }
`
