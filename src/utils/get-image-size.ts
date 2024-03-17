import sizeOf from "image-size";

import { resolvePath } from "./url-paths";

export function getImageSize(src: string, relativeDir: string) {
	const path = resolvePath(src, relativeDir);
	if (!path) return undefined;
	return sizeOf(path.absoluteFSPath);
}
