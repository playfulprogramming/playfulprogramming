import { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";
import { JSX } from "preact";

interface PictureProps {
	picture: GetPictureResult;
	alt: string;
	class?: string;
	imgAttrs?: JSX.HTMLAttributes<HTMLImageElement>;
}

export const Picture = ({
	picture,
	alt,
	class: className,
	imgAttrs,
}: PictureProps) => {
	return (
		<picture class={`${className || ""}`}>
			{picture?.sources.map((attrs) => <source {...attrs} />)}
			<img {...((picture?.image as any) ?? {})} {...imgAttrs} alt={alt} />
		</picture>
	);
};
