import { getImage } from "@astrojs/image";

export const STICKER_SIZE = 144;

export type StickerInfo = {
	src: string;
	width: number;
	height: number;
	name: string;
};

export async function createSticker(
	name: string,
	width: number = STICKER_SIZE,
	height: number = STICKER_SIZE,
): Promise<StickerInfo> {
	const image = await getImage({
		src: `/stickers/${name}.png`,
		width,
		height,
		alt: "",
		format: "png",
	});

	return {
		src: image.src,
		width,
		height,
		name,
	};
}

export async function getStickers(): Promise<StickerInfo[]> {
	return await Promise.all([
		createSticker("android"),
		createSticker("angular"),
		createSticker("html"),
		createSticker("python"),
		createSticker("react"),
		createSticker("typescript"),
		createSticker("vue"),
		createSticker("ferris", STICKER_SIZE, STICKER_SIZE * (399 / 512)),
		createSticker("git"),
	]);
}
