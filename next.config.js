const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "content/blog"),
            to: path.resolve(__dirname, "public/posts"),
          },
        ],
      })
    );

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
