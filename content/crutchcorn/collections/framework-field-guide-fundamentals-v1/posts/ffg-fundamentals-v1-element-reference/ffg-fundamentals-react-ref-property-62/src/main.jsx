import { createRoot } from "react-dom/client";

const RenderParagraph = () => {
	// el is HTMLElement
	return <p ref={(el) => console.log({ el: el })}>Check your console</p>;
};

createRoot(document.getElementById("root")).render(<RenderParagraph />);
