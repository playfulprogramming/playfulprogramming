import { setTimeout } from "node:timers/promises";
import { client } from "./client";

interface UrlMetadataResponse {
	title?: string;
	icon?: {
		src: string;
		width?: number;
		height?: number;
	};
	banner?: {
		src: string;
		width?: number;
		height?: number;
	};
}

export async function getUrlMetadata(
	url: string,
): Promise<UrlMetadataResponse> {
	for (let retries = 0; retries < 10; retries++) {
		await setTimeout(Math.pow(retries, 2) * 1000);

		const { data, response } = await client.POST("/tasks/url-metadata", {
			body: { url },
		});

		if (data && response.status === 200) {
			return data;
		}

		if (response.status !== 202) {
			const error = `Error ${response.status} fetching url: '${url}'`;
			console.error(error);
			throw new Error(error);
		}

		if (retries > 2) {
			console.warn(`Waiting for URL metadata (retry ${retries})`, { url });
		}
	}

	throw Error(`Waited too long for url metadata: '${url}'`);
}
