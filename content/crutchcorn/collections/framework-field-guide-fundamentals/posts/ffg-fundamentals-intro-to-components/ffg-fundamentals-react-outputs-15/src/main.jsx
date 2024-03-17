import { createRoot } from "react-dom/client";
import { useState } from "react";

const FileDate = ({ inputDate }) => {
	const [dateStr, setDateStr] = useState(formatDate(inputDate));
	const [labelText, setLabelText] = useState(formatReadableDate(inputDate));

	return <span aria-label={labelText}>{dateStr}</span>;
};

const File = ({ href, fileName, isSelected, onSelected }) => {
	// `href` is temporarily unused
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
			<FileDate inputDate={new Date()} />
		</button>
	);
};

const FileList = () => {
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const onSelected = (idx) => {
		if (selectedIndex === idx) {
			setSelectedIndex(-1);
			return;
		}
		setSelectedIndex(idx);
	};

	return (
		<ul>
			<li>
				<File
					isSelected={selectedIndex === 0}
					onSelected={() => onSelected(0)}
					fileName="File one"
					href="/file/file_one"
				/>
			</li>
			<li>
				<File
					isSelected={selectedIndex === 1}
					onSelected={() => onSelected(1)}
					fileName="File two"
					href="/file/file_two"
				/>
			</li>
			<li>
				<File
					isSelected={selectedIndex === 2}
					onSelected={() => onSelected(2)}
					fileName="File three"
					href="/file/file_three"
				/>
			</li>
		</ul>
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
