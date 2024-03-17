import { createRoot } from "react-dom/client";

const RenderButton = () => {
	// el is HTMLElement
	const addClickListener = (el) => {
		el.addEventListener("click", () => {
			alert("User has clicked!");
		});
	};

	return <button ref={addClickListener}>Click me!</button>;
};

createRoot(document.getElementById("root")).render(<RenderButton />);
