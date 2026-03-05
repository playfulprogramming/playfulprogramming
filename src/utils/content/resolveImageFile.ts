import type { LocalFile } from "#types/LocalFile.ts";
import { getImageSize } from "#utils/get-image-size.ts";
import { resolvePath } from "#utils/url-paths.ts";

export async function resolveImageFile(
	imgPath: string,
	basePath: string,
): Promise<LocalFile> {
	if (imgPath.replace(/^\.\//, "").indexOf("/") !== -1) {
		throw new Error(
			`${basePath}: Image ${imgPath} must be stored adjacent to its md file.`,
		);
	}

	const coverImgSize = await getImageSize(imgPath, basePath);
	if (!coverImgSize || !coverImgSize.width || !coverImgSize.height) {
		throw new Error(`${basePath}: Unable to parse ${imgPath} image size`);
	}

	return {
		height: coverImgSize.height,
		width: coverImgSize.width,
		...resolvePath(imgPath, basePath)!,
	};
}
