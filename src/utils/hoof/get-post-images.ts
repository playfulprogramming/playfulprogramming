import { client } from "./client";

interface PostImagesRequest {
	slug: string;
	author: string;
	path: string;
}

interface PostImagesResponse {
	banner: string;
	linkPreview: string;
}

export async function getPostImages(
	request: PostImagesRequest,
): Promise<PostImagesResponse> {
	const { data, response } = await client.POST("/tasks/post-images", {
		body: request,
	});

	if (data && response.status === 200) {
		return data;
	}

	const error = `Error ${response.status} fetching post images: '${request.slug}'`;
	throw new Error(error);
}
