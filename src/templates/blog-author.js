import React from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostList } from "../components/post-card-list"
import { PicTitleHeader } from "../components/pic-title-header"

class BlogAuthor extends React.Component {
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title
    const slugData = this.props.data
    const authorData = slugData.authorsJson
    const posts = slugData.allMarkdownRemark.edges
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={authorData.name} description={authorData.description} />
        <PicTitleHeader
          image={authorData.profileImg.childImageSharp.bigPic}
          title={authorData.name}
          description={authorData.description}
          author={true}
        />
        <PostList
          posts={posts}
          overwriteAuthorInfo={authorData}
          showWordCount={true}
        />
      </Layout>
    )
  }
}

export default BlogAuthor

export const pageQuery = graphql`
  query AuthorBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    authorsJson(id: { eq: $slug }) {
      ...AuthorInfo
    }
    allMarkdownRemark(
      filter: { frontmatter: { author: { id: { eq: $slug } } } }
    ) {
      totalCount
      edges {
        node {
          ...PostInfo
        }
      }
    }
  }
`
