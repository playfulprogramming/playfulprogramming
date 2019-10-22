import React, { useContext, useState, useEffect, useMemo } from "react"
import { graphql, Link } from "gatsby"
import GitHubIcon from "../assets/icons/github.svg"
import CommentsIcon from "../assets/icons/message.svg"
import { DiscussionEmbed } from "disqus-react"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostMetadata, PostTitleHeader } from "../components/post-view"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { ThemeContext } from "../components/theme-context"
import { PicTitleHeader } from "../components/pic-title-header"
import { PostList } from "../components/post-card-list"

const BlogPostListTemplate = (props) => {
  const { data, pageContext: {pageIndex} } = props
  console.log(pageIndex);
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  // FIXME: This logic will break with pagination
  const postTags = useMemo(() => {
    return Array.from(posts.reduce((prev, post) => {
      post.node.frontmatter.tags.forEach(tag => prev.add(tag))
      return prev
    }, new Set()))
  }, [posts])

  const Description = <>
    {data.site.siteMetadata.description}
    <br/>
    <Link to={"/about"} aria-label={"The about us page"}><span aria-hidden={true}>Read More</span></Link>
  </>

  const SEOTitle = !pageIndex ?
    "Homepage" :
    `Post page ${pageIndex}`

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title={SEOTitle}/>
      <div>
        <PicTitleHeader
          image={data.file.childImageSharp.fixed}
          title="Unicorn Utterances"
          description={Description}
        />
        <PostList posts={posts} tags={postTags}/>
      </div>
    </Layout>
  )
}

export default BlogPostListTemplate

export const pageQuery = graphql`
  query BlogListPageQuery($limitNumber: Int!, $skipNumber: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark (
      sort: { fields: [frontmatter___published], order: DESC },
      filter: {fileAbsolutePath: {regex: "/content/blog/"}},
      limit: $limitNumber,
      skip: $skipNumber
    ) {
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
