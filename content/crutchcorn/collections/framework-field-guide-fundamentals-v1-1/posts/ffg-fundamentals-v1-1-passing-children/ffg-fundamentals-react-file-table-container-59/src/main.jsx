import { createRoot } from "react-dom/client";
import { useState, useEffect, useMemo, Fragment } from "react";

const FileDate = ({ inputDate }) => {
	const dateStr = useMemo(() => formatDate(inputDate), [inputDate]);
	const labelText = useMemo(() => formatReadableDate(inputDate), [inputDate]);

	return <span aria-label={labelText}>{dateStr}</span>;
};

const File = ({ href, fileName, isSelected, onSelected, isFolder }) => {
	const [inputDate, setInputDate] = useState(new Date());

	useEffect(() => {
		// Check if it's a new day every 10 minutes
		const timeout = setTimeout(
			() => {
				const newDate = new Date();
				if (inputDate.getDate() === newDate.getDate()) return;
				setInputDate(newDate);
			},
			10 * 60 * 1000,
		);

		return () => clearTimeout(timeout);
	}, [inputDate]);

	return (
		<tr
			onClick={onSelected}
			aria-selected={isSelected}
			style={
				isSelected
					? { backgroundColor: "blue", color: "white" }
					: { backgroundColor: "white", color: "blue" }
			}
		>
			<td>
				<a href={href} style={{ color: "inherit" }}>
					{fileName}
				</a>
			</td>
			<td>{isFolder ? "Type: Folder" : "Type: File"}</td>
			<td>{!isFolder && <FileDate inputDate={inputDate} />}</td>
		</tr>
	);
};

const filesArray = [
	{
		fileName: "File one",
		href: "/file/file_one",
		isFolder: false,
		id: 1,
	},
	{
		fileName: "File two",
		href: "/file/file_two",
		isFolder: false,
		id: 2,
	},
	{
		fileName: "File three",
		href: "/file/file_three",
		isFolder: false,
		id: 3,
	},
	{
		fileName: "Folder one",
		href: "/file/folder_one/",
		isFolder: true,
		id: 4,
	},
	{
		fileName: "Folder two",
		href: "/file/folder_two/",
		isFolder: true,
		id: 5,
	},
];

// This was previously called "FileList"
const FileTableBody = ({ onlyShowFiles }) => {
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const onSelected = (idx) => {
		if (selectedIndex === idx) {
			setSelectedIndex(-1);
			return;
		}
		setSelectedIndex(idx);
	};

	return (
		<tbody>
			{filesArray.map((file, i) => {
				return (
					<Fragment key={file.id}>
						{(!onlyShowFiles || !file.isFolder) && (
							<File
								fileName={file.fileName}
								href={file.href}
								isFolder={file.isFolder}
								isSelected={selectedIndex === i}
								onSelected={() => onSelected(i)}
							/>
						)}
					</Fragment>
				);
			})}
		</tbody>
	);
};

const FileTableContainer = ({ children }) => {
	return (
		<table
			style={{
				color: "#3366FF",
				border: "2px solid #3366FF",
				padding: "0.5rem",
				borderSpacing: 0,
			}}
		>
			{children}
		</table>
	);
};

const FileTable = () => {
	const [onlyShowFiles, setOnlyShowFiles] = useState(false);
	const toggleOnlyShow = () => setOnlyShowFiles(!onlyShowFiles);

	return (
		<div>
			<button onClick={toggleOnlyShow} style={{ marginBottom: "1rem" }}>
				Only show files
			</button>
			<FileTableContainer>
				<FileTableBody onlyShowFiles={onlyShowFiles} />
			</FileTableContainer>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<FileTable />);

function formatDate(inputDate) {
	// Month starts at 0, annoyingly
	const month = inputDate.getMonth() + 1;
	const date = inputDate.getDate();
	const year = inputDate.getFullYear();
	return month + "/" + date + "/" + year;
}

function formatReadableDate(inputDate) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthStr = months[inputDate.getMonth()];
	const dateSuffixStr = dateSuffix(inputDate.getDate());
	const yearNum = inputDate.getFullYear();
	return monthStr + " " + dateSuffixStr + "," + yearNum;
}

function dateSuffix(dayNumber) {
	const lastDigit = dayNumber % 10;
	if (lastDigit == 1 && dayNumber != 11) {
		return dayNumber + "st";
	}
	if (lastDigit == 2 && dayNumber != 12) {
		return dayNumber + "nd";
	}
	if (lastDigit == 3 && dayNumber != 13) {
		return dayNumber + "rd";
	}
	return dayNumber + "th";
}
