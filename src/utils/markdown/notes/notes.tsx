/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { promises as fs } from "fs";

const info = await fs.readFile("src/icons/info.svg", "utf8");
const warning = await fs.readFile("src/icons/warning.svg", "utf8");

interface NoteProps {
	icon: "info" | "warning";
	title: string;
	children: Node[];
};

/** @jsxImportSource hastscript */
export function Note({ icon, title, children }: NoteProps): Element {
	return (
		<blockquote class="note">
			<div class="note__title">
				{icon === "info" ? fromHtml(info) : fromHtml(warning)}
				<p>{title}</p>
			</div>
			<div class="note__content">
				{children}
			</div>
		</blockquote>
	) as never;
}
