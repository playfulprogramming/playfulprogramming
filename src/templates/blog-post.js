import React from "react"
import { graphql } from "gatsby"
import GitHubIcon from "../assets/icons/github.svg"
import ShareIcon from "../assets/icons/share.svg"
import CommentsIcon from "../assets/icons/message.svg"
import Disqus from "disqus-react"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostMetadata, PostTitleHeader } from "../components/post-view"

const BlogPostTemplate = (props) => {
  const post = props.data.markdownRemark
  const siteData = props.data.site.siteMetadata
  const siteTitle = siteData.title
  const slug = post.fields.slug

  const disqusConfig = {
    url: `${siteData.siteUrl}posts/${slug}`,
    identifier: slug,
    title: post.frontmatter.title,
  }

  const GHLink = `https://github.com/${siteData.repoPath}/tree/master${
    siteData.relativeToPosts
    }${slug}index.md`

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <PostTitleHeader post={post}/>
      <PostMetadata post={post}/>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <div className="post-lower-area">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <a className="baseBtn prependIcon" href={GHLink}>
            <GitHubIcon/>
            View on GitHub
          </a>

          <button className="baseBtn appendIcon" type="button">
            Share this Post
            <ShareIcon/>
          </button>
        </div>
        <div className="btnLike prependIcon">
          <CommentsIcon/>
          <p>Comments</p>
        </div>
        <Disqus.DiscussionEmbed
          shortname={siteData.disqusShortname}
          config={disqusConfig}
        />
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
        disqusShortname
        repoPath
        relativeToPosts
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...PostInfo
    }
  }
`
