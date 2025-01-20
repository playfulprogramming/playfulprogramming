import { HOOF_URL } from "./constants";
import { setTimeout } from "node:timers/promises";

interface UrlMetadataRequest {
	url: string;
}

interface UrlMetadataResponse {
	title?: string;
	icon?: string;
	banner?: string;
}

async function getUrlMetadataTask(url: string): Promise<Response> {
	return await fetch(`${HOOF_URL}/tasks/url-metadata`, {
		method: "POST",
		headers: {
			["Content-Type"]: "application/json",
		},
		body: JSON.stringify({ url } satisfies UrlMetadataRequest),
	});
}

export async function getUrlMetadata(
	url: string,
): Promise<UrlMetadataResponse> {
	for (let retries = 0; retries < 10; retries++) {
		await setTimeout(Math.pow(retries, 2) * 1000);

		const result = await getUrlMetadataTask(url);

		if (result.status === 200) {
			return await result.json();
		}

		if (result.status !== 202) {
			const error = `Error ${result.status} fetching url: '${url}'`;
			console.error(error);
			throw new Error(error);
		}

		console.log(`Retry ${retries}, waiting for metadata for: ${url}`);
	}

	throw Error(`Waited too long for url metadata: '${url}'`);
}
