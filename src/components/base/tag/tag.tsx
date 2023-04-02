import { PropsWithChildren } from '../types';
import style from './tag.module.scss';

type TagProps = PropsWithChildren<{
	href: string;
}>;

export function Tag({ href, children, ...props }: TagProps) {
	return (
		<a class={`${style.tag} ${style.tagBordered} text-style-button`} href={href}>
			{children}
		</a>
	);
}

export function TagLink({ href, children, ...props }: TagProps) {
	return (
		<a class={`${style.tag} text-style-button`} href={href}>
			{children}
		</a>
	);
}
