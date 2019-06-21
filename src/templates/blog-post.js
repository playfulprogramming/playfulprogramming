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
    const siteData = this.props.data.site.siteMetadata;
    const siteTitle = siteData.title
    const { previous, next } = this.props.pageContext

    const disqusConfig = {
      url: `${siteData.siteUrl}posts/${post.fields.slug}`,
      identifier: post.fields.slug,
      title: post.frontmatter.title
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        {post.frontmatter.tags.map(tag => <p key={tag}>{tag}</p>)}
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
          <button className="baseBtn prependIcon">
            <GitHubIcon/>
            View on GitHub
          </button>

          <button className="baseBtn appendIcon">
            Share this Post
            <ShareIcon/>
          </button>



          <button aria-expanded="true" aria-haspopup="menu"
               id="button-befk28h8"></button>

          <div role="menu" aria-labelledby="button-befk28h8">
          <div role="menuitem"/>
        </div>




        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <CommentsIcon/>
        <p>Comments</p>
          </div>
        <Disqus.CommentCount shortname={siteData.disqusShortname} config={disqusConfig}>
          Comments
        </Disqus.CommentCount>

        {/*<Disqus.DiscussionEmbed shortname={siteData.disqusShortname} config={disqusConfig} />*/}

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
        siteUrl
        disqusShortname
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...PostInfo
    }
  }
`
