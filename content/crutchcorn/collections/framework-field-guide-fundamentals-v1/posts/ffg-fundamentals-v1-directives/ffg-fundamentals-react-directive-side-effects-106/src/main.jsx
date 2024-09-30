import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

const useFocusElement = () => {
	const [el, setEl] = useState();

	useEffect(() => {
		if (!el) return;
		el.focus();
	}, [el]);

	const ref = (localEl) => {
		setEl(localEl);
	};
	return { ref };
};

const App = () => {
	const { ref } = useFocusElement();
	return <button ref={ref}>Hello, world</button>;
};

createRoot(document.getElementById("root")).render(<App />);
