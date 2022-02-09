const { resolve } = require("path");

// Add any custom config to be passed to Jest
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/__mocks__/jest.setup.js"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: ["next/babel"],
        plugins: ["transform-require-context"],
      },
    ],
  },
  transformIgnorePatterns: [
    // ...your ignore patterns
    "^((?!node_modules).)*node_modules.((?!unified|unist|hast|remark|mdast|micromark|retext|nlcst|rehype|decode-named-character-reference|character-entities|zwitch|longest-streak|unherit|parse-|strip-|html-void-elements|stringify-entities|ccount|markdown-|slash|vfile|property-|space-separated-|comma-separated-|web-namespaces|react-children-utilities).)*$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  moduleNameMapper: {
    // NextJS
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Handle module aliases
    "^@/components/(.*)$": "<rootDir>/components/$1",
    // UU Files
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.svg$": `<rootDir>/__mocks__/svg-comp-mock.ts`,
    ".+\\.(jpg|svg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(?:\\?.+)?$": `<rootDir>/__mocks__/file-mock.ts`,
    // UU TS
    "^__mocks__/(.*)$": resolve(__dirname, "./__mocks__/$1"),
    "^constants/(.*)$": resolve(__dirname, "./src/constants/$1"),
    "^types/(.*)$": resolve(__dirname, "./src/types/$1"),
    "^components/(.*)$": resolve(__dirname, "./src/components/$1"),
    "^utils/(.*)$": resolve(__dirname, "./src/utils/$1"),
    "^uu-types$": resolve(__dirname, "./src/types"),
    "^uu-utils$": resolve(__dirname, "./src/utils"),
    "^uu-constants$": resolve(__dirname, "./src/constants"),
    "^assets/(.*)": resolve(__dirname, "./src/assets/$1"),
  },
};
