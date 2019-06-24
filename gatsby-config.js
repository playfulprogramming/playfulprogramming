module.exports = {
  siteMetadata: {
    title: `Unicorn Utterances`,
    description: `Learning programming from magically majestic words`,
    siteUrl: `https://unicorn-utterances.com/`,
    disqusShortname: "unicorn-utterances",
    repoPath: "crutchcorn/unicorn-utterances",
    relativeToPosts: "/content/blog",
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
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
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
    `gatsby-plugin-feed`,
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
