import { createRoot } from "react-dom/client";
import { useState } from "react";

/**
 * This code sample is inaccessible and generally not
 * production-grade. It's missing:
 * - Focus on menu open
 * - Closing upon external click
 *
 * Read on to learn how to add these
 */
function App() {
	const [mouseBounds, setMouseBounds] = useState({
		x: 0,
		y: 0,
	});

	const [isOpen, setIsOpen] = useState(false);

	function onContextMenu(e) {
		e.preventDefault();
		setIsOpen(true);
		setMouseBounds({
			// Mouse position on click
			x: e.clientX,
			y: e.clientY,
		});
	}

	return (
		<>
			<div style={{ marginTop: "5rem", marginLeft: "5rem" }}>
				<div onContextMenu={onContextMenu}>Right click on me!</div>
			</div>
			{isOpen && (
				<div
					style={{
						position: "fixed",
						top: `${mouseBounds.y}px`,
						left: `${mouseBounds.x}px`,
						background: "white",
						border: "1px solid black",
						borderRadius: 16,
						padding: "1rem",
					}}
				>
					<button onClick={() => setIsOpen(false)}>X</button>
					This is a context menu
				</div>
			)}
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
