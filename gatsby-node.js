const path = require(`path`)
const fs = require('fs')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                attached {
                  file
                }
              }
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

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      const postInfo = post.node.frontmatter
      if (postInfo.attached && postInfo.attached.length > 0) {
        postInfo.attached.forEach(({file: fileStr}) => {
          const postPath = post.node.fields.slug
          const relFilePath = path.join(__dirname, 'static', postPath, fileStr)
          const fileExists = fs.existsSync(path.resolve(relFilePath))
          if (!fileExists) {
            console.error(`Could not find file to attach in the static folder: ${postPath}${fileStr}`)
            console.error(`To fix this problem, attach the file to the static folder's expected path above, or remove it from the post frontmatter definition`)
            process.exit(1)
          }
        });
      }

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
