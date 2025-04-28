import { createRoot } from "react-dom/client";
import { useState, useCallback } from "react";
import "./main.module.css";

const tabList = [
	{
		id: "javascript-tab",
		label: "JavaScript",
		panelId: "javascript-panel",
		content: `console.log("Hello, world!");`,
	},
	{
		id: "python-tab",
		label: "Python",
		panelId: "python-panel",
		content: `print("Hello, world!")`,
	},
];

const App = () => {
	const [activeTabIndex, _setActiveTabIndex] = useState(0);

	const setActiveTabIndex = useCallback((indexFn) => {
		_setActiveTabIndex((v) => {
			const newIndex = normalizeCount(indexFn(v), tabList.length);
			const target = document.getElementById(tabList[newIndex].id);
			target.focus();
			return newIndex;
		});
	}, []);

	const onKeydown = useCallback(
		(event) => {
			let preventDefault = false;

			switch (event.key) {
				case "ArrowLeft":
					setActiveTabIndex((v) => v - 1);
					preventDefault = true;
					break;

				case "ArrowRight":
					setActiveTabIndex((v) => v + 1);
					preventDefault = true;
					break;

				case "Home":
					setActiveTabIndex((_) => 0);
					preventDefault = true;
					break;

				case "End":
					setActiveTabIndex((_) => tabList.length - 1);
					preventDefault = true;
					break;

				default:
					break;
			}

			if (preventDefault) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		[setActiveTabIndex],
	);

	return (
		<div>
			<ul role="tablist">
				{tabList.map((tab, index) => (
					<li
						key={tab.id}
						role="tab"
						id={tab.id}
						tabIndex={index === activeTabIndex ? 0 : -1}
						aria-selected={index === activeTabIndex}
						aria-controls={tab.panelId}
						onClick={() => setActiveTabIndex((_) => index)}
						onKeyDown={onKeydown}
					>
						{tab.label}
					</li>
				))}
			</ul>
			{tabList.map((tab, index) => (
				<div
					key={tab.panelId}
					role="tabpanel"
					id={tab.panelId}
					aria-labelledby={tab.id}
					style={{ display: index !== activeTabIndex ? "none" : "block" }}
				>
					<code>{tab.content}</code>
				</div>
			))}
		</div>
	);
};

function normalizeCount(index, max) {
	if (index < 0) {
		return max - 1;
	}

	if (index >= max) {
		return 0;
	}

	return index;
}

createRoot(document.getElementById("root")).render(<App />);
