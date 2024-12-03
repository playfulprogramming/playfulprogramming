import { createRoot } from "react-dom/client";
import { useState, useRef, useEffect } from "react";

const TitleChanger = () => {
	const [title, setTitle] = useState("Movies");

	const timeoutExpire = useRef(null);

	function updateTitle(val) {
		timeoutExpire.current = setTimeout(() => {
			setTitle(val);
			document.title = val;
		}, 5000);
	}

	useEffect(() => {
		return () => clearTimeout(timeoutExpire.current);
	}, [timeoutExpire]);

	return (
		<div>
			<button onClick={() => updateTitle("Movies")}>Movies</button>
			<button onClick={() => updateTitle("Music")}>Music</button>
			<button onClick={() => updateTitle("Documents")}>Documents</button>
			<p>{title}</p>
		</div>
	);
};

const App = () => {
	const [show, setShow] = useState(true);

	return (
		<div>
			<button onClick={() => setShow(!show)}>Toggle title changer</button>
			{show && <TitleChanger />}
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
