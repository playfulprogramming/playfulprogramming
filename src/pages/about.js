import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Layout } from "../components/layout/layout"
import { SEO } from "../components/seo"

const AboutUs = (props) => {
  const { data: { markdownRemark } } = props

  const { markdownRemark: post, site: {siteMetadata: {title: siteTitle}} } = useStaticQuery(graphql`
      query AboutUsQuery {
        site {
          siteMetadata {
            title
          }
        }
        markdownRemark(fields: {slug: {eq: "/about-us/"}}) {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            description
          }
        }
      }
    `)

  console.log(post);

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: markdownRemark.html }}
      />
    </Layout>
  )
}

export default AboutUs
