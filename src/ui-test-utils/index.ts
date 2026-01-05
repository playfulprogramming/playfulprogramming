import { test as base } from "vitest";
import { setupWorker } from "msw/browser";

export * from "vitest";

export const worker = setupWorker();

const test = base.extend({
	worker: [
		// eslint is silly and thinks this is destructuring
		// eslint-disable-next-line no-empty-pattern
		async ({}, use) => {
			await worker.start({
				serviceWorker: { url: "/mockServiceWorker.js" },
				onUnhandledRequest: "warn",
			});

			await use(worker);

			worker.resetHandlers();
			worker.stop();
		},
		{ auto: true },
	],
});

export { test, test as it };
