import { getAllPosts } from "../../src/utils/get-all-posts";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { ensureDirectoryExistence } from "./utils";
import { layouts, renderPostPreviewToString } from "./shared-post-preview-png";

const __dirname = dirname(fileURLToPath(import.meta.url));

const posts = getAllPosts("en");

const rebuild = async () => {
	console.log("rebuilding...");

	for (const layout of layouts) {
		const html = await renderPostPreviewToString(layout, posts[0]);

		const previewHtmlPath = resolve(__dirname, `./dist/${layout.name}.html`);
		ensureDirectoryExistence(previewHtmlPath);
		writeFileSync(previewHtmlPath, html);
	}

	console.log("done");
};

rebuild();
