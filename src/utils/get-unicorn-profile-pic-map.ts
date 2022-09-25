import { getPicture } from "@astrojs/image";
import { unicorns } from "utils/data";

/**
 * TODO: THIS IS A MAJOR OPTIMIZATION (15KB on every page load), READ THIS
 *
 * Right now, we're storing an inlined script of `getPicture` into the HTML of the page because Astro cannot
 * 	use both `defer` external scripts, and `declare:vars`. This means that 15KB of this profile pic mapping is externalized currently.
 *
 * To fix this, instead of generating this at Astro build time, we should do this during an earlier compile step that simply runs
 *  this `getPicture` code and then outputs to a JS file, then the Astro build will read from this JS file
 */
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
				...(await getPicture({
					src: unicorn.profileImgMeta.relativeServerPath,
					formats: ["webp", "png"],
					widths: [72, 48],
					aspectRatio: 1,
				})),
				id: unicorn.id,
			}))
		));
	const unicornProfilePicMap: Array<
		Awaited<ReturnType<typeof getPicture>> & { id: string }
	> = globalThis.unicornProfilePicMap;
	return unicornProfilePicMap;
};

export type ProfilePictureMap = Awaited<
	ReturnType<typeof getUnicornProfilePicMap>
>;
