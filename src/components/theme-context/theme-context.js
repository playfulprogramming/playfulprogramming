import { createContext } from "react";

//css variable names might need to be changed a bit
export const darkTheme = {
	//main styles
	"--darkPrimary": "#E4F4FF",
	"--black": "white", //🎵 we're gonna party like it's nine-teen eighty-fourrrrrrr 🎵
	"--white": "black", // 2 + 2 = 5
	"--darkGrey": "rgba(255, 255, 255, .64)",
	"--highImpactBlack": "rgba(255, 255, 255, .87)",
	"--midImpactBlack": "rgba(255, 255, 255, .64)",
	"--lowImpactBlack": "rgba(255, 255, 255, .58)",
	"--backgroundColor": "#072a41", //from tommy's mockup
	"--cardActiveBackground": "#163954", //from tommy's mockup
	"--cardActiveBoxShadow":
		"0px 2px 4px rgba(0, 0, 0, 0.27), inset 0px 1px 0px #435e75", //close to tommy's mockup but outset color is slightly different
	"--codeBlockBackground": "#202746",
	//code styles
	"--codeBackgroundColor": "#161b1d",
	"--textColor": "#7ea2b4",
	"--stringColor": "#2d8f6f",
	"--keywordColor": "#568c3b",
	"--operatorColor": "#935c25",
	"--punctuationColor": "#7ea2b4", //this might change
	"--constantColor": "#aa05d4", //keeping this the same
	"--functionColor": "#5357d2", //keeping this the same
	"--selectionColor": "#7195a8",
	"--commentColor": "#5a7b8c",
	"--propColor": "#8a8a0f",
	"--varColor": "#257fad",
	"--selectorColor": "#6b6bb8",
	"--urlColor": "#2d8f6f",
	"--insertedUnderlineColor": "#ebf8ff",
	"--highlightColor": "#d22d72",
	"--lineNumbersColor": "#516d7b",
	"--lineHighlightColor": "rgba(235, 248, 255, 0.2)",
	"--lineHighlightFadeColor": "rgba(235, 248, 255, 0)"
};

export const lightTheme = {
	//main styles
	"--darkPrimary": "#153E67",
	"--primary": "#127DB3",
	"--black": "black",
	"--white": "white",
	"--darkGrey": "rgba(0, 0, 0, 0.64)",
	"--highImpactBlack": "rgba(0, 0, 0, 0.87)",
	"--midImpactBlack": "rgba(0, 0, 0, 0.64)",
	"--lowImpactBlack": "rgba(0, 0, 0, 0.58)",
	"--backgroundColor": "#E4F4FF",
	"--cardActiveBackground": "#EBF6FC",
	"--cardActiveBoxShadow":
		"0px 2px 4px rgba(11, 37, 104, 0.27), inset 0px 1px 0px #FFFFFF",
	"--codeBlockBackground": "white",
	//code styles
	"--codeBackgroundColor": "#fff",
	"--textColor": "#5e6687",
	"--stringColor": "#007396",
	"--keywordColor": "#846c00",
	"--operatorColor": "#b74c00",
	"--punctuationColor": "#006fce",
	"--constantColor": "#aa05d4",
	"--functionColor": "#5357d2",
	"--selectionColor": "#dfe2f1",
	"--commentColor": "#898ea4",
	"--propColor": "#c08b30",
	"--varColor": "#3d8fd1",
	"--selectorColor": "#6679cc",
	"--urlColor": "#22a9c9",
	"--insertedUnderlineColor": "#202746",
	"--highlightColor": "#c94922",
	"--lineNumbersColor": "#979db4",
	"--lineHighlightColor": "rgba(107, 115, 148, 0.2)",
	"--lineHighlightFadeColor": "rgba(107, 115, 148, 0)"
};

export function setThemeColorsToVars(themeName) {
	const themeObj = themeName === "dark" ? darkTheme : lightTheme;
	const style = document.documentElement.style;
	const themeColor = document.querySelector("meta[name='theme-color']");
	// For test environments, etc
	if (!themeColor) return;
	themeColor.setAttribute("content", themeObj["--backgroundColor"]);

	Object.entries(themeObj).forEach(([themeKey, themeVal]) => {
		style.setProperty(themeKey, themeVal);
	});
}

// We only have dark and light right now
export const defaultThemeContextVal = {
	currentTheme: "light",
	setTheme: val => {}
};

export const ThemeContext = createContext(defaultThemeContextVal);
