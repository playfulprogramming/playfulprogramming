import type { JSX } from "preact";
import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export interface GetPictureOptions {
	src: string | ImageMetadata;
	widths: number[];
	formats?: ("avif" | "webp" | "png")[];
	aspectRatio: number;
	loading?: "eager" | "lazy";
}

export interface GetPictureResult {
	image: JSX.HTMLAttributes<HTMLImageElement>;
	sources: { type: string; srcset: string }[];
}

export async function getPicture(
	options: GetPictureOptions,
): Promise<GetPictureResult> {
	const formats = options.formats ?? ["avif", "webp", "png"];

	const sources = await Promise.all(
		formats.flatMap((format) =>
			options.widths.map((width) =>
				getImage({
					src: options.src,
					width,
					height: width / options.aspectRatio,
					format,
				}),
			),
		),
	);

	const image = sources[0];

	return {
		image: {
			src: image.src,
			width: Math.round(image.attributes.width),
			height: Math.round(image.attributes.height),
			decoding: "async",
			loading: options.loading ?? "lazy",
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		sources: sources.map((source: any) => ({
			type: `image/${source.options.format}`,
			srcset: `${source.src} ${source.attributes.width}w`,
		})),
	};
}
