import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

const Tooltip = ({ text, children }) => {
	const [isVisible, setIsVisible] = useState(false);
	const targetRef = useRef();
	const tooltipRef = useRef();

	const showTooltip = () => {
		setIsVisible(true);
	};

	const hideTooltip = () => {
		setIsVisible(false);
	};

	useEffect(() => {
		const targetRect = targetRef.current.getBoundingClientRect();

		if (!tooltipRef.current) return;
		tooltipRef.current.style.left = `${targetRect.left}px`;
		tooltipRef.current.style.top = `${targetRect.bottom}px`;
	}, [isVisible]);

	return (
		<div>
			<div
				ref={targetRef}
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
			>
				{children}
			</div>
			{isVisible &&
				createPortal(
					<div ref={tooltipRef} className="tooltip">
						{text}
					</div>,
					document.body,
				)}
		</div>
	);
};

const App = () => {
	return (
		<div>
			<Tooltip text="This is a tooltip">
				<button>Hover me</button>
			</Tooltip>
			<style
				children={`
           .tooltip {
            position: absolute;
            background-color: #333;
            color: #fff;
            padding: 8px;
            border-radius: 4px;
            z-index: 1000;
          }
      `}
			/>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
