import path, { join } from "path";

/**
 * Matches:
 * - ftp://
 * - https://
 * - //
 */
export const urlPathRegex = /^(?:[a-z]+:)?\/\//;

/**
 * Matches:
 * - /path/to/file
 */
export const absolutePathRegex = /^\/[^\/]/;

export function isURL(str: string) {
	return urlPathRegex.test(str);
}

export type ResolvedPath = {
	// the absolute path of the file
	absoluteFSPath: string;
	// a relative path to the file from the {process.cwd()}
	relativePath: string;
	// a relative path to the file from the server's "public" directory (prefixed with "/")
	relativeServerPath: string;
};

/**
 * Determines various paths to the provided image, based on the input
 * path and relative dir.
 *
 * If the [inputPath] is relative, this function resolves its location from
 * the provided [relativeDir];
 * e.g. "./profile.jpg" in "/content/fennifith" is "{cwd}/content/fennifith/profile.jpg".
 *
 * If the [inputPath] is absolute, it is assumed to be within the "/public" folder;
 * e.g. "/custom-content/cover.jpg" is "{cwd}/public/custom-content/cover.jpg"
 *
 * If [inputPath] is a URL, this returns undefined.
 *
 * @param inputPath The input path to the image, such as "./profile.jpg" or "/content/profile.jpg"
 * @param relativeDir The dirname where the file should be parsed from, if the path is relative
 */
export function resolvePath(
	inputPath: string,
	relativeDir: string,
): ResolvedPath | undefined {
	if (urlPathRegex.test(inputPath)) return undefined;

	const rootDir = process.cwd();
	const rootServerDir = join(rootDir, "public");

	const isAbsolute = absolutePathRegex.test(inputPath);
	const absoluteFSPath = isAbsolute
		? path.join(rootServerDir, inputPath)
		: path.resolve(relativeDir, inputPath);

	return {
		absoluteFSPath,
		relativePath: path.relative(rootDir, absoluteFSPath),
		relativeServerPath: isAbsolute
			? // if the path is absolute, then absoluteFSPath is already inside the rootServerDir
				"/" + path.relative(rootServerDir, absoluteFSPath)
			: // otherwise, it should resolve relative to the rootDir to avoid "/../content/image.png"
				"/" + path.relative(rootDir, absoluteFSPath),
	};
}
