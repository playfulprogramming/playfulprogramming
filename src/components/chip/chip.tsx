import {Children} from 'react';
import { PropsWithChildren } from "../types";
import style from "./chip.module.scss";

type ChipProps = PropsWithChildren<{
	href?: string;
	class?: string;
}>;

export function Chip({ href, children }: ChipProps) {
	return (
		<a class={`${style.chip} text-style-button-regular`} href={href}>
			<span class={`${style.chip_content}`}>{children}</span>
		</a>
	);
}
