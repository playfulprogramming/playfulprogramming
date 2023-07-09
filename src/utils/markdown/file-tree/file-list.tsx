/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import type { HChild } from "hastscript/lib/core";

/**
 * TODO:
 * - [ ] Highlighted
 * - [ ] Placeholder
 * - [ ] SVGs
 */

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
	return (
		<span class="tree-entry">
			<span>
				<span>
					<svg class="tree-icon" aria-hidden="true"></svg>
				</span>
				{item.name}
			</span>
			{item.comment && item.comment.length ? (
				<span class="comment">{item.comment}</span>
			) : null}
		</span>
	) as never;
}

interface DirectoryProps {
	item: Directory;
}

/** @jsxImportSource hastscript */
function Directory({ item }: DirectoryProps) {
	return (
		<details open={item.openByDefault}>
			<summary>
				<span className="tree-entry">
					<span>
						<span>
							<span className="sr-only">Directory</span>
							<svg className="tree-icon" aria-hidden="true"></svg>
						</span>
						{item.name}
					</span>
					{item.comment && item.comment.length ? (
						<span class="comment">{item.comment}</span>
					) : null}
				</span>
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
					className={item.isDirectory ? "directory" : "file"}
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
	return (<div class="docs-file-tree">{FileListList({ items })}</div>) as never;
}
