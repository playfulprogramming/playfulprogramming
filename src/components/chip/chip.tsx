import { PropsWithChildren } from '../types';
import style from './chip.module.scss';

type ChipProps = PropsWithChildren<{
	href?: string;
	class?: string;
	bordered?: boolean;
}>;

function ChipBase({ href, children, bordered }: ChipProps) {
	return (
			<a class={`${style.tag} text-style-button-regular` + ' ' + (bordered ? `${style.tagBordered}` : ``)} href={href}>
				{children}
			</a>
	)
}

export function Chip({...props }: ChipProps) {
	return (
		<ChipBase {...props} bordered/>
	);
}

export function ChipLink({...props }: ChipProps) {
	return (
		<ChipBase {...props}/>
	);
}
