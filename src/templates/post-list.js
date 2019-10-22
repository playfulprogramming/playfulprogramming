import React, { useMemo, useState } from "react"
import { graphql, Link, navigate } from "gatsby"

import ReactPaginate from 'react-paginate';

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { PicTitleHeader } from "../components/pic-title-header"
import { PostList } from "../components/post-card-list"
import { getSkippedPosts } from "../utils/handle-post-list"

const BlogPostListTemplate = (props) => {
  const { data, pageContext } = props
  const {pageIndex, numberOfPages, limitNumber, skipNumber} = pageContext;
  const [postsToDisplay] = useState(
    /**
     * Set the initial value to the expected page's results
     *
     * We should be able to overwrite this during a search/filter
     */
    getSkippedPosts(data.allMarkdownRemark.edges, skipNumber, limitNumber)
  );
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

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

  const SEOTitle = pageIndex === 1 ?
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
        <PostList posts={postsToDisplay} tags={postTags}/>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={numberOfPages}
          marginPagesDisplayed={2}
          forcePage={pageIndex - 1}
          pageRangeDisplayed={5}
          hrefBuilder={(props) => {
            return `/page/${props}`
          }}
          onPageChange={({selected}) => {
            // Even though we index at 1 for pages, this component indexes at 0
            const newPageIndex = selected + 1;
            if (newPageIndex === 1) {
              navigate("/");
              return;
            }
            navigate(`/page/${newPageIndex}`)
          }}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    </Layout>
  )
}

export default BlogPostListTemplate

export const query = graphql`
  fragment PostInfoListDisplay on MarkdownRemark {
    id
    excerpt(pruneLength: 160)
    frontmatter {
      title
      published(formatString: "MMMM DD, YYYY")
      tags
      description
      author {
        name
        id
        color
        profileImg {
          childImageSharp {
            smallPic: fixed(width: 60) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    fields {
      slug
    }
  }
`

export const pageQuery = graphql`
  query BlogListPageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark (
      sort: { fields: [frontmatter___published], order: DESC },
      filter: {fileAbsolutePath: {regex: "/content/blog/"}}
    ) {
      edges {
        node {
          ...PostInfoListDisplay
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
