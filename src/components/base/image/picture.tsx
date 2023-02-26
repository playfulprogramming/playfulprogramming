import { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";

interface PictureProps {
	picture: GetPictureResult;
	alt: string,
	class?: string;
	imgAttrs?: React.ImgHTMLAttributes<any>;
}

export const Picture = ({
	picture, alt,
	class: className,
	imgAttrs,
}: PictureProps) => {
	return (
		<picture class={`${className || ''}`}>
			{picture.sources.map((attrs) => (
				<source {...attrs} />
			))}
			<img
				{...(picture.image as any)}
				{...imgAttrs}
				alt={alt}
			/>
		</picture>
	);
};
