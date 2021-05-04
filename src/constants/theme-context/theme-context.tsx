import * as React from "react";

import {
	COLORS,
	COLOR_MODE_KEY,
	INITIAL_COLOR_MODE_CSS_PROP,
} from "uu-constants";

type LightOptions = "light" | "dark";

interface ThemeContextType {
	colorMode: LightOptions | undefined;
	setColorMode: (val: LightOptions) => void;
}
export const ThemeContext = React.createContext<ThemeContextType>({
	colorMode: undefined,
	setColorMode: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
	const [colorMode, rawSetColorMode] = React.useState<LightOptions | undefined>(
		undefined
	);

	React.useEffect(() => {
		const root = window.document.documentElement;

		// Because colors matter so much for the initial page view, we're
		// doing a lot of the work in gatsby-ssr. That way it can happen before
		// the React component tree mounts.
		const initialColorValue = root.style.getPropertyValue(
			INITIAL_COLOR_MODE_CSS_PROP
		) as LightOptions;

		rawSetColorMode(initialColorValue);
	}, []);

	const contextValue = React.useMemo(() => {
		const setColorMode = (newValue: Exclude<LightOptions, undefined>) => {
			const root = window.document.documentElement;

			localStorage.setItem(COLOR_MODE_KEY, newValue);

			Object.entries(COLORS).forEach(([name, colorByTheme]) => {
				const cssVarName = `--${name}`;

				root.style.setProperty(cssVarName, colorByTheme[newValue]);
			});

			rawSetColorMode(newValue);
		};

		return {
			colorMode,
			setColorMode,
		};
	}, [colorMode, rawSetColorMode]);

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};
