import {
	DirectoryProps,
	FileProps,
	File,
	FileListList,
} from "components/file-list/file-list";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { FileEntry } from "./types";
import { Dialog } from "components/dialog/dialog";
import style from "./file-picker.module.scss";
import { IconOnlyButton } from "components/button/button";
import CloseIcon from "src/icons/close.svg?raw";
import { RawSvg } from "components/image/raw-svg";

interface FilePickerProps {
	entries: Array<FileEntry>;
	file: string;
	onFileChange?(file: string): void;
}

function sortFileItems(files: Array<DirectoryProps | FileProps>) {
	files.sort((a, b) => {
		if (a.isDirectory != b.isDirectory)
			return Number(b.isDirectory) - Number(a.isDirectory);
		else return a.name.localeCompare(b.name);
	});

	for (const file of files) {
		if (file.isDirectory) {
			sortFileItems(file.items);
		}
	}
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
				let existing = fileArray.find(
					(dir) => dir.name == part,
				) as DirectoryProps;
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
		const isSelected = entry.name == props.file;
		fileArray.push({
			name,
			isDirectory: false,
			filetype: entry.filetype,
			isPlaceholder: false,
			isHighlighted: isSelected,
			autofocus: isSelected,
			onClick() {
				props.onFileChange?.call(undefined, entry.name);
			},
		});
	}

	sortFileItems(files);
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
	const [position, setPosition] = useState({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
	});
	function handleResize() {
		const fileRect = fileRef.current?.parentElement?.getBoundingClientRect();
		if (!fileRect) return;
		const height = Math.min(400, window.innerHeight * 0.5);
		setPosition({
			left: Math.max(
				0,
				Math.min(fileRect.left, window.innerWidth - fileRect.width),
			),
			top: Math.max(0, Math.min(fileRect.top, window.innerHeight - height)),
			width: fileRect.width,
			height,
		});
	}

	const handleOpenDialog = useCallback(() => {
		handleResize();
		setOpen(true);
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	});

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
				style={Object.fromEntries(
					Object.entries(position).map(([key, value]) => [
						`--file-picker-${key}`,
						`${Math.round(value)}px`,
					]),
				)}
			>
				<div class={style.header}>
					<h1 class={`${style.title} text-style-headline-5`}>Files</h1>
					<IconOnlyButton
						tag="button"
						class={style.closeButton}
						aria-label="Close"
					>
						<RawSvg icon={CloseIcon} />
					</IconOnlyButton>
				</div>
				<FileListList items={listItems} />
			</Dialog>
		</>
	);
}
