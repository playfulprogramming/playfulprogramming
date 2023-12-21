import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const isOSDark = window.matchMedia("(prefers-color-scheme: dark)");

function DarkModeToggle() {
	const [explicitTheme, setExplicitTheme] = useState(
		localStorage.getItem("theme") || "inherit",
	);

	const [osTheme, setOSTheme] = useState(isOSDark.matches ? "dark" : "light");

	useEffect(() => {
		localStorage.setItem("theme", explicitTheme);
	}, [explicitTheme]);

	useEffect(() => {
		if (explicitTheme === "implicit") {
			document.documentElement.className = osTheme;
			return;
		}
		document.documentElement.className = explicitTheme;
	}, [explicitTheme, osTheme]);

	useEffect(() => {
		const changeOSTheme = () => {
			setOSTheme(isOSDark.matches ? "dark" : "light");
		};
		isOSDark.addEventListener("change", changeOSTheme);
		return () => {
			isOSDark.removeEventListener("change", changeOSTheme);
		};
	}, []);

	return (
		<div style={{ display: "flex", gap: "1rem" }}>
			<label style={{ display: "inline-flex", flexDirection: "column" }}>
				<div>Light</div>
				<input
					name="theme"
					type="radio"
					checked={explicitTheme === "light"}
					onChange={() => setExplicitTheme("light")}
				/>
			</label>
			<label style={{ display: "inline-flex", flexDirection: "column" }}>
				<div>Inherit</div>
				<input
					name="theme"
					type="radio"
					checked={explicitTheme === "inherit"}
					onChange={() => setExplicitTheme("inherit")}
				/>
			</label>
			<label style={{ display: "inline-flex", flexDirection: "column" }}>
				<div>Dark</div>
				<input
					name="theme"
					type="radio"
					checked={explicitTheme === "dark"}
					onChange={() => setExplicitTheme("dark")}
				/>
			</label>
		</div>
	);
}

function App() {
	return (
		<div>
			<DarkModeToggle />
			<p style={{ color: "var(--primary)" }}>This text is blue</p>
			<style
				children={`
        :root {
          --primary: #1A42E5;
        }
        
        .dark {
          background: #121926;
          color: #D6E4FF;
          --primary: #6694FF;
        }
      `}
			/>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
