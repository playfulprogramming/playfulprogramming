import path from "path";
import sizeOf from "image-size";

const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

export function getImageSize(src: string, relativeDir?: string) {
	if (absolutePathRegex.exec(src)) {
		return;
	}

	// Treat `/` as a relative path from the "public" directory
	const publicDirectory = path.resolve(process.cwd(), "public");

	if (path.isAbsolute(src) && src.startsWith("/"))
		src = path.join(publicDirectory, src);
	else if (relativeDir) src = path.join(relativeDir, src);

	return sizeOf(src);
}
