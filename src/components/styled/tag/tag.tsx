import { GetPictureResult } from '@astrojs/image/dist/lib/get-picture';
import { Picture } from '../image/picture';
import style from './tag.module.scss';

interface TagProps {
	href: string;
	picture?: GetPictureResult;
	alt?: string;
	children: string|JSX.Element|(string|JSX.Element)[];
}

export function Tag({ href, picture, children, ...props }: TagProps) {
	return (
		<a class={`${style.tag} ${picture && style.tagWithPicture} text-style-button`} href={href}>
			{picture && (
				<Picture
					picture={picture}
					alt={props.alt}
					class={`circleImg ${style.picture}`}
					imgAttrs={{ width: 24, height: 24 }}
				/>
			)}
			<span>{children}</span>
		</a>
	);
}
