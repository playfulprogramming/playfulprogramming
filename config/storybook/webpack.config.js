module.exports = ({ config }) => {
  // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
  config.module.rules = [
    {
      exclude: [/node_modules\/(?!(gatsby)\/)/],
      use: [
        {
          // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              // use @babel/preset-react for JSX and env (instead of staged presets)
              require.resolve("@babel/preset-react"),
              require.resolve("@babel/preset-env"),
            ],
            plugins: [
              // use @babel/plugin-proposal-class-properties for class arrow functions
              require.resolve("@babel/plugin-proposal-class-properties"),
              // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
              require.resolve("babel-plugin-remove-graphql-queries"),
            ],
          },
        },
      ],
    },
    {
      test: /\.css$/,
      loader: require.resolve("css-loader"),
      options: {
        modules: true
      },
    },
  ]

  // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
  config.resolve.mainFields = [
    "browser",
    "module",
    "main",
  ]

  return config
}
