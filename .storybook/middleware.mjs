import "./playwright-config.ts";

import addonMiddleware from "storybook-addon-playwright/middleware";

export default function middleware(router) {
	addonMiddleware(router);
}
