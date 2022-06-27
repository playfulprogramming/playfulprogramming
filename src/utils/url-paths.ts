import { join } from "path";
import slash from "slash";

/**
 * Matches:
 * - ftp://
 * - https://
 * - //
 */
export const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

export const isRelativePath = (str: string) => {
  const isAbsolute = absolutePathRegex.exec(str);
  if (isAbsolute) return false;
  return true;
};

export const getFullRelativePath = (...paths: string[]) => {
  return isRelativePath(paths[paths.length - 1])
    ? slash(join(...paths))
    : paths[paths.length - 1];
};

export const trimTrailingSlash = (path: string) => {
  if (path.endsWith("/")) return path.slice(0, path.length - 1);
  return path;
};
