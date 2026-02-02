import env from "../../../src/constants/env";
import { http } from "msw";

export const postImagesHandler = http.post(
	`${env.HOOF_URL}/tasks/post-images`,
	() => {
		return Response.json(
			{
				error: false,
				images: [],
			},
			{
				headers: {
					"x-ratelimit-limit": "99999999",
					"x-ratelimit-remaining": "99999999",
					"x-ratelimit-reset": "0",
				},
			},
		);
	},
);
