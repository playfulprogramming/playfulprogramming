import React from "react"
import { Link, graphql } from "gatsby"
import GitHubIcon from "../assets/icons/github.svg"
import ShareIcon from "../assets/icons/share.svg"
import CommentsIcon from "../assets/icons/message.svg"
import Disqus from 'disqus-react';

import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        {post.frontmatter.tags.map(tag => <p>{tag}</p>)}
        <h1>{post.frontmatter.title}</h1>
        {post.frontmatter.subtitle && <h1>{post.frontmatter.subtitle}</h1>}
        <p
          style={{
            display: `block`,
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr/>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <button className="baseBtn">
            <GitHubIcon/>
            View on GitHub
          </button>

          <button className="baseBtn">
            Share this Post
            <ShareIcon/>
          </button>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <CommentsIcon/>
        <p>42 comments</p>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...PostInfo
    }
  }
`
