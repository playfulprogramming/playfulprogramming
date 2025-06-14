import { RawSvg } from "components/image/raw-svg";
import { JSXNode } from "components/types";
import ChevronDownIcon from "src/icons/chevron_down.svg?raw";
import style from "./hint.module.scss";

interface HintProps {
	title: string;
	children: JSXNode;
}

export function Hint({ title, children }: HintProps) {
	return (
		<div class={`${style.hint} markdownCollapsePadding`}>
			<details class={style.details}>
				<summary class={`${style.title} text-style-body-medium-bold`}>
					<RawSvg aria-hidden icon={ChevronDownIcon} />
					{title}
				</summary>

				<div class={style.content}>{children}</div>
			</details>
		</div>
	);
}
