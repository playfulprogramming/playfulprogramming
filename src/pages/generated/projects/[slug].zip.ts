import type { APIRoute } from "astro";
import { getAllPosts, getPostBySlug } from "#utils/api.ts";
import path from "path";
import { contentDirectory } from "#utils/data.ts";
import fs from "fs/promises";
import { createZip } from "#utils/zip.ts";
import { baseLocale } from "#src/paraglide/runtime.js";

export async function findProjectDir(slug: string): Promise<string> {
	const [postSlug, projectId] = slug.split("_");
	const post = await getPostBySlug(postSlug, baseLocale);
	if (!post) throw new Error(`Post ${postSlug} does not exist!`);

	const postDir = path.join(contentDirectory, post.path);
	return path.join(postDir, projectId);
}

export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug);
	const dir = await findProjectDir(slug);
	const files = await fs.readdir(dir, { recursive: true });
	const zipFiles: Record<string, Buffer> = {};
	for (const file of files) {
		if (file.startsWith("node_modules/")) continue;

		const absoluteFile = path.join(dir, file);
		const stat = await fs.stat(absoluteFile);
		if (stat.isFile()) {
			const buffer = await fs.readFile(absoluteFile);
			zipFiles[file] = buffer;
		}
	}

	return new Response(new Uint8Array(await createZip(zipFiles)), {
		headers: {
			"Content-Type": "application/zip",
		},
	});
};

export async function getStaticPaths() {
	const projects = new Set<string>();

	for (const post of await getAllPosts()) {
		const postDir = path.join(contentDirectory, post.path);
		for (const entry of await fs.readdir(postDir, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				if (entry.name.includes("_")) {
					throw new Error(
						`Project ID (${post.slug}/${entry.name}) must not contain an '_'.`,
					);
				}
				const projectId = `${post.slug}_${entry.name}`;
				projects.add(projectId);
			}
		}
	}

	return Array.from(projects).map((slug) => ({ params: { slug } }));
}
