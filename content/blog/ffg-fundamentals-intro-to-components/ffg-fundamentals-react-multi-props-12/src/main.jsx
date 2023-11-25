import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const FileDate = () => {
	const [dateStr, setDateStr] = useState(formatDate(new Date()));
	const [labelText, setLabelText] = useState(formatReadableDate(new Date()));

	return <span aria-label={labelText}>{dateStr}</span>;
};

const File = ({ fileName, href }) => {
	return (
		<div>
			<a href={href}>
				{fileName}
				<FileDate />
			</a>
		</div>
	);
};

const FileList = () => {
	return (
		<ul>
			<li>
				<File fileName="File one" href="/file/file_one" />
			</li>
			<li>
				<File fileName="File two" href="/file/file_two" />
			</li>
			<li>
				<File fileName="File three" href="/file/file_three" />
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
