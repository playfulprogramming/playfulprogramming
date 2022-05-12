import { getSocialPosts } from "./social-previews/get-posts";
import { renderPostPreviewToString } from "./create-post-social-preview-png";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { LiveServerParams } from "live-server";
import chokidar from "chokidar";
// @ts-ignore
import liveServer from "@compodoc/live-server";

const __dirname = dirname(fileURLToPath(import.meta.url));

function ensureDirectoryExistence(filePath: string) {
  const localDirname = dirname(filePath);
  if (existsSync(localDirname)) {
    return true;
  }
  ensureDirectoryExistence(localDirname);
  mkdirSync(localDirname);
}

const posts = getSocialPosts();

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
const rebuild = () => {
  const html = renderPostPreviewToString(posts[0]);

  const previewHtmlPath = resolve(__dirname, "./dist/preview.html");
  ensureDirectoryExistence(previewHtmlPath);
  writeFileSync(previewHtmlPath, html);
};

chokidar.watch(resolve(__dirname, "./social-previews")).on("change", () => {
  rebuild();
});

rebuild();

const params: LiveServerParams = {
  root: resolve(__dirname, "./dist"), // Set root directory that's being served. Defaults to cwd.
  file: "preview.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
  wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
  logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
};

liveServer.start(params);
