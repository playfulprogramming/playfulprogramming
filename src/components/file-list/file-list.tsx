import { RawSvg } from "components/image/raw-svg";
import { getIcon } from "./file-tree-icons";
import style from "./file-list.module.scss";

const FolderIcon = `
<svg viewBox="0 0 20 20">
	<path d="M4 3C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V8C18 6.89543 17.1046 6 16 6H11L10.0528 4.10557C9.714 3.428 9.02148 3 8.26393 3H4Z"/>
</svg>
`;

export interface File {
	name: string;
	commentHtml?: string;
	filetype: string;
	isDirectory: false;
	isPlaceholder: boolean;
	isHighlighted: boolean;
}

export interface Directory {
	name: string;
	commentHtml?: string;
	isDirectory: true;
	items: Array<Directory | File>;
	openByDefault: boolean;
	isHighlighted: boolean;
}

const isDirectory = (item: Directory | File): item is Directory => {
	return (item as Directory).isDirectory;
};

interface FileProps {
	item: File;
}

function File({ item }: FileProps) {
	return (
		<div class={style.fileContainer}>
			<span
				className={`${style.fileNameAndIcon} text-style-body-small`}
				data-highlighted={item.isHighlighted}
			>
				<span class={style.fileIcon}>
					{item.isPlaceholder ? null : <RawSvg icon={getIcon(item.name).svg} aria-hidden />}
				</span>
				{item.name}
			</span>
			{item.commentHtml && item.commentHtml.length ? (
				<span class={`${style.comment} text-style-body-small`} dangerouslySetInnerHTML={{ __html: item.commentHtml }} />
			) : null}
		</div>
	);
}

interface DirectoryProps {
	item: Directory;
}

function Directory({ item }: DirectoryProps) {
	return (
		<details open={item.openByDefault} class={style.directoryDetails}>
			<summary class={style.directorySummary}>
				<span
					className={`${style.directoryNameAndIcon} text-style-body-small-bold`}
					data-highlighted={item.isHighlighted}
				>
					<span class={style.directoryIcon} aria-label="Directory">
						<RawSvg icon={FolderIcon} aria-hidden />
					</span>
					{item.name}
				</span>
				{item.commentHtml && item.commentHtml.length ? (
					<span class={`${style.comment} text-style-body-small`} dangerouslySetInnerHTML={{ __html: item.commentHtml }} />
				) : null}
			</summary>
			{FileListList({ items: item.items })}
		</details>
	);
}

interface FileListProps {
	items: Array<Directory | File>;
}

function FileListList({ items }: FileListProps) {
	return (
		<ul class={style.fileTreeList}>
			{items.map((item) => (
				<li>
					{isDirectory(item) ? Directory({ item }) : File({ item })}
				</li>
			))}
		</ul>
	);
}

export function FileList({ items }: FileListProps) {
	return (
		<div class={`${style.fileTreeContainer} markdownCollapsePadding`}>
			<div class={style.fileTree}>{FileListList({ items })}</div>
		</div>
	);
}
