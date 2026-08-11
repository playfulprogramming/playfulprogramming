import {
	type GetPictureOptions,
	type GetPictureUrls,
	getPictureAttrs,
	getPictureUrls,
} from "#utils/get-picture/index.ts";
import type { HTMLAttributes } from "preact";

interface PictureProps extends GetPictureOptions {
	urls?: GetPictureUrls;
	alt: string;
	class?: string;
	pictureAttrs?: HTMLAttributes<HTMLPictureElement> & Record<string, unknown>;
	imgAttrs?: HTMLAttributes<HTMLImageElement> & Record<string, unknown>;
}

export const Picture = ({
	alt,
	class: className,
	pictureAttrs,
	imgAttrs,
	urls,
	...props
}: PictureProps) => {
	const pictureUrls = urls ?? getPictureUrls(props);
	const pictureResult = getPictureAttrs(props, pictureUrls);
	return (
		<picture class={className} {...pictureAttrs}>
			{pictureResult.sources.map((attrs, i) => (
				<source key={i} {...attrs} />
			))}
			<img
				crossorigin="anonymous"
				alt={alt}
				{...pictureResult.image}
				{...imgAttrs}
			/>
		</picture>
	);
};
