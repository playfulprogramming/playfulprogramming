/**
 * @see https://github.com/tiaanduplessis/image-to-uri/blob/master/index.js
 */
import fs from "fs";
import path from "path";

const extTypeMap = {
	".png": "image/png",
	".gif": "image/gif",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".bm": "image/bmp",
	".bmp": "image/bmp",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".svg": "image/svg+xml",
};

export function readFileAsBase64(file: string) {
	const image = fs.readFileSync(file, { encoding: "base64" });
	const contentType =
		extTypeMap[path.extname(file) as keyof typeof extTypeMap] || "image/jpeg";
	return `data:${contentType};base64,${image}`;
}

export function ensureDirectoryExistence(filePath: string) {
	const localDirname = path.dirname(filePath);
	fs.mkdirSync(localDirname, { recursive: true });
}
