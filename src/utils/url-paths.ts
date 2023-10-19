import { join } from "path";

/**
 * Matches:
 * - ftp://
 * - https://
 * - //
 */
export const absolutePathRegex = /^(?:[a-z]+:)?\/?\//;

const fixSlash = (path: string) => {
	return /^\\\\\?\\/.test(path) ? path : path.replace(/\\/g, "/");
};

export const isRelativePath = (str: string) => {
	const isAbsolute = absolutePathRegex.exec(str);
	if (isAbsolute) return false;
	return true;
};

export const getFullRelativePath = (...paths: string[]) => {
	return isRelativePath(paths[paths.length - 1])
		? fixSlash(join(...paths))
		: paths[paths.length - 1];
};
