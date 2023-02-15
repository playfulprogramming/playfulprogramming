import * as astroImage from "@astrojs/image";
import {
	GetPictureParams,
	GetPictureResult,
} from "@astrojs/image/dist/lib/get-picture";
import sharp_service from "../../../node_modules/@astrojs/image/dist/loaders/sharp.js";

export function getPicture(
	params: GetPictureParams
): Promise<GetPictureResult> {
	// HACK: This is a hack that heavily relies on `getImage`'s internals :(
	globalThis.astroImage = {
		...(globalThis.astroImage || {}),
		loader: globalThis.astroImage?.loader ?? sharp_service,
		defaultLoader: globalThis.astroImage?.defaultLoader ?? sharp_service,
	};

	return astroImage.getPicture(params);
}
