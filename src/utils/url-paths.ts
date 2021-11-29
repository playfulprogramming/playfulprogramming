import urljoin from "url-join";

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
    // Matches simple `test.png` links
    const simpleRelativePath = /^\w/.exec(str);
    return str.startsWith('./') || str.startsWith('/') || (
        simpleRelativePath
    )
}

export const getFullRelativePath = (slug: string, srcStr: string) => {
    if (srcStr.startsWith('./')) srcStr = srcStr.slice(2);
    return isRelativePath(srcStr) && !srcStr.startsWith('/') ?
        // URLJoin doesn't seem to handle the `./` well
        urljoin('/posts', slug, srcStr)
        : srcStr
}
