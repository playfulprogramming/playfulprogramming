import type { FastifyPluginAsync } from "fastify";

export const postImagesRoutes: FastifyPluginAsync = async (http) => {
	http.post("/tasks/post-images", (_, res) => {
		res.headers({
			"x-ratelimit-limit": "99999999",
			"x-ratelimit-remaining": "99999999",
			"x-ratelimit-reset": "0",
		});
		res.send({
			error: false,
			images: [],
		});
	});
};
