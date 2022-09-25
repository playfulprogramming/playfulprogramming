import { getImage } from "@astrojs/image";
import { unicorns } from "utils/data";

export const getUnicornProfilePicMap = async () => {
	/**
	 * We do it this was so that we only generate the list of images once
	 *
	 * This allows us to share the cached image format between multiple different pages
	 */
	globalThis.unicornProfilePicMap =
		globalThis.unicornProfilePicMap ||
		(await Promise.all(
			unicorns.map(async (unicorn) => ({
				...(await getImage({
					src: unicorn.profileImgMeta.relativeServerPath,
					height: 88,
					width: 88,
					format: "png",
				})),
				id: unicorn.id,
			}))
		));
	const unicornProfilePicMap: astroHTML.JSX.ImgHTMLAttributes[] =
		globalThis.unicornProfilePicMap;
	return unicornProfilePicMap;
};
