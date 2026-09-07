import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { unzipSync, strFromU8 } from "fflate";
import { GET, getStaticPaths } from "../pages/generated/projects/[slug].zip.ts";

const fixture = vi.hoisted(() => ({ contentDirectory: "" }));

vi.mock("#utils/data.ts", () => ({
	get contentDirectory() {
		return fixture.contentDirectory;
	},
}));

vi.mock("#utils/api.ts", () => {
	const post = { slug: "example-post", path: "author/posts/example-post" };
	return {
		getAllPosts: () => [post],
		getPostBySlug: (slug: string) => (slug === post.slug ? post : undefined),
	};
});

vi.mock("#src/paraglide/runtime.js", () => ({ baseLocale: "en" }));

async function download(slug: string) {
	return await GET({ params: { slug } } as unknown as Parameters<
		typeof GET
	>[0]);
}

describe("project downloads", () => {
	beforeEach(async () => {
		fixture.contentDirectory = await fs.mkdtemp(
			path.join(os.tmpdir(), "project-download-"),
		);
		const postDir = path.join(
			fixture.contentDirectory,
			"author/posts/example-post",
		);
		await fs.mkdir(path.join(postDir, "project/src"), { recursive: true });
		await fs.writeFile(
			path.join(postDir, "project/src/index.ts"),
			"export {};",
		);
		await fs.writeFile(path.join(postDir, "index.md"), "Post content");
		const outsideDir = path.join(fixture.contentDirectory, "private");
		await fs.mkdir(outsideDir);
		await fs.writeFile(path.join(outsideDir, "secret.txt"), "Private data");
		await fs.symlink(outsideDir, path.join(postDir, "linked-project"), "dir");
	});

	afterEach(async () => {
		vi.restoreAllMocks();
		await fs.rm(fixture.contentDirectory, { recursive: true, force: true });
	});

	it("preserves generated paths and downloads the project files", async () => {
		expect(await getStaticPaths()).toEqual([
			{ params: { slug: "example-post_project" } },
		]);
		const response = await download("example-post_project");
		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toBe("application/zip");
		const files = unzipSync(new Uint8Array(await response.arrayBuffer()));
		expect(Object.keys(files)).toEqual(["src/index.ts"]);
		expect(strFromU8(files["src/index.ts"])).toBe("export {};");
	});

	it.each([
		"example-post",
		"example-post_",
		"_project",
		"example-post_project_extra",
		"example-post_.",
		"example-post_..",
		"example-post_../../../private",
		"example-post_..\\..\\..\\private",
		"example-post_/private",
		"example-post_project\0",
		"missing-post_project",
		"example-post_missing-project",
		"example-post_index.md",
		"example-post_linked-project",
	])("returns 404 without reading files for %s", async (slug) => {
		const readDirectory = vi.spyOn(fs, "readdir");
		const readFile = vi.spyOn(fs, "readFile");
		expect((await download(slug)).status).toBe(404);
		expect(readDirectory).not.toHaveBeenCalled();
		expect(readFile).not.toHaveBeenCalled();
	});
});
