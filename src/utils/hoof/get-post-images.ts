import { setTimeout } from "timers/promises";
import { client } from "./client";
import { isSocketError } from "./isSocketError";
import { PostInfo } from "types/PostInfo";
import { relative } from "path";
import fs from "fs/promises";
import { createHash } from "crypto";

interface PostImagesResponse {
	banner?: string;
	linkPreview?: string;
}

export async function getPostImages(
	post: Pick<PostInfo, "slug" | "authors" | "file">,
): Promise<PostImagesResponse> {
	const indexRaw = await fs.readFile(post.file, "utf-8");
	const request = {
		slug: post.slug,
		author: post.authors[0],
		path: relative(process.cwd(), post.file),
		indexMd5: createHash("md5").update(indexRaw).digest("hex"),
	};

	for (let retries = 0; retries < 10; retries++) {
		await setTimeout(Math.pow(retries, 2) * 1000);

		const req = await client
			.POST("/tasks/post-images", {
				body: request,
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
			const error = `Error ${response.status} fetching post image: '${request.slug}'`;
			console.error(error);
			throw new Error(error);
		}

		if (retries > 2) {
			console.warn(`Waiting for post image (retry ${retries})`, {
				slug: request.slug,
			});
		}
	}

	throw new Error(`Waited too long for post image: '${request.slug}'`);
}
