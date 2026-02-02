import { setTimeout } from "timers/promises";
import { client } from "./client";
import { isSocketError } from "./isSocketError";

export interface UrlMetadataResponse {
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
	error: boolean;
}

export async function getUrlMetadata(
	url: string,
): Promise<UrlMetadataResponse> {
	for (let retries = 0; retries < 10; retries++) {
		await setTimeout(Math.pow(retries, 2) * 1000);

		const req = await client
			.POST("/tasks/url-metadata", {
				body: { url },
			})
			.catch((e) => ({ exception: e }) as const);

		if ("exception" in req) {
			if (isSocketError(req.exception)) {
				continue;
			} else {
				throw req.exception;
			}
		}

		const { data, response } = req;

		if (data && response.status === 200) {
			return data;
		}

		if (response.status !== 201) {
			const error = `Error ${response.status} fetching url metadata: '${url}'`;
			console.error(error);
			throw new Error(error);
		}

		if (retries > 2) {
			console.warn(`Waiting for url metadata (retry ${retries})`, { url });
		}
	}

	throw new Error(`Waited too long for url metadata: '${url}'`);
}
