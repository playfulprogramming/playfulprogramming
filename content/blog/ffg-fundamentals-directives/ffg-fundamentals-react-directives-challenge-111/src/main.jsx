import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

const useTooltip = ({ tooltipContents, innerContents }) => {
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
		if (!isVisible || !tooltipRef.current || !targetRef.current) return;
		const targetRect = targetRef.current.getBoundingClientRect();

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
				{innerContents}
			</div>
			{isVisible &&
				createPortal(
					<div ref={tooltipRef} className="tooltip">
						{tooltipContents}
					</div>,
					document.body,
				)}
		</div>
	);
};

const App = () => {
	const tooltip = useTooltip({
		innerContents: <button>Hover me</button>,
		tooltipContents: "This is a tooltip",
	});

	return (
		<div>
			{tooltip}
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
