import type { APIRoute } from "astro";
import { getAllPosts, getPostBySlug } from "#utils/api.ts";
import path from "path";
import { contentDirectory } from "#utils/data.ts";
import fs from "fs/promises";
import { zip } from "fflate";
import { baseLocale } from "#src/paraglide/runtime.js";

export async function findProjectDir(
	slug: string,
): Promise<string | undefined> {
	const [postSlug, projectId, extraPart] = slug.split("_");
	if (
		!postSlug ||
		!projectId ||
		extraPart !== undefined ||
		projectId === "." ||
		projectId === ".." ||
		/[\\/\0]/.test(projectId)
	) {
		return undefined;
	}

	const post = await getPostBySlug(postSlug, baseLocale);
	if (!post) return undefined;

	const postDir = path.join(contentDirectory, post.path);
	const projectDir = path.join(postDir, projectId);
	try {
		// Match getStaticPaths: only actual child directories are downloadable.
		// In SSR, arbitrary requests can also name files or directory symlinks.
		return (await fs.lstat(projectDir)).isDirectory() ? projectDir : undefined;
	} catch (error) {
		if (
			(error as NodeJS.ErrnoException).code === "ENOENT" ||
			(error as NodeJS.ErrnoException).code === "ENOTDIR"
		) {
			return undefined;
		}
		throw error;
	}
}

export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug);
	const dir = await findProjectDir(slug);
	if (!dir) return new Response("Not found", { status: 404 });

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

	const zipBuffer: Uint8Array = await new Promise((res, rej) => {
		zip(
			zipFiles,
			{ consume: true, level: 9, mtime: new Date("1981-01-01 0:00 UTC") },
			(err, data) => {
				if (data) res(data);
				else rej(err);
			},
		);
	});

	return new Response(Buffer.from(zipBuffer), {
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
