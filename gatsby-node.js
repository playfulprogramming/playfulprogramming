const path = require(`path`)
const fs = require('fs')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogAuthor = path.resolve(`./src/templates/blog-author.js`)
  return graphql(
    `
    {
      allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, limit: 1000) {
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
      allAuthorsJson(limit: 100) {
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
    const authors = result.data.allAuthorsJson.edges

    posts.forEach((post, index, arr) => {
      const previous = index === arr.length - 1 ? null : arr[index + 1].node
      const next = index === 0 ? null : arr[index - 1].node

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

      console.log(post.node.fields.slug);

      createPage({
        path: `post${post.node.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    authors.forEach((author, index, arr) => {
      createPage({
        path: `author/${author.node.id}`,
        component: blogAuthor,
        context: {
          slug: author.node.id
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
