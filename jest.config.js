const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
const nextJest = require("next/jest");
const { resolve } = require("path");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  moduleNameMapper: {
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

const asyncConfig = createJestConfig(customJestConfig);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    // ...your ignore patterns
    "node_modules/(?!(unified|bail|is-plain-obj|trough|vfile|unist|hast|remark|mdast|micromark|parse-entities|character-entities|zwitch|longest-streak|retext|unherit|parse|nlcst|rehype|slash|strip-markdown).*/)",
  ];
  return config;
};
