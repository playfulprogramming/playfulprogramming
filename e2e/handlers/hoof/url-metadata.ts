import env from "../../../src/constants/env";
import { http } from "msw";

export const urlMetadataHandler = http.post(
	`${env.HOOF_URL}/tasks/url-metadata`,
	() => {
		return Response.json(
			{
				error: false,
				banner: {
					src: "/share-banner.png",
					width: 896,
					height: 448,
				},
				icon: {
					src: "/icons/icon-192x192.png",
					width: 192,
					height: 192,
				},
				title: "Mocked Url Metadata",
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
