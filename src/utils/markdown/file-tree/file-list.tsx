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
	`<svg viewBox="0 0 16 14"><path d="M2 0C0.895431 0 0 0.895429 0 2V12C0 13.1046 0.89543 14 2 14H14C15.1046 14 16 13.1046 16 12V5C16 3.89543 15.1046 3 14 3H9L8.05279 1.10557C7.714 0.428005 7.02148 0 6.26393 0H2Z"/></svg>`
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
