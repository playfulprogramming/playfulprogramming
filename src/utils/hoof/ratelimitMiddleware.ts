import { setTimeout } from "node:timers/promises";
import { Middleware } from "openapi-fetch";

const detailsMap: Map<
	string,
	{
		/** the remaining number of requests in the current window */
		remaining: number;
		/** epoch millis at which the window will reset */
		resetsAt: number;
	}
> = new Map();

const randomTimeoutSpread = 10000;

export const ratelimitMiddleware: Middleware = {
	async onRequest({ request }) {
		const origin = new URL(request.url).origin;
		const details = detailsMap.get(origin);

		// If details is not yet populated, continue as normal
		if (!details) return;

		if (details.remaining <= 0) {
			const waitForMillis = details.resetsAt - Date.now();
			if (waitForMillis > 0) {
				const waitForSeconds = Math.round(waitForMillis / 1000);
				console.log(
					`Waiting ${waitForSeconds}s for the ${origin} ratelimit to reset.`,
				);
				await setTimeout(waitForMillis + Math.random() * randomTimeoutSpread);
			}
		} else {
			details.remaining--;
		}
	},
	async onResponse({ request, response }) {
		// the # of remaining requests
		const ratelimitRemaining = Number(
			response.headers.get("x-ratelimit-remaining"),
		);
		// the # of seconds from now until the window resets
		const ratelimitReset = Number(response.headers.get("x-ratelimit-reset"));

		if (isFinite(ratelimitRemaining) && isFinite(ratelimitReset)) {
			const origin = new URL(request.url).origin;
			const details = detailsMap.get(origin);
			const resetsAt = Date.now() + ratelimitReset * 1000;
			if (details) {
				if (resetsAt - details.resetsAt > 1000) {
					// if the ratelimit is in a new window, update the remaining value from the header
					details.remaining = ratelimitRemaining;
					console.log(
						`Refreshed ${origin} ratelimit: ${ratelimitRemaining} requests remaining.`,
					);
				} else {
					// otherwise, use the minimum value to account for inflight requests
					details.remaining = Math.min(details.remaining, ratelimitRemaining);
				}
				details.resetsAt = resetsAt;
			} else {
				detailsMap.set(origin, {
					remaining: ratelimitRemaining,
					resetsAt,
				});
			}
		}
	},
};
