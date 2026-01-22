import env from "../../../src/constants/env";
import { http } from "msw";

export const postImagesHandler = http.post(
	`${env.HOOF_URL}/tasks/post-images`,
	() => {
		return Response.json({
			error: false,
			images: [],
		});
	},
);
