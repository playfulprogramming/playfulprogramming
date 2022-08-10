import path from "path";
import sizeOf from "image-size";

const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

export function getImageSize(src, dir) {
    if (absolutePathRegex.exec(src)) {
        return;
    }
    // Treat `/` as a relative path, according to the server
    const shouldJoin = !path.isAbsolute(src) || src.startsWith("/");

    if (dir && shouldJoin) {
        src = path.join(dir, src);
    }
    return sizeOf(src);
}
