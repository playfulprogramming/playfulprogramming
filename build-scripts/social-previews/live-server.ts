import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { ensureDirectoryExistence } from "./utils";
import { renderPostPreviewToString } from "./shared-post-preview-png";

import banner from "./layouts/banner";
import twitterPreview from "./layouts/twitter-preview";
import { Layout } from "./base";
import { getPostBySlug } from "utils/api";

export const layouts: Layout[] = [banner, twitterPreview];

const __dirname = dirname(fileURLToPath(import.meta.url));

const post = getPostBySlug("async-pipe-is-not-pure", "en")!;

const rebuild = async () => {
	console.log("rebuilding...");

	for (const layout of layouts) {
		const html = await renderPostPreviewToString(layout, post);

		const previewHtmlPath = resolve(__dirname, `./dist/${layout.name}.html`);
		ensureDirectoryExistence(previewHtmlPath);
		writeFileSync(previewHtmlPath, html);
	}

	console.log("done");
};

rebuild();
