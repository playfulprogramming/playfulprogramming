/** @jsxRuntime automatic */
import { Node, Element } from "hast";

interface File {
	name: string;
	filetype: string;
	isDirectory: false;
}

interface Directory {
	name: string;
	isDirectory: true;
	items: Array<Directory | File>;
}

interface FileProps {
	item: File;
}

/** @jsxImportSource hastscript */
function File({ item }: FileProps) {
	return (
		<span class="tree-entry">
			<span>
				<svg class="tree-icon" aria-hidden="true"></svg>
				<code>{item.name}</code>
			</span>
		</span>
	) as never;
}

interface DirectoryProps {
	item: Directory;
}

/** @jsxImportSource hastscript */
function Directory({ item }: DirectoryProps) {
	return (
		<details open>
			<summary>
				<span className="tree-entry">
					<span>
						<svg className="tree-icon" aria-hidden="true"></svg>
						<code>{item.name}</code>
					</span>
				</span>
			</summary>
			<FileListList items={item.items} />
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
					{isDirectory(item) ? <Directory item={item} /> : <File item={item} />}
				</li>
			))}
		</ul>
	) as never;
}

/** @jsxImportSource hastscript */
export function FileList({ items }: FileListProps): Element {
	return (
		<div class="docs-file-tree">
			<FileListList items={items} />
		</div>
	) as never;
}
