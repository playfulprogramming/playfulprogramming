import { unicorns } from "./data";
import { getPicture } from "utils/get-picture";

/**
 * We do it this way so that we only generate the list of images once
 *
 * This allows us to share the cached image format between multiple different pages
 */
const unicornProfilePicMap = Promise.all(
	[...unicorns.values()]
		.filter((locales) => locales.length)
		.map(async ([unicorn]) => ({
			...(await getPicture({
				src: unicorn.profileImgMeta.relativeServerPath,
				formats: ["webp", "png"],
				widths: [192, 128, 96, 72, 48],
				aspectRatio: 1,
			})),
			id: unicorn.id,
		})),
);

export const getUnicornProfilePicMap = async () => {
	return await unicornProfilePicMap;
};

export type ProfilePictureMap = Awaited<
	ReturnType<typeof getUnicornProfilePicMap>
>;
