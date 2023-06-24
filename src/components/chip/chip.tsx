import { PropsWithChildren } from '../types';
import style from './chip.module.scss';

type ChipProps = PropsWithChildren<{
	href?: string;
	class?: string;
}>;

export function Chip({ href, children }: ChipProps) {
	return (
			<a class={`${style.tag} text-style-button-regular`} href={href}>
				{children}
			</a>
	)
}