import React from "react"
import { graphql } from "gatsby"
import GitHubIcon from "../assets/icons/github.svg"
import CommentsIcon from "../assets/icons/message.svg"
import {DiscussionEmbed} from "disqus-react"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostMetadata, PostTitleHeader } from "../components/post-view"
import { OutboundLink } from "gatsby-plugin-google-analytics"

const BlogPostTemplate = (props) => {
  const post = props.data.markdownRemark
  const siteData = props.data.site.siteMetadata
  const siteTitle = siteData.title
  const slug = post.fields.slug

  const disqusConfig = {
    url: `${siteData.siteUrl}posts${slug}`,
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
        unicornData={post.frontmatter.author}
        publishedTime={post.frontmatter.published}
        editedTime={post.frontmatter.edited}
        keywords={post.frontmatter.tags}
        type="article"
      />
      <PostTitleHeader post={post}/>
      <PostMetadata post={post}/>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <div className="post-lower-area">
        <div>
          <a
            aria-label={`Post licensed with ${post.frontmatter.license.displayName}`}
            href={post.frontmatter.license.explainLink}
            style={{display: 'table', margin: '0 auto'}}
          >
          <img
            src={post.frontmatter.license.footerImg}
            alt={post.frontmatter.license.licenseType}
          />
          </a>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="btnLike prependIcon">
            <CommentsIcon/>
            <p>Comments</p>
          </div>

          <OutboundLink className="baseBtn prependIcon" href={GHLink}>
            <GitHubIcon/>
            View this Post on GitHub
          </OutboundLink>

          {/*<button className="baseBtn appendIcon" type="button">*/}
          {/*  Share this Post*/}
          {/*  <ShareIcon/>*/}
          {/*</button>*/}
        </div>
        <DiscussionEmbed
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
