import React, {useContext, useState, useEffect} from "react"
import { graphql } from "gatsby"
import GitHubIcon from "../assets/icons/github.svg"
import CommentsIcon from "../assets/icons/message.svg"
import {DiscussionEmbed} from "disqus-react"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostMetadata, PostTitleHeader } from "../components/post-view"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { ThemeContext } from "../components/theme-context"

const BlogPostTemplateChild = (props) => {
  const post = props.data.markdownRemark
  const siteData = props.data.site.siteMetadata
  const slug = post.fields.slug

  const { currentTheme } = useContext(ThemeContext)

  const [disqusConfig, setDisqusConfig] = useState(currentTheme);

  useEffect(() => {
    setTimeout(() => {
      if (!setDisqusConfig || !currentTheme) return;
      setDisqusConfig({
        url: `${siteData.siteUrl}posts${slug}`,
        identifier: `${slug}${currentTheme}`,
        title: post.frontmatter.title,
      })
      // Must use a `useTimeout` so that this reloads AFTER the background animation
    }, 600);
  }, [currentTheme])

  const GHLink = `https://github.com/${siteData.repoPath}/tree/master${
    siteData.relativeToPosts
  }${slug}index.md`

  return (
    <>
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
        data-testid={"post-body-div"}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <div className="post-lower-area">
        <div>
          <a
            aria-label={`Post licensed with ${post.frontmatter.license.displayName}`}
            href={post.frontmatter.license.explainLink}
            style={{ display: "table", margin: "0 auto" }}
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
          key={currentTheme}
        />
      </div>
    </>
  )
}

const BlogPostTemplate = (props) => {
  const siteTitle = props.data.site.siteMetadata.title

  return (
    <Layout location={props.location} title={siteTitle}>
      <BlogPostTemplateChild {...props}/>
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
