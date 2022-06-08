const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const withPlugins = require("next-compose-plugins");
const webpack = require("webpack");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([withBundleAnalyzer], {
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "content/blog"),
            to: path.resolve(__dirname, "public/posts"),
            globOptions: {
              ignore: ["**/*.md"],
            },
          },
          {
            from: path.resolve(__dirname, "content/collections"),
            to: path.resolve(__dirname, "public/collections"),
            globOptions: {
              ignore: ["**/*.md"],
            },
          },
          {
            from: path.resolve(__dirname, "content/data"),
            to: path.resolve(__dirname, "public/unicorns"),
            globOptions: {
              ignore: ["**/*.md", "**/*.json"],
            },
          },
        ],
      })
    );

    /**
     * 🐲 HERE ARE DRAGONS!
     *
     * This is a bad bad idea. Well, it leads to much better bundle size (50+kb!)
     * but it does so by dynamically replacing a module only for client (not server)
     *
     * For more explaination of why we're using webpack to do this, see `useMarkdownRenderer`
     */
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /rehype-parse$/,
        "rehype-dom-parse"
      )
    );

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    config.experiments.topLevelAwait = true;

    return config;
  },
});
