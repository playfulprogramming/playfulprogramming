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
  const wordCount = useMemo(() => {
    return posts.reduce((prev, post) => prev + post.node.wordCount.words, 0)
  }, [posts])

  console.log(wordCount)

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title={authorData.name} description={authorData.description}/>
      <PicTitleHeader
        image={authorData.profileImg.childImageSharp.bigPic}
        title={authorData.name}
        description={authorData.description}
        author={true}
      />
      <PostList
        numberOfArticles={slugData.allMarkdownRemark.totalCount}
        wordCount={wordCount}
        posts={posts}
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
