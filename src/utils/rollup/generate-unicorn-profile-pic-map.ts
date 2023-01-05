import fs from "fs";
import { unicorns } from "../data";

/**
 * They need to be the same `getImage` with the same `globalThis` instance, thanks to the "hack" workaround.
 */
import { getPicture } from "../../../node_modules/@astrojs/image";
import sharp_service from "../../../node_modules/@astrojs/image/dist/loaders/sharp.js";

interface GenerateUnicornProfilePicMapProps {
	output: string;
}

function generateUnicornProfilePicMap(
	options: GenerateUnicornProfilePicMapProps
) {
	const { output } = options;
	let copied = false;
	return {
		name: "generateUnicornProfilePicMap",
		options: async () => {
			// Only run once per dev HMR instance
			if (copied) {
				return;
			}

			// HACK: This is a hack that heavily relies on `getImage`'s internals :(
			globalThis.astroImage = {
				...(globalThis.astroImage || {}),
				loader: sharp_service ?? globalThis.astroImage?.loader,
				defaultLoader: sharp_service ?? globalThis.astroImage?.defaultLoader,
			};

			/**
			 * We do it this was so that we only generate the list of images once
			 *
			 * This allows us to share the cached image format between multiple different pages
			 */
			const unicornProfilePicMap = await Promise.all(
				unicorns.map(async (unicorn) => ({
					...(await getPicture({
						src: unicorn.profileImgMeta.relativeServerPath,
						formats: ["webp", "png"],
						widths: [72, 48],
						aspectRatio: 1,
						alt: "",
					})),
					id: unicorn.id,
				}))
			);

			const js = `const data = ${JSON.stringify(unicornProfilePicMap)};
			
			export default data;`;

			await fs.promises.writeFile(output, js);

			copied = true;
		},
	};
}

export default generateUnicornProfilePicMap;
