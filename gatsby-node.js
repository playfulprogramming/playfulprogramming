const path = require(`path`)
const fs = require("fs")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({
      node,
      getNode,
    })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }

  if (node.internal.type === `UnicornsJson`) {
    const value = createFilePath({
      node,
      getNode,
    })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.sourceNodes = ({ getNodesByType, actions: { createNodeField } }) => {
  const postNodes = getNodesByType(`MarkdownRemark`)
  const unicornNodes = getNodesByType(`UnicornsJson`)

  unicornNodes.forEach(unicornNode => {
    const isAuthor = postNodes
      // Ensure it's actually a post
      .filter(post => !!post.frontmatter.authors)
      .some(post => {
        return post.frontmatter.authors.includes(unicornNode.id)
      })

    createNodeField({
      name: `isAuthor`,
      node: unicornNode,
      value: isAuthor,
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogProfile = path.resolve(`./src/templates/blog-profile.js`)
  const postList = path.resolve(`./src/templates/post-list.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___published], order: DESC }
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                authors {
                  id
                }
              }
            }
          }
        }
        allUnicornsJson(limit: 100) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges
    const unicorns = result.data.allUnicornsJson.edges

    posts.forEach((post, index, arr) => {
      const previous = index === arr.length - 1 ? null : arr[index + 1].node
      const next = index === 0 ? null : arr[index - 1].node

      const postInfo = post.node.frontmatter
      if (postInfo.attached && postInfo.attached.length > 0) {
        postInfo.attached.forEach(({ file: fileStr }) => {
          const postPath = post.node.fields.slug
          const relFilePath = path.join(
            __dirname,
            "static",
            "posts",
            postPath,
            fileStr
          )
          const fileExists = fs.existsSync(path.resolve(relFilePath))
          if (!fileExists) {
            console.error(
              `Could not find file to attach in the static folder: ${postPath}${fileStr}`
            )
            console.error(
              `To fix this problem, attach the file to the static folder's expected path above, or remove it from the post frontmatter definition`
            )
            process.exit(1)
          }
        })
      }

      createPage({
        path: `posts${post.node.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    const postsPerPage = 8
    const numberOfPages = Math.ceil(posts.length / postsPerPage)

    createPage({
      path: `/`,
      component: postList,
      context: {
        limitNumber: postsPerPage,
        skipNumber: 0,
        pageIndex: 1,
        numberOfPages,
        relativePath: ''
      },
    })

    for (const i of Array(numberOfPages).keys()) {
      if (i === 0) continue
      const pageNum = i + 1
      const skipNumber = postsPerPage * i
      createPage({
        path: `page/${pageNum}`,
        component: postList,
        context: {
          limitNumber: postsPerPage,
          skipNumber,
          pageIndex: pageNum,
          numberOfPages,
          relativePath: ''
        },
      })
    }

    unicorns.forEach(unicorn => {
      const uniId = unicorn.node.id

      const uniPosts = posts.filter(({ node: { frontmatter } }) =>
        frontmatter.authors.find(uni => uni.id === uniId)
      )

      const numberOfUniPages = Math.ceil(uniPosts.length / postsPerPage)

      createPage({
        path: `unicorns/${unicorn.node.id}`,
        component: blogProfile,
        context: {
          slug: uniId,
          limitNumber: postsPerPage,
          skipNumber: 0,
          pageIndex: 1,
          numberOfPages: numberOfUniPages,
          relativePath: `unicorns/${uniId}`,
        },
      })

      for (const i of Array(numberOfUniPages).keys()) {
        if (i === 0) continue
        const pageNum = i + 1
        const skipNumber = postsPerPage * i
        createPage({
          path: `unicorns/${uniId}/page/${pageNum}`,
          component: blogProfile,
          context: {
            slug: uniId,
            limitNumber: postsPerPage,
            skipNumber,
            pageIndex: pageNum,
            numberOfPages: numberOfUniPages,
            relativePath: `unicorns/${uniId}`,
          },
        })
      }
    })

    return null
  })
}
