/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { promises as fs } from "fs";

const chevron_down = await fs.readFile("src/icons/chevron_down.svg", "utf8");

const ChevronDownIcon = fromHtml(chevron_down, { fragment: true })
	.children[0] as Element;
ChevronDownIcon.properties["aria-hidden"] = "true";

interface HintProps {
	title: string;
	children: Node[];
}

/** @jsxImportSource hastscript */
export function Hint({ title, children }: HintProps): Element {
	return (
		<div class="hint">
			<details class="hint__container">
				<summary class="hint__title text-style-body-medium-bold">
					{ChevronDownIcon}
					{title}
				</summary>

				<div class="hint__content">{children}</div>
			</details>
		</div>
	) as never;
}
