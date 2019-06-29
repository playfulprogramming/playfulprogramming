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
              icon: `<svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M26.1587 1.50034C23.7989 1.47983 21.5255 2.38698 19.8281 4.02641L19.8126 4.04159L17.2326 6.60659C16.6451 7.19067 16.6423 8.14041 17.2264 8.7279C17.8105 9.31539 18.7602 9.31816 19.3477 8.73409L21.9196 6.17715C23.0504 5.08869 24.5628 4.48659 26.1326 4.50023C27.7058 4.5139 29.2107 5.14491 30.3231 6.25736C31.4356 7.36981 32.0666 8.87468 32.0802 10.4479C32.0939 12.0169 31.4923 13.5287 30.4047 14.6594L25.9145 19.1497L25.9143 19.1499C25.306 19.7584 24.574 20.2289 23.7679 20.5296C22.9618 20.8303 22.1004 20.9541 21.2423 20.8927C20.3841 20.8312 19.5492 20.5859 18.7941 20.1734C18.0391 19.7609 17.3816 19.1908 16.8663 18.5019C16.3701 17.8385 15.43 17.703 14.7667 18.1992C14.1033 18.6954 13.9678 19.6354 14.464 20.2988C15.237 21.3322 16.2232 22.1873 17.3558 22.8061C18.4883 23.4249 19.7407 23.7928 21.028 23.885C22.3152 23.9772 23.6072 23.7915 24.8164 23.3404C26.0256 22.8894 27.1236 22.1835 28.036 21.2708L32.5358 16.771L32.5541 16.7524C34.1935 15.055 35.1006 12.7816 35.0801 10.4218C35.0596 8.06202 34.1131 5.80471 32.4444 4.13604C30.7758 2.46737 28.5184 1.52085 26.1587 1.50034ZM16.3025 11.9157C15.0153 11.8235 13.7232 12.0092 12.5141 12.4603C11.305 12.9113 10.2068 13.6173 9.29449 14.5299L4.79468 19.0297L4.77641 19.0483C3.13698 20.7457 2.22983 23.0191 2.25034 25.3789C2.27085 27.7387 3.21737 29.996 4.88604 31.6647C6.55471 33.3333 8.81202 34.2799 11.1718 34.3004C13.5316 34.3209 15.805 33.4137 17.5024 31.7743L17.521 31.756L20.086 29.191C20.6718 28.6052 20.6718 27.6555 20.086 27.0697C19.5002 26.4839 18.5505 26.4839 17.9647 27.0697L15.4094 29.625C14.2787 30.7125 12.7669 31.3141 11.1979 31.3005C9.62468 31.2868 8.11981 30.6558 7.00736 29.5433C5.89491 28.4309 5.2639 26.926 5.25023 25.3528C5.23659 23.7838 5.83817 22.272 6.92573 21.1413L11.4162 16.6508C12.0245 16.0423 12.7565 15.5718 13.5626 15.2711C14.3687 14.9704 15.23 14.8466 16.0882 14.908C16.9464 14.9695 17.7813 15.2148 18.5363 15.6273C19.2914 16.0398 19.9488 16.6099 20.4642 17.2988C20.9604 17.9622 21.9004 18.0977 22.5638 17.6015C23.2272 17.1053 23.3627 16.1653 22.8665 15.5019C22.0935 14.4685 21.1072 13.6134 19.9747 12.9946C18.8421 12.3758 17.5898 12.0079 16.3025 11.9157Z" fill="#153E67"/></svg>`,
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
