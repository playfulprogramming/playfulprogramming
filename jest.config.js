module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(test).ts?(x)"],
	moduleNameMapper: {
		".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
		".+(/|\\\\)assets(/|\\\\)icons(/|\\\\).+\\.svg$": `<rootDir>/__mocks__/svg-comp-mock.ts`,
		".+\\.(jpg|svg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.ts`
	},
	testPathIgnorePatterns: [`node_modules`, `.cache`],
	transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
	globals: {
		__PATH_PREFIX__: ``
	},
	setupFilesAfterEnv: ["<rootDir>/config/jest/setup-test-env.ts"],
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname"
	]
};
