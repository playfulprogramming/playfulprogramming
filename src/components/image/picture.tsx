import type { GetPictureResult } from "utils/get-picture";
import type { JSX } from "preact";

interface PictureProps {
	picture: GetPictureResult;
	alt: string;
	class?: string;
	pictureAttrs?: JSX.HTMLAttributes<HTMLPictureElement> & Record<string, unknown>;
	imgAttrs?: JSX.HTMLAttributes<HTMLImageElement> & Record<string, unknown>;
}

export const Picture = ({
	picture,
	alt,
	class: className,
	pictureAttrs,
	imgAttrs,
}: PictureProps) => {
	return (
		<picture class={className} {...pictureAttrs}>
			{picture?.sources.map((attrs) => <source {...attrs} />)}
			<img {...((picture?.image) ?? {})} alt={alt} {...imgAttrs}/>
		</picture>
	);
};
