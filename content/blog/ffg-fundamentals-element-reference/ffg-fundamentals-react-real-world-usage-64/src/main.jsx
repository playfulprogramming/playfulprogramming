import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

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
			x: e.clientX,
			y: e.clientY,
		});
	}

	const [contextMenu, setContextMenu] = useState();

	useEffect(() => {
		if (contextMenu) {
			contextMenu.focus();
		}
	}, [contextMenu]);

	useEffect(() => {
		if (!contextMenu) return;
		const closeIfOutsideOfContext = (e) => {
			const isClickInside = contextMenu.contains(e.target);
			if (isClickInside) return;
			setIsOpen(false);
		};
		document.addEventListener("click", closeIfOutsideOfContext);
		return () => document.removeEventListener("click", closeIfOutsideOfContext);
	}, [contextMenu]);

	return (
		<>
			<div style={{ marginTop: "5rem", marginLeft: "5rem" }}>
				<div onContextMenu={onContextMenu}>Right click on me!</div>
			</div>
			{isOpen && (
				<div
					ref={(el) => setContextMenu(el)}
					tabIndex={0}
					style={{
						position: "fixed",
						top: mouseBounds.y,
						left: mouseBounds.x,
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
