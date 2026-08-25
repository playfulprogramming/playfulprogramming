require("./playwright-config.cjs");

const addonMiddleware = require("storybook-addon-playwright/middleware");

module.exports = function middleware(router) {
	addonMiddleware(router);
};
