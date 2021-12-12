const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["flexsearch"]);

module.exports = withPlugins([withTM], {
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "content/blog"),
            to: path.resolve(__dirname, "public/posts"),
          },
          {
            from: path.resolve(__dirname, "content/data"),
            to: path.resolve(__dirname, "public/unicorns"),
          },
        ],
      })
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

    return config;
  },
});
