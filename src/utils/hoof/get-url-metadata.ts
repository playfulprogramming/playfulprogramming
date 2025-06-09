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
	error: boolean;
}

export async function getUrlMetadata(
	url: string,
): Promise<UrlMetadataResponse> {
	const { data, response } = await client.POST("/tasks/url-metadata", {
		body: { url },
	});

	if (data && response.status === 200) {
		return data;
	}

	const error = `Error ${response.status} fetching url: '${url}'`;
	throw new Error(error);
}
