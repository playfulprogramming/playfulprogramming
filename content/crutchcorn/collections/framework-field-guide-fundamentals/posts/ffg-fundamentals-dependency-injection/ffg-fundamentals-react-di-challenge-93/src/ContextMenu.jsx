// ContextMenu.jsx
import {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useState,
	useMemo,
} from "react";
import { ContextMenuContext } from "./ContextMenuContext";

export const ContextMenu = forwardRef(
	({ isOpen, x, y, onClose, data }, ref) => {
		const context = useContext(ContextMenuContext);

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
			return () =>
				document.removeEventListener("click", closeIfOutsideOfContext);
		}, [contextMenu, onClose]);

		useEffect(() => {
			const closeIfContextMenu = () => {
				if (!isOpen) return;
				onClose(false);
			};
			// Inside a timeout to make sure the initial context menu does not close the menu
			setTimeout(() => {
				document.addEventListener("contextmenu", closeIfContextMenu);
			}, 0);
			return () => {
				document.removeEventListener("contextmenu", closeIfContextMenu);
			};
		}, [isOpen, onClose]);

		const actions = useMemo(() => {
			if (!context) return [];
			return context.actions;
		}, [context]);

		if (!isOpen || !context) {
			return null;
		}

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
				<ul>
					{actions.map((action) => (
						<li key={action.label}>
							<button
								onClick={() => {
									action.fn(data);
									onClose(false);
								}}
							>
								{action.label}
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	},
);
