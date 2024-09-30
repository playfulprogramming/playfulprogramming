import { createRoot } from "react-dom/client";
import {
	forwardRef,
	useState,
	useImperativeHandle,
	useEffect,
	useRef,
} from "react";

const ContextMenu = forwardRef(({ isOpen, x, y, onClose }, ref) => {
	const [contextMenu, setContextMenu] = useState();

	useImperativeHandle(ref, () => ({
		focus: () => contextMenu && contextMenu.focus(),
	}));

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
});

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

	const contextMenuRef = useRef();

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				if (contextMenuRef.current) return;
				contextMenuRef.current.focus();
			}, 0);
		}
	}, [isOpen, mouseBounds]);

	return (
		<>
			<div style={{ marginTop: "5rem", marginLeft: "5rem" }}>
				<div onContextMenu={onContextMenu}>Right click on me!</div>
			</div>
			<ContextMenu
				ref={contextMenuRef}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				x={mouseBounds.x}
				y={mouseBounds.y}
			/>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
