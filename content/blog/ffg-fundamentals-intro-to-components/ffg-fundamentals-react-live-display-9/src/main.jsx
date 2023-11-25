import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function formatDate(inputDate) {
	// Month starts at 0, annoyingly
	const month = inputDate.getMonth() + 1;
	const date = inputDate.getDate();
	const year = inputDate.getFullYear();
	return month + "/" + date + "/" + year;
}

const FileDate = () => {
	const [dateStr, setDateStr] = useState(formatDate(new Date()));

	useEffect(() => {
		setTimeout(() => {
			// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			const tomorrowDate = formatDate(tomorrow);
			setDateStr(tomorrowDate);
		}, 5000);
	}, []);

	return <span>{dateStr}</span>;
};

createRoot(document.getElementById("root")).render(<FileDate />);
