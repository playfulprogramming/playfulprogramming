import { createRoot } from "react-dom/client";
import { useEffect } from "react";

function formatDate() {
	const today = new Date();
	// Month starts at 0, annoyingly
	const month = today.getMonth() + 1;
	const date = today.getDate();
	const year = today.getFullYear();
	return month + "/" + date + "/" + year;
}
const FileDate = () => {
	const dateStr = formatDate();
	useEffect(() => {
		console.log(dateStr);
	}, []);

	return <span>12/03/21</span>;
};

createRoot(document.getElementById("root")).render(<FileDate />);
