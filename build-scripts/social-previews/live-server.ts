import { getAllPosts } from "../../src/utils/get-all-posts";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { LiveServerParams } from "live-server";
import chokidar from "chokidar";
import liveServer from "@compodoc/live-server";
import { Layout } from "./base";
import { ensureDirectoryExistence } from "./utils";

const __dirname = dirname(fileURLToPath(import.meta.url));

const posts = getAllPosts("en");

/**
 * TODO: Migrate to a single live-server instance powered by API
 *
 * Should look something like:
 *
 * ```
 * const liveServer = new LiveServer();
 * liveServer.open();
 * chokidar.watch("./social-previews").on("all", (event, path) => {
 *     const html = renderPostPreviewToString(posts[0]);
 *     liveServer.reload(html);
 * });
 * ```
 */
const rebuild = async () => {
	console.log("rebuilding...");

	// This needs to happen here, since otherwise the `import` is stale at runtime,
	// thus breaking live refresh
	// ?update=${Date.now()}
	const renderer = // We need `?update=""` to cache bust for live reload
		await import(`./shared-post-preview-png`);

	for (const layout of renderer.layouts as Layout[]) {
		const html = await renderer.renderPostPreviewToString(layout, posts[0]);

		const previewHtmlPath = resolve(__dirname, `./dist/${layout.name}.html`);
		ensureDirectoryExistence(previewHtmlPath);
		writeFileSync(previewHtmlPath, html);
	}

	console.log("done");
};

chokidar.watch(resolve(__dirname, "layouts")).on("change", () => {
	rebuild();
});

const params: LiveServerParams = {
	root: resolve(__dirname, "./dist"), // Set root directory that's being served. Defaults to cwd.
	file: "twitter-preview.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
};

rebuild().then(() => {
	liveServer.start(params);
});
