import { createRoot } from "react-dom/client";

const File = () => {
	return (
		<div>
			<a href="/file/file_one">
				File one<span>12/03/21</span>
			</a>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<File />);
