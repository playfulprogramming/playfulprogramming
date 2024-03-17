import { createRoot } from "react-dom/client";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

function App() {
	const buttonRef = useRef();

	const mouseOverTimeout = useRef();

	const [tooltipMeta, setTooltipMeta] = useState({
		x: 0,
		y: 0,
		height: 0,
		width: 0,
		show: false,
	});

	const onMouseOver = () => {
		mouseOverTimeout.current = setTimeout(() => {
			const bounding = buttonRef.current.getBoundingClientRect();
			setTooltipMeta({
				x: bounding.x,
				y: bounding.y,
				height: bounding.height,
				width: bounding.width,
				show: true,
			});
		}, 1000);
	};

	const onMouseLeave = () => {
		setTooltipMeta({
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			show: false,
		});
		clearTimeout(mouseOverTimeout.current);
	};

	useEffect(() => {
		return () => {
			clearTimeout(mouseOverTimeout.current);
		};
	}, []);

	return (
		<div>
			<div
				style={{
					height: 100,
					width: "100%",
					background: "lightgrey",
					position: "relative",
					zIndex: 2,
				}}
			/>
			<div style={{ paddingLeft: "10rem", paddingTop: "2rem" }}>
				{tooltipMeta.show &&
					createPortal(
						<div
							style={{
								zIndex: 9,
								display: "flex",
								overflow: "visible",
								justifyContent: "center",
								width: `${tooltipMeta.width}px`,
								position: "fixed",
								top: `${tooltipMeta.y - tooltipMeta.height - 16 - 6 - 8}px`,
								left: `${tooltipMeta.x}px`,
							}}
						>
							<div
								style={{
									whiteSpace: "nowrap",
									padding: "8px",
									background: "#40627b",
									color: "white",
									borderRadius: "16px",
								}}
							>
								This will send an email to the recipients
							</div>
							<div
								style={{
									height: "12px",
									width: "12px",
									transform: "rotate(45deg) translateX(-50%)",
									background: "#40627b",
									bottom: "calc(-6px - 4px)",
									position: "absolute",
									left: "50%",
									zIndex: -1,
								}}
							/>
						</div>,
						document.body,
					)}
				<button
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					ref={buttonRef}
				>
					Send
				</button>
			</div>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
