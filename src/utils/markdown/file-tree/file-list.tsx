/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import type { HChild } from "hastscript/lib/core";
import { fromHtml } from "hast-util-from-html";
import { getIcon } from "./file-tree-icons";
import { toString } from "hast-util-to-string";

/** Convert an HTML string containing an SVG into a HAST element node. */
const makeSVGIcon = (svgString: string) => {
	const root = fromHtml(svgString, { fragment: true });
	const svg = root.children[0] as Element;
	svg.properties = {
		...svg.properties,
		width: 16,
		height: 16,
		class: "tree-icon",
		"aria-hidden": "true",
	};
	return svg;
};

const FileIcon = (filename: string) => {
	const { svg } = getIcon(filename);
	return makeSVGIcon(svg);
};

const FolderIcon = makeSVGIcon(
	'<svg viewBox="-5 -5 26 26"><path d="M1.8 1A1.8 1.8 0 0 0 0 2.8v10.4c0 1 .8 1.8 1.8 1.8h12.4a1.8 1.8 0 0 0 1.8-1.8V4.8A1.8 1.8 0 0 0 14.2 3H7.5a.3.3 0 0 1-.2-.1l-.9-1.2A2 2 0 0 0 5 1H1.7z"/></svg>'
);

export interface File {
	name: Node;
	comment?: HChild[];
	filetype: string;
	isDirectory: false;
	isPlaceholder: boolean;
	isHighlighted: boolean;
}

export interface Directory {
	name: Node;
	comment?: HChild[];
	isDirectory: true;
	items: Array<Directory | File>;
	openByDefault: boolean;
	isHighlighted: boolean;
}

interface FileProps {
	item: File;
}

/** @jsxImportSource hastscript */
function File({ item }: FileProps) {
	const rawName = toString(item.name as never);

	return (
		<>
			<span
				className={`docs-file-tree-file-name-and-icon ${
					item.isHighlighted ? "highlighted" : ""
				} text-style-body-small-bold`}
			>
				<span class="docs-file-tree-file-icon">
					{item.isPlaceholder ? null : FileIcon(rawName)}
				</span>
				{item.name}
			</span>
			{item.comment && item.comment.length ? (
				<span class="docs-file-tree-comment text-style-body-small">
					{item.comment}
				</span>
			) : null}
		</>
	) as never;
}

interface DirectoryProps {
	item: Directory;
}

/** @jsxImportSource hastscript */
function Directory({ item }: DirectoryProps) {
	return (
		<details open={item.openByDefault} class="docs-file-tree-directory-details">
			<summary class="docs-file-tree-directory-summary">
				<span
					className={`docs-file-tree-directory-name-and-icon ${
						item.isHighlighted ? "highlighted" : ""
					} text-style-body-small`}
				>
					<span class="docs-file-tree-directory-icon" aria-label="Directory">
						{FolderIcon}
					</span>
					{item.name}
				</span>
				{item.comment && item.comment.length ? (
					<span class="docs-file-tree-comment text-style-body-small">
						{item.comment}
					</span>
				) : null}
			</summary>
			{FileListList({ items: item.items })}
		</details>
	) as never;
}

interface FileListProps {
	items: Array<Directory | File>;
}

/** @jsxImportSource hastscript */
function FileListList({ items }: FileListProps) {
	const isDirectory = (item: Directory | File): item is Directory => {
		return (item as Directory).isDirectory;
	};

	return (
		<ul className="docs-file-tree-list">
			{items.map((item) => (
				<li
					className={
						item.isDirectory
							? "docs-file-tree-directory-li"
							: "docs-file-tree-file-li"
					}
					data-filetype={isDirectory(item) ? "dir" : item.filetype}
				>
					{isDirectory(item) ? Directory({ item }) : File({ item })}
				</li>
			))}
		</ul>
	) as never;
}

/** @jsxImportSource hastscript */
export function FileList({ items }: FileListProps): Element {
	return (
		<div className="docs-file-tree-container">
			<div class="docs-file-tree">{FileListList({ items })}</div>
		</div>
	) as never;
}
