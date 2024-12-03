import { createRoot } from "react-dom/client";
import {
	useState,
	useEffect,
	forwardRef,
	useRef,
	useImperativeHandle,
	useCallback,
} from "react";

const useOutsideClick = ({ ref, onClose }) => {
	useEffect(() => {
		const closeIfOutsideOfContext = (e) => {
			const isClickInside = ref.current.contains(e.target);
			if (isClickInside) return;
			onClose();
		};
		document.addEventListener("click", closeIfOutsideOfContext);
		return () => document.removeEventListener("click", closeIfOutsideOfContext);
	}, [onClose]);
};

const ContextMenu = forwardRef(({ x, y, onClose }, ref) => {
	const divRef = useRef();

	useImperativeHandle(ref, () => ({
		focus: () => divRef.current && divRef.current.focus(),
	}));

	useOutsideClick({ ref: divRef, onClose });

	return (
		<div
			tabIndex={0}
			ref={divRef}
			style={{
				position: "fixed",
				top: y + 20,
				left: x + 20,
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

const useBounds = () => {
	const [bounds, setBounds] = useState({
		height: 0,
		width: 0,
		x: 0,
		y: 0,
	});

	const [el, setEl] = useState(null);

	const ref = useCallback((el) => {
		setEl(el);
	}, []);

	useEffect(() => {
		const resizeListener = () => {
			if (!el) return;
			const localBounds = el.getBoundingClientRect();
			setBounds(localBounds);
		};
		resizeListener();
		window.addEventListener("resize", resizeListener);
		window.removeEventListener("resize", resizeListener);
	}, [el]);

	return { ref, bounds };
};

function App() {
	const { ref, bounds } = useBounds();

	// An addEventListener is easier to tackle when inside of the conditional render
	// Add that as an exploration for `useImperativeHandle`
	const [isOpen, setIsOpen] = useState(false);

	function onContextMenu(e) {
		e.preventDefault();
		setIsOpen(true);
	}

	const contextMenuRef = useRef();

	useEffect(() => {
		if (isOpen && contextMenuRef.current) {
			contextMenuRef.current.focus();
		}
	}, [isOpen]);

	return (
		<>
			<div style={{ marginTop: "5rem", marginLeft: "5rem" }}>
				<div ref={ref} onContextMenu={onContextMenu}>
					Right click on me!
				</div>
			</div>
			{isOpen && (
				<ContextMenu
					x={bounds.x}
					y={bounds.y}
					ref={contextMenuRef}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
