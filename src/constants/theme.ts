export const COLORS = {
	//main styles
	darkPrimary: { light: "#153E67", dark: "#E4F4FF" },
	primary: { light: "#127DB3", dark: "#127DB3" },
	black: { light: "black", dark: "white" },
	white: { light: "white", dark: "black" },
	darkGrey: { light: "rgba(0, 0, 0, 0.64)", dark: "rgba(255, 255, 255, .64)" },
	highImpactBlack: {
		light: "rgba(0, 0, 0, 0.87)",
		dark: "rgba(255, 255, 255, .87)",
	},
	midImpactBlack: {
		light: "rgba(0, 0, 0, 0.64)",
		dark: "rgba(255, 255, 255, .64)",
	},
	lowImpactBlack: {
		light: "rgba(0, 0, 0, 0.58)",
		dark: "rgba(255, 255, 255, .58)",
	},
	backgroundColor: { light: "#E4F4FF", dark: "#072a41" },
	cardActiveBackground: { light: "#EBF6FC", dark: "#163954" },
	cardActiveBoxShadow: {
		light: "0px 2px 4px rgba(11, 37, 104, 0.27), inset 0px 1px 0px #FFFFFF",
		dark: "0px 2px 4px rgba(0, 0, 0, 0.27), inset 0px 1px 0px #435e75",
	},
	codeBlockBackground: { light: "white", dark: "#202746" },
	//code styles
	codeBackgroundColor: { light: "#fff", dark: "#161b1d" },
	textColor: { light: "#5e6687", dark: "#7ea2b4" },
	stringColor: { light: "#007396", dark: "#2d8f6f" },
	keywordColor: { light: "#846c00", dark: "#568c3b" },
	operatorColor: { light: "#b74c00", dark: "#935c25" },
	punctuationColor: { light: "#006fce", dark: "#7ea2b4" },
	constantColor: { light: "#aa05d4", dark: "#aa05d4" },
	functionColor: { light: "#5357d2", dark: "#5357d2" },
	selectionColor: { light: "#dfe2f1", dark: "#7195a8" },
	commentColor: { light: "#898ea4", dark: "#5a7b8c" },
	propColor: { light: "#c08b30", dark: "#8a8a0f" },
	varColor: { light: "#3d8fd1", dark: "#257fad" },
	selectorColor: { light: "#6679cc", dark: "#6b6bb8" },
	urlColor: { light: "#22a9c9", dark: "#2d8f6f" },
	insertedUnderlineColor: { light: "#202746", dark: "#ebf8ff" },
	highlightColor: { light: "#c94922", dark: "#d22d72" },
	lineNumbersColor: { light: "#979db4", dark: "#516d7b" },
	lineHighlightColor: {
		light: "rgba(107, 115, 148, 0.2)",
		dark: "rgba(235, 248, 255, 0.2)",
	},
	lineHighlightFadeColor: {
		light: "rgba(107, 115, 148, 0)",
		dark: "rgba(235, 248, 255, 0)",
	},
	scrollBarBG: {
		light: "rgba(18, 125, 179, 0.3)",
		dark: "rgba(228, 244, 255, 0.3)",
	},
	scrollBarThumb: { light: "var(--primary)", dark: "var(--darkPrimary)" },
};

export const COLOR_MODE_KEY = "currentTheme";
export const INITIAL_COLOR_MODE_CSS_PROP = "--initial-color-mode";
