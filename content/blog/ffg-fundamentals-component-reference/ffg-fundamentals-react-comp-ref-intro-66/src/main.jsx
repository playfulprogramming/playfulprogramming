import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const ContextMenu = ({ isOpen, x, y, onClose }) => {
	const [contextMenu, setContextMenu] = useState();

	useEffect(() => {
		if (!contextMenu) return;
		const closeIfOutsideOfContext = (e) => {
			const isClickInside = contextMenu.contains(e.target);
			if (isClickInside) return;
			onClose(false);
		};
		document.addEventListener("click", closeIfOutsideOfContext);
		return () => document.removeEventListener("click", closeIfOutsideOfContext);
	}, [contextMenu]);

	if (!isOpen) return null;

	return (
		<div
			ref={(el) => setContextMenu(el)}
			tabIndex={0}
			style={{
				position: "fixed",
				top: y,
				left: x,
				background: "white",
				border: "1px solid black",
				borderRadius: 16,
				padding: "1rem",
			}}
		>
			<button onClick={() => onClose()}>X</button>
			This is a context menu
		</div>
	);
};

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

	return (
		<>
			<div style={{ marginTop: "5rem", marginLeft: "5rem" }}>
				<div onContextMenu={onContextMenu}>Right click on me!</div>
			</div>
			<ContextMenu
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				x={mouseBounds.x}
				y={mouseBounds.y}
			/>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
