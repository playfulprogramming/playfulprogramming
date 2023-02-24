import style from './tag.module.scss';

interface TagProps {
	href: string;
}

export function Tag({ href }: TagProps) {
	return (
		<a class={style.tag} href={href}><slot/></a>
	);
}
