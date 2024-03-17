import { createRoot } from "react-dom/client";
import { cache, useState } from "react";
import { generateComplimentaryColors, getReadableColor } from "./colors.js";
import "./style.css";

const getTheme = cache((primaryColor) => {
	// Theoretically, this could get very expensive to compute
	// Depending on how many colors and how accurately
	const [secondaryColor, tertiaryColor] =
		generateComplimentaryColors(primaryColor);
	return {
		primaryColor,
		secondaryColor,
		tertiaryColor,
		primaryTextColor: getReadableColor(primaryColor),
		secondaryTextColor: getReadableColor(secondaryColor),
		tertiaryTextColor: getReadableColor(tertiaryColor),
	};
});

const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

function ThemePreviewRow({ type, themeColor }) {
	// The calculations to get the theme only occur once, even though this is
	// called in multiple component instances.
	const theme = getTheme(themeColor);
	return (
		<tr>
			<th>{capitalize(type)}</th>
			<td>
				<div
					className="colorBox"
					style={{
						backgroundColor: theme[type + "Color"],
						color: theme[type + "TextColor"],
					}}
				>
					Some Text
				</div>
			</td>
		</tr>
	);
}

function App() {
	const [themeColor, setThemeColor] = useState("#7e38ff");
	const [tempColor, setTempColor] = useState(themeColor);

	return (
		<div>
			<div className="spaceBottom">
				<div className="spaceBottom">
					<label>
						<div className="spaceBottom">Primary color</div>
						<input
							type="color"
							id="body"
							name="body"
							value={tempColor}
							onChange={(e) => setTempColor(e.target.value)}
						/>
					</label>
				</div>
				<div>
					<button onClick={() => setThemeColor(tempColor)}>Set theme</button>
				</div>
			</div>
			<div>
				<table>
					<tbody>
						<ThemePreviewRow type="primary" themeColor={themeColor} />
						<ThemePreviewRow type="secondary" themeColor={themeColor} />
						<ThemePreviewRow type="tertiary" themeColor={themeColor} />
					</tbody>
				</table>
			</div>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
