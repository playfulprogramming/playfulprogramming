const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");

const isNonDevBuild = process.env.BUILD_ENV !== "development";

module.exports = withPlugins(
  [
    [
      optimizedImages,
      {
        optimizeImagesInDev: isNonDevBuild,
        optimizeImages: isNonDevBuild,
        inlineImageLimit: 1,
        imagesName: "[name]-[hash].[ext]",
        handleImages: ["png", "jpeg"],
        responsive: {
          adapter: require("responsive-loader/sharp"),
          quality: 85,
        },
      },
    ],
  ],
  {
    trailingSlash: true,
    compress: false, // NOTE: enable this when doing SSR
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

      config.resolve.symlinks = true;

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
    devIndicators: {
      autoPrerender: false,
    },
    images: {
      disableStaticImages: true,
    },
  }
);
