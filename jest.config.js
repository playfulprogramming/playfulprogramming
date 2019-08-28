module.exports = {
  transform: {
    "^.+\\.jsx?$": `<rootDir>/config/jest/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+(\/|\\\\)assets(\/|\\\\)icons(\/|\\\\).+\\.svg$": `<rootDir>/__mocks__/svg-comp-mock.js`,
    ".+\\.(jpg|svg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  setupFiles: [`<rootDir>/config/jest/loadershim.js`],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setup-test-env.js"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
}
