/** @jsxRuntime automatic */
import { Node, Element } from "hast";

interface HintProps {
	title: string;
	children: Node[];
};

/** @jsxImportSource hastscript */
export function Hint({ title, children }: HintProps): Element {
	return (
		<details class="hint">
			<summary class="hint__title text-style-body-medium-bold">
				{title}
			</summary>

			<div class="hint__content">
				{children}
			</div>
		</details>
	) as never;
}
