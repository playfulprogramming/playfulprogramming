/** @jsxRuntime automatic */
import { Element } from "hast";
import type { Child as HChild } from "hastscript";
import { fromHtml } from "hast-util-from-html";
import { getIcon } from "./file-tree-icons";

/** Convert an HTML string containing an SVG into a HAST element node. */
const makeSVGIcon = (svgString: string) => {
	const root = fromHtml(svgString, { fragment: true });
	const svg = root.children[0] as Element;
	svg.properties = {
		...svg.properties,
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
	`<svg viewBox="0 0 20 20">
<path d="M4 3C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V8C18 6.89543 17.1046 6 16 6H11L10.0528 4.10557C9.714 3.428 9.02148 3 8.26393 3H4Z"/>
</svg>
`,
);

export interface File {
	name: string;
	comment?: HChild[];
	filetype: string;
	isDirectory: false;
	isPlaceholder: boolean;
	isHighlighted: boolean;
}

export interface Directory {
	name: string;
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
	return (
		<>
			<span
				className={`docs-file-tree-file-name-and-icon ${
					item.isHighlighted ? "highlighted" : ""
				} text-style-body-small`}
			>
				<span class="docs-file-tree-file-icon">
					{item.isPlaceholder ? null : FileIcon(item.name)}
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
					} text-style-body-small-bold`}
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
