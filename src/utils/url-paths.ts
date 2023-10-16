/**
 * Matches:
 * - ftp://
 * - https://
 * - //
 */
export const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

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
		? paths.length
			? "."
			: fixSlash(paths.join("/"))
		: paths[paths.length - 1];
};
