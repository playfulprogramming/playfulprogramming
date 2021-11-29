import urljoin from "url-join";

export const isRelativePath = (str: string) => {
    return str.startsWith('./') || /^\w/.exec(str);
}

export const getFullRelativePath = (slug: string, srcStr: string) => {
    if (srcStr.startsWith('./')) srcStr = srcStr.slice(2);
    return isRelativePath(srcStr) ?
        // URLJoin doesn't seem to handle the `./` well
        urljoin('/posts', slug, srcStr)
        : srcStr
}
