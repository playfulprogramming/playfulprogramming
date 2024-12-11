import { createRoot } from "react-dom/client";

const FileDate = () => {
	const dateStr = `${
		new Date().getMonth() + 1
	}/${new Date().getDate()}/${new Date().getFullYear()}`;

	return <span>12/03/21</span>;
};

createRoot(document.getElementById("root")).render(<FileDate />);
