import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const FileDate = ({ inputDate }) => {
	const [dateStr, setDateStr] = useState(formatDate(inputDate));
	const [labelText, setLabelText] = useState(formatReadableDate(inputDate));

	useEffect(() => {
		setDateStr(formatDate(inputDate));
		setLabelText(formatReadableDate(inputDate));
		// Every time `inputDate` changes, it'll trigger a render and therefore call the `useEffect`
	}, [inputDate]);

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
		<button
			onClick={onSelected}
			style={
				isSelected
					? { backgroundColor: "blue", color: "white" }
					: { backgroundColor: "white", color: "blue" }
			}
		>
			{fileName}
			{isFolder ? <span>Type: Folder</span> : <span>Type: File</span>}
			{!isFolder && <FileDate inputDate={inputDate} />}
		</button>
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

const FileList = () => {
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const onSelected = (idx) => {
		if (selectedIndex === idx) {
			setSelectedIndex(-1);
			return;
		}
		setSelectedIndex(idx);
	};

	const [onlyShowFiles, setOnlyShowFiles] = useState(false);
	const toggleOnlyShow = () => setOnlyShowFiles(!onlyShowFiles);

	// This code sample is missing something and will throw a warning in development mode.
	// We'll explain more about this later.
	return (
		<div>
			<button onClick={toggleOnlyShow}>Only show files</button>
			<ul>
				{filesArray.map((file, i) => (
					<li key={file.id}>
						{(!onlyShowFiles || !file.isFolder) && (
							<File
								isSelected={selectedIndex === i}
								onSelected={() => onSelected(i)}
								fileName={file.fileName}
								href={file.href}
								isFolder={file.isFolder}
							/>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<FileList />);

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
