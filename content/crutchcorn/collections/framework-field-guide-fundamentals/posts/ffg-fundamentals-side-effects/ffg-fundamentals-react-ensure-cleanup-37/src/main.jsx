import { createRoot } from "react-dom/client";
import { StrictMode, Fragment, useEffect } from "react";

let i = 0;
const App = () => {
	useEffect(() => {
		alert(`I am rendering. ${strictModeStr}. Render counter: ${++i}`);
	}, []);

	// Don't focus on anything below this line.
	return (
		<div>
			<h1>{strictModeStr}</h1>
			<button onClick={toggleStrictMode}>
				{!ENABLE_STRICT_MODE ? "Enable" : "Disable"} strict mode
			</button>
		</div>
	);
};

// Intentional var to hoist the variable to the top of the file.
var ENABLE_STRICT_MODE = localStorage.getItem("ENABLE_STRICT_MODE") === "true";

function toggleStrictMode() {
	localStorage.setItem("ENABLE_STRICT_MODE", !ENABLE_STRICT_MODE);
	window.location.reload();
}

var strictModeStr = `Strict mode is ${
	ENABLE_STRICT_MODE ? "enabled" : "disabled"
}`;

// Don't worry about what Fragment is for now, we'll explore that in the next chapter
const Wrapper = ENABLE_STRICT_MODE ? StrictMode : Fragment;

createRoot(document.getElementById("root")).render(
	<Wrapper>
		<App />
	</Wrapper>,
);
