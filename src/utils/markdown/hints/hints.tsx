/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { promises as fs } from "fs";

const chevron_down = await fs.readFile("src/icons/chevron_down.svg", "utf8");

interface HintProps {
	title: string;
	children: Node[];
};

/** @jsxImportSource hastscript */
export function Hint({ title, children }: HintProps): Element {
	return (
		<details class="hint">
			<summary class="hint__title text-style-body-medium-bold">
				{fromHtml(chevron_down)}
				{title}
			</summary>

			<div class="hint__content">
				{children}
			</div>
		</details>
	) as never;
}
