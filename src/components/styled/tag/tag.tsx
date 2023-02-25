import style from './tag.module.scss';

interface TagProps {
	href: string;
	children: React.ReactNode;
}

export function Tag({ href, children }: TagProps) {
	return (
		<a class={`${style.tag} text-style-button`} href={href}>
			<span>{children}</span>
		</a>
	);
}
