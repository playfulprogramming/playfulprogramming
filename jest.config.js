const { resolve } = require("path");

module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(test).ts?(x)"],
	moduleNameMapper: {
		".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
		".+\\.svg$": `<rootDir>/__mocks__/svg-comp-mock.ts`,
		".+\\.(jpg|svg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.ts`,
		"^__mocks__/(.*)$": resolve(__dirname, "./__mocks__/$1"),
		"^constants/(.*)$": resolve(__dirname, "./src/constants/$1"),
		"^types/(.*)$": resolve(__dirname, "./src/types/$1"),
		"^components/(.*)$": resolve(__dirname, "./src/components/$1"),
		"^utils/(.*)$": resolve(__dirname, "./src/utils/$1"),
		"^uu-types$": resolve(__dirname, "./src/types"),
		"^uu-utils$": resolve(__dirname, "./src/utils"),
		"^uu-constants$": resolve(__dirname, "./src/constants"),
		"^assets/(.*)": resolve(__dirname, "./src/assets/$1")
	},
	testPathIgnorePatterns: [`node_modules`, `.cache`],
	transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
	globals: {
		__PATH_PREFIX__: ``,
		"ts-jest": {
			tsConfig: "tsconfig.json"
		}
	},
	setupFilesAfterEnv: ["<rootDir>/config/jest/setup-test-env.ts"],
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname"
	]
};
