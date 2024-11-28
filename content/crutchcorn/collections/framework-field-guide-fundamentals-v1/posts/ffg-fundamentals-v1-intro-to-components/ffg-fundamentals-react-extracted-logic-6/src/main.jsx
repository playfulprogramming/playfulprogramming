import { createRoot } from "react-dom/client";

function formatDate() {
	const today = new Date();
	// Month starts at 0, annoyingly
	const monthNum = today.getMonth() + 1;
	const dateNum = today.getDate();
	const yearNum = today.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
}
const FileDate = () => {
	const dateStr = formatDate();
	return <span>12/03/21</span>;
};

createRoot(document.getElementById("root")).render(<FileDate />);
