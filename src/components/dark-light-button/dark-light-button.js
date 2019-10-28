import React, { useContext } from "react";
import DarkIcon from "../../assets/icons/dark.svg";
import LightIcon from "../../assets/icons/light.svg";
import btnStyles from "./dark-light-button.module.scss";
import { ThemeContext } from "../theme-context";

export const DarkLightButton = () => {
	const { currentTheme, setTheme } = useContext(ThemeContext);

	return (
		<button
			className={`${btnStyles.darkLightBtn} baseBtn`}
			onClick={() => {
				const newTheme = currentTheme === "dark" ? "light" : "dark";
				setTheme(newTheme);
			}}
			aria-pressed={currentTheme === "light"}
			aria-label={"Dark mode"}
		>
			{currentTheme === "dark" ? <DarkIcon /> : <LightIcon />}
		</button>
	);
};
