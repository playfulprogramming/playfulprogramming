import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { Layout } from "../components/layout/layout"
import { SEO } from "../components/seo"
import Image from "gatsby-image"
import style from "./about.module.scss"
import { navigate } from "@reach/router"

const AboutUs = (props) => {
  const { data: { markdownRemark } } = props

  const { file, markdownRemark: post, site, allUnicornsJson: unicorns } = useStaticQuery(graphql`
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
  const { nodes: unicornArr } = unicorns
  const { childImageSharp: { fixed: imageFixed } } = file

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
            unicornArr.map(unicornInfo => (
              <div key={unicornInfo.id} className={style.contributorContainer}>
                <div className='pointer' onClick={() => navigate(`/unicorns/${unicornInfo.id}`)}>
                  <Image className="circleImg" fixed={unicornInfo.profileImg.childImageSharp.mediumPic}/>
                </div>
                <div className={style.nameRoleDiv}>
                  <Link to={`/unicorns/${unicornInfo.id}`}>{unicornInfo.name}</Link>
                  <ul aria-label="Roles assigned to this user" className={style.rolesList}>
                    {unicornInfo.roles.map((role, i, arr) => (
                      <li key={role.id}>
                        {role.prettyname}
                        {
                          (arr[i + 1] || (
                            unicornInfo.fields.isAuthor &&
                            i === arr.length - 1
                          )) &&
                            <span aria-hidden={true}>,&nbsp;</span>
                        }
                      </li>
                    ))}
                    {
                      unicornInfo.fields.isAuthor &&
                      <li>Author</li>
                    }
                  </ul>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs
