import { RawSvg } from "components/image/raw-svg";
import { getIcon } from "./file-tree-icons";
import style from "./file-list.module.scss";

const FolderIcon = `
<svg viewBox="0 0 20 20">
	<path d="M4 3C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V8C18 6.89543 17.1046 6 16 6H11L10.0528 4.10557C9.714 3.428 9.02148 3 8.26393 3H4Z"/>
</svg>
`;

export interface FileProps {
	name: string;
	commentHtml?: string;
	filetype: string;
	isDirectory: false;
	isPlaceholder: boolean;
	isHighlighted: boolean;
	onClick?(): void;
	autofocus?: boolean;
}

export interface DirectoryProps {
	name: string;
	commentHtml?: string;
	isDirectory: true;
	items: Array<DirectoryProps | FileProps>;
	openByDefault: boolean;
	isHighlighted: boolean;
}

const isDirectory = (
	item: DirectoryProps | FileProps,
): item is DirectoryProps => {
	return (item as DirectoryProps).isDirectory;
};

export function File(props: FileProps) {
	const Tag = props.onClick ? "button" : "div";
	return (
		<Tag
			class={style.fileContainer}
			onClick={props.onClick}
			autofocus={props.autofocus}
		>
			<span
				className={`${style.fileNameAndIcon} text-style-body-small`}
				data-highlighted={props.isHighlighted}
			>
				<span class={style.fileIcon}>
					{props.isPlaceholder ? null : (
						<RawSvg icon={getIcon(props.name).svg} aria-hidden />
					)}
				</span>
				{props.name}
			</span>
			{props.commentHtml && props.commentHtml.length ? (
				<span
					class={`${style.comment} text-style-body-small`}
					dangerouslySetInnerHTML={{ __html: props.commentHtml }}
				/>
			) : null}
		</Tag>
	);
}

function Directory(props: DirectoryProps) {
	return (
		<details open={props.openByDefault} class={style.directoryDetails}>
			<summary class={style.directorySummary}>
				<span
					className={`${style.directoryNameAndIcon} text-style-body-small-bold`}
					data-highlighted={props.isHighlighted}
				>
					<span class={style.directoryIcon} aria-label="Directory">
						<RawSvg icon={FolderIcon} aria-hidden />
					</span>
					{props.name}
				</span>
				{props.commentHtml && props.commentHtml.length ? (
					<span
						class={`${style.comment} text-style-body-small`}
						dangerouslySetInnerHTML={{ __html: props.commentHtml }}
					/>
				) : null}
			</summary>
			{FileListList({ items: props.items })}
		</details>
	);
}

interface FileListProps {
	items: Array<DirectoryProps | FileProps>;
}

export function FileListList({ items }: FileListProps) {
	return (
		<ul class={style.fileTreeList}>
			{items.map((item) => (
				<li key={item.name}>
					{isDirectory(item) ? Directory(item) : File(item)}
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
