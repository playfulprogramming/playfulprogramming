import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Layout } from "../components/layout/layout"
import { SEO } from "../components/seo"
import Image from "gatsby-image"
import style from "./about.module.scss"

const AboutUs = (props) => {
  const { data: { markdownRemark } } = props

  const { file, markdownRemark: post, site, allUsersJson: unicorns } = useStaticQuery(graphql`
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
        file(relativePath: { eq: "unicorn-head-1024.png" }) {
          childImageSharp {
            fixed(width: 192, quality: 100) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        allUnicornsJson {
          nodes {
            ...UnicornInfo
          }
        }
      }
    `)

  const { siteMetadata: { title: siteTitle } } = site
  const { nodes: authorArr } = unicorns
  const { childImageSharp: { fixed: imageFixed } } = file

  console.log(authorArr)

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <div className={style.container}>
        <div className={style.headerTitle}>
          <Image fixed={imageFixed}
                 loading={"eager"}/>
          <h1>About Us</h1>
        </div>
        <div
          className={`${style.aboutBody} post-body`}
        >
          <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }}/>
          {
            authorArr.map(authorInfo => (
              <div key={authorInfo.id}>
                <p>{authorInfo.name}</p>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs
