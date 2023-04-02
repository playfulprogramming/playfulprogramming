import { PropsWithChildren } from '../types';
import style from './tag.module.scss';

type TagProps = PropsWithChildren<{
	href?: string;
	class?: string;
}>;

export function Tag({ href, children, class: className = "", ...props }: TagProps) {
	return (
		<a class={`${style.tag} ${style.tagBordered} ${className} text-style-button`} href={href}>
			{children}
		</a>
	);
}

export function TagLink({ href, children, class: className = "", ...props }: TagProps) {
	return (
		<a class={`${style.tag} ${className} text-style-button`} href={href}>
			{children}
		</a>
	);
}
