module.exports = {
  siteMetadata: {
    title: `Unicorn Utterances`,
    description: `Learning programming from magically majestic words`,
    siteUrl: `https://unicorn-utterances.com/`,
    disqusShortname: "unicorn-utterances",
    repoPath: "crutchcorn/unicorn-utterances",
    relativeToPosts: "/content/blog",
    keywords: 'programming,development,mobile,web,game,polyglot,software engineering,javascript,docker,golang,java,nativescript,ionic framework,angular,unity'
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data`,
      },
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Archivo`,
            variants: [
              `400`,
              `700`,
            ],
            subsets: [`latin`],
          },
          {
            family: "Oswald",
            variants: [
              `400`,
              `700`,
            ],
          },
        ],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `100`,
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              maintainCase: true,
              removeAccents: true,
              enableCustomId: true
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              const siteUrl = site.siteMetadata.siteUrl;
              return allMarkdownRemark.edges.map(edge => {
                const slug = edge.node.fields.slug;
                const {frontmatter} = edge.node;
                const nodeUrl = `${siteUrl}posts${slug}`
                return {
                  description: edge.node.excerpt,
                  date: frontmatter.published,
                  title: frontmatter.title,
                  url: nodeUrl,
                  guid: nodeUrl,
                  custom_elements: [
                    {"dc:creator": frontmatter.author.name },
                    {comments: `${nodeUrl}#disqus_thread`}
                  ],
                }})
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___published] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        published
                        author {
                          name
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Unicorn Utterances's RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Unicorn Utterances`,
        short_name: `Unicorn Utterances`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#127db3`,
        display: `minimal-ui`,
        icon: `content/assets/unicorn-utterances-logo-512.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\/src\/assets\/icons\/.*\.svg$/, // See below to configure properly
        },
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        languages: [
          {
            name: "en",
            // A function for filtering nodes. () => true by default
            filterNodes: node => !!node.frontmatter,
          },
        ],
        // Fields to index. If store === true value will be stored in index file.
        // Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
        fields: [
          {
            name: "title",
            store: true,
            attributes: { boost: 20 },
          },
          { name: "content" },
          {
            name: "slug",
            store: true,
          },
          { name: "author" },
          { name: "tags" },
        ],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            content: node => node.rawMarkdownBody,
            slug: node => node.fields.slug,
            author: node => node.frontmatter.author.name,
            tags: node => node.frontmatter.tags,
          },
        },
        //custom index file name, default is search_index.json
        filename: "search_index.json",
        //custom options on fetch api call for search_ındex.json
        fetchOptions: {
          credentials: "same-origin",
        },
      },
    },
  ],
  mapping: {
    "MarkdownRemark.frontmatter.author": `AuthorsJson`,
    "AuthorsJson.pronouns": `PronounsJson`,
  },
}
