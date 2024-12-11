import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

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

const FileDate = () => {
	const [dateStr, setDateStr] = useState(formatDate(new Date()));
	const [labelText, setLabelText] = useState(formatReadableDate(new Date()));

	useEffect(() => {
		setTimeout(() => {
			// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			const tomorrowDate = formatDate(tomorrow);
			setDateStr(tomorrowDate);
			setLabelText(tomorrowDate);
		}, 5000);
	}, []);

	return <span aria-label={labelText}>{dateStr}</span>;
};

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

createRoot(document.getElementById("root")).render(<FileDate />);
