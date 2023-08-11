export const STICKER_SIZE = 144;

export type StickerInfo = {
	src: string;
	width: number;
	height: number;
};

export async function createSticker(
	src: string,
	width: number = STICKER_SIZE,
	height: number = STICKER_SIZE,
): Promise<StickerInfo> {
	return {
		src,
		width,
		height,
	};
}

export async function getStickers(): Promise<StickerInfo[]> {
	return await Promise.all([
		createSticker("/stickers/android.svg"),
		createSticker("/stickers/angular.svg"),
		createSticker("/stickers/html.svg"),
		createSticker("/stickers/python.svg"),
		createSticker("/stickers/react.svg"),
		createSticker("/stickers/typescript.svg"),
		createSticker("/stickers/vue.svg"),
		createSticker(
			"/stickers/ferris.svg",
			STICKER_SIZE,
			STICKER_SIZE * (399 / 512),
		),
		createSticker("/stickers/git.svg"),
	]);
}
