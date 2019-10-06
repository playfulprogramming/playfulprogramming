import React, { useMemo } from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostList } from "../components/post-card-list"
import { PicTitleHeader } from "../components/pic-title-header"

const BlogProfile = (props) => {
  const siteTitle = props.data.site.siteMetadata.title
  const slugData = props.data
  const unicornData = slugData.unicornsJson
  const posts = slugData.allMarkdownRemark.edges

  // FIXME: This logic will break with pagination
  const wordCount = useMemo(() => {
    return posts.reduce((prev, post) => prev + post.node.wordCount.words, 0)
  }, [posts])

  // FIXME: This logic will break with pagination
  const postTags = useMemo(() => {
    return Array.from(posts.reduce((prev, post) => {
      post.node.frontmatter.tags.forEach(tag => prev.add(tag));
      return prev;
    }, new Set()))
  }, [posts])

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={unicornData.name}
        description={unicornData.description}
        unicornData={unicornData}
        type="profile"
      />
      <PicTitleHeader
        image={unicornData.profileImg.childImageSharp.bigPic}
        title={unicornData.name}
        description={unicornData.description}
        profile={true}
        socials={unicornData.socials}
      />
      <PostList
        numberOfArticles={slugData.allMarkdownRemark.totalCount}
        wordCount={wordCount}
        posts={posts}
        tags={postTags}
        showWordCount={true}
        unicornData={unicornData}
      />
    </Layout>
  )
}

export default BlogProfile

export const pageQuery = graphql`
  query UnicornBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    unicornsJson(id: { eq: $slug }) {
      ...UnicornInfo
    }
    allMarkdownRemark(
      filter: {
        frontmatter: {authors: {elemMatch: {id: {eq:  $slug}}}},
        fileAbsolutePath: {regex: "/content/blog/"}        
      },
      sort: {order: DESC, fields: frontmatter___published}
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
