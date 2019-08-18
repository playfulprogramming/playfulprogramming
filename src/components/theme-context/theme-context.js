import {createContext} from 'react';


//css variable names might need to be changed a bit
export const darkTheme = {
    "--darkPrimary":  "#E4F4FF",
    "--black": "white", //🎵 we're gonna party like it's nine-teen eighty-fourrrrrrr 🎵
    "--white": "black", // 2 + 2 = 5
    "--darkGrey": "rgba(255, 255, 255, .64)",
    "--highImpactBlack": "rgba(255, 255, 255, .87)",
    "--midImpactBlack": "rgba(255, 255, 255, .64)",
    "--lowImpactBlack": "rgba(255, 255, 255, .58)",
    "--backgroundColor": "#072a41", //from tommy's mockup
    "--cardActiveBackground": "#163954", //from tommy's mockup
    "--cardActiveBoxShadow": "0px 2px 4px rgba(0, 0, 0, 0.27), inset 0px 1px 0px #435e75", //close to tommy's mockup but outset color is slightly different
    "--codeBlockBackground": "#202746",
};

export const lightTheme = {
  '--darkPrimary': '#153E67',
  '--primary': '#127DB3',
  '--black': 'black',
  '--white': 'white',
  '--darkGrey': 'rgba(0, 0, 0, 0.64)',
  '--highImpactBlack': 'rgba(0, 0, 0, 0.87)',
  '--midImpactBlack': 'rgba(0, 0, 0, 0.64)',
  '--lowImpactBlack': 'rgba(0, 0, 0, 0.58)',
  '--backgroundColor': '#E4F4FF',
  '--cardActiveBackground': '#EBF6FC',
  '--cardActiveBoxShadow': '0px 2px 4px rgba(11, 37, 104, 0.27), inset 0px 1px 0px #FFFFFF',
  "--codeBlockBackground": "white",
}

export function setThemeColorsToVars(themeName) {
  const themeObj = themeName === 'dark' ? darkTheme : lightTheme;
  const style = document.documentElement.style;
  Object.entries(themeObj).forEach(([themeKey, themeVal]) => {
    style.setProperty(themeKey, themeVal);
  })
}

// We only have dark and light right now
export const defaultThemeContextVal = {
    currentTheme: 'light',
    setTheme: (val) => {}
}

export const ThemeContext = createContext(defaultThemeContextVal);
