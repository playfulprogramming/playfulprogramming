import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const useWindowSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		function onResize() {
			setHeight(window.innerHeight);
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", onResize);

		// Don't forget to clean up the listener
		return () => window.removeEventListener("resize", onResize);
	}, []);

	return { height, width };
};

const useMobileCheck = () => {
	const { width } = useWindowSize();

	if (width <= 480) return { isMobile: true };
	else return { isMobile: false };
};

const App = () => {
	const { isMobile } = useMobileCheck();

	return <p>Is this a mobile device? {isMobile ? "Yes" : "No"}</p>;
};

createRoot(document.getElementById("root")).render(<App />);
