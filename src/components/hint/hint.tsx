import { RawSvg } from "#components/image/raw-svg.tsx";
import type { JSXNode } from "#components/types.ts";
import ChevronDownIcon from "#src/assets/icons/chevron_down.svg?raw";
import style from "./hint.module.scss";

interface HintProps {
	title: string;
	children: JSXNode;
}

export function Hint({ title, children }: HintProps) {
	return (
		<div className={`${style.hint} markdownCollapsePadding`}>
			<details className={style.details}>
				<summary className={`${style.title} text-style-body-medium-bold`}>
					<RawSvg aria-hidden icon={ChevronDownIcon} />
					{title}
				</summary>

				<div className={style.content}>{children}</div>
			</details>
		</div>
	);
}
