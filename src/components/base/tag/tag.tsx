import style from './tag.module.scss';

interface TagProps {
	href: string;
	children: string|JSX.Element|(string|JSX.Element)[];
}

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
