import {
	DirectoryProps,
	FileProps,
	File,
	FileListList,
} from "components/file-list/file-list";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { FileEntry } from "./types";
import { Dialog } from "components/dialog/dialog";
import style from "./file-picker.module.scss";

interface FilePickerProps {
	entries: Array<FileEntry>;
	file: string;
	onFileChange?(file: string): void;
}

function buildFileItems(
	props: FilePickerProps,
): Array<DirectoryProps | FileProps> {
	const files: Array<DirectoryProps | FileProps> = [];

	for (const entry of props.entries) {
		const parts = entry.name.split("/");
		let fileArray: typeof files = files;
		for (const part of parts.slice(0, -1)) {
			if (part) {
				let existing = files.find((dir) => dir.name == part) as DirectoryProps;
				if (!existing) {
					existing = {
						name: part,
						isDirectory: true,
						openByDefault: true,
						isHighlighted: false,
						items: [],
					} satisfies DirectoryProps;
					fileArray.push(existing);
				}
				fileArray = existing.items;
			}
		}

		const name = parts.at(-1) ?? "";
		fileArray.push({
			name,
			isDirectory: false,
			filetype: entry.filetype,
			isPlaceholder: false,
			isHighlighted: entry.name == props.file,
			onClick() {
				props.onFileChange?.call(undefined, entry.name);
			},
		});
	}

	return files;
}

export function FilePicker(props: FilePickerProps) {
	const [open, setOpen] = useState(false);

	const handleFileChange = useCallback(
		(file: string) => {
			props.onFileChange?.call(undefined, file);
			setOpen(false);
		},
		[props.onFileChange],
	);

	const listItems = useMemo(() => {
		return buildFileItems({
			...props,
			onFileChange: handleFileChange,
		});
	}, [props.entries, props.file, handleFileChange]);

	const fileRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
	const handleOpenDialog = useCallback(() => {
		console.log(fileRef.current);
		const fileRect = fileRef.current!.getBoundingClientRect();
		setPosition({
			x: fileRect.left,
			y: fileRect.top,
			width: fileRect.width,
		});
		setOpen(true);
	}, []);

	return (
		<>
			<div ref={fileRef} />
			<File
				name={props.file}
				isDirectory={false}
				filetype={props.file.split(".").at(-1) ?? ""}
				isPlaceholder={false}
				isHighlighted={false}
				onClick={handleOpenDialog}
			/>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				dialogClass={style.dialog}
				style={{ top: position.y, left: position.x, width: position.width }}
			>
				<FileListList items={listItems} />
			</Dialog>
		</>
	);
}
