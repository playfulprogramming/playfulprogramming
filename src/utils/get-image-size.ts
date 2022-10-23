import path from "path";
import sizeOf from "image-size";

const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

export function getImageSize(src: string, dir: string, rootDir: string) {
	if (absolutePathRegex.exec(src)) {
		return;
	}
	// Treat `/` as a relative path, according to the server
	const shouldJoin = !path.isAbsolute(src);

	if (dir && shouldJoin) {
		src = path.join(dir, src);
	}

	const shouldJoinAtRoot = src.startsWith("/");

	if (rootDir && shouldJoinAtRoot) {
		src = path.join(rootDir, src);
	}

	return sizeOf(src);
}
