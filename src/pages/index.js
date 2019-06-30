import React, { useMemo } from "react"
import { graphql } from "gatsby"
import {Layout} from "../components/layout/layout"
import { SEO } from "../components/seo"
import { PostList } from "../components/post-card-list"
import { PicTitleHeader } from "../components/pic-title-header"

const BlogIndex = (props) => {
    const { data } = props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    // FIXME: This logic will break with pagination
    const postTags = useMemo(() => {
      return Array.from(posts.reduce((prev, post) => {
        post.node.frontmatter.tags.forEach(tag => prev.add(tag));
        return prev;
      }, new Set()))
    }, [posts])

    return (
      <Layout location={props.location} title={siteTitle}>
        <SEO title="All posts" />
        <div>
          <PicTitleHeader
            image={data.file.childImageSharp.fixed}
            title="Unicorn Utterances"
            description="Learning programming from magically majestic words. A place to learn about all sorts of programming topics from entry-level concepts to advanced abstractions"
          />
          <PostList posts={posts} tags={postTags} />
        </div>
      </Layout>
    )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___published], order: DESC }) {
      edges {
        node {
          ...PostInfo
        }
      }
    }
    file(relativePath: { eq: "unicorn-utterances-logo-512.png" }) {
      childImageSharp {
        fixed(width: 300, quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
