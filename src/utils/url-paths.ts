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

export const getFullRelativePostImgPath = (slug: string, srcStr: string) => {
  return isRelativePath(srcStr) ? slash(join("/posts", slug, srcStr)) : srcStr;
};

export const getFullRelativeAuthorImgPath = (srcStr: string) => {
  return isRelativePath(srcStr) ? slash(join("/unicorns", srcStr)) : srcStr;
};
