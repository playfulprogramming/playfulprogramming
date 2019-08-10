import React, { useMemo } from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PostList } from "../components/post-card-list"
import { PicTitleHeader } from "../components/pic-title-header"

const BlogAuthor = (props) => {
  const siteTitle = props.data.site.siteMetadata.title
  const slugData = props.data
  const authorData = slugData.authorsJson
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
        title={authorData.name}
        description={authorData.description}
        authorData={authorData}
        type="profile"
      />
      <PicTitleHeader
        image={authorData.profileImg.childImageSharp.bigPic}
        title={authorData.name}
        description={authorData.description}
        author={true}
        socials={authorData.socials}
      />
      <PostList
        numberOfArticles={slugData.allMarkdownRemark.totalCount}
        wordCount={wordCount}
        posts={posts}
        tags={postTags}
        overwriteAuthorInfo={authorData}
        showWordCount={true}
      />
    </Layout>
  )
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
      filter: {
        frontmatter: {author: {id: {eq:  $slug}}},
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
