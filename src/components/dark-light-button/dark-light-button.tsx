import * as React from "react";
import DarkIcon from "../../../src/assets/icons/dark.svg";
import LightIcon from "../../../src/assets/icons/light.svg";
import btnStyles from "./dark-light-button.module.scss";
import { ThemeContext } from "../../../src/constants";

export const DarkLightButton = () => {
	const { colorMode, setColorMode } = React.useContext(ThemeContext);

	if (!colorMode) {
		return null;
	}

	return (
		<button
			className={`${btnStyles.darkLightBtn} baseBtn`}
			onClick={() => {
				const newTheme = colorMode === "dark" ? "light" : "dark";
				setColorMode(newTheme);
			}}
			aria-pressed={colorMode === "light"}
			aria-label={"Dark mode"}
		>
			{colorMode === "dark" ? <DarkIcon /> : <LightIcon />}
		</button>
	);
};
