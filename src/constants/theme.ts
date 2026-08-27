export const COLOR_MODE_STORAGE_KEY = "currentTheme";
export const CONTRAST_MODE_STORAGE_KEY = "contrastMode";
export const BRAND_THEME_STORAGE_KEY = "brandTheme";

export const THEME_COLOR_LIGHT = "#e5f2ff";
export const THEME_COLOR_DARK = "#001e2e";

export const COLOR_SCHEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const THEME_FONT = {
	Figtree: "figtree",
	OpenDyslexic: "open-dyslexic",
	PlaypenSans: "playpen-sans",
	PlusJakartaSans: "plus-jakarta-sans",
	RobotoMono: "roboto-mono",
	System: "system-ui",
} as const;

export type ThemeFont = (typeof THEME_FONT)[keyof typeof THEME_FONT];

export const THEME_FONT_FAMILIES = {
	[THEME_FONT.Figtree]: '"Figtree", "Arial", "Roboto", sans-serif',
	[THEME_FONT.OpenDyslexic]: '"OpenDyslexic", "Arial", sans-serif',
	[THEME_FONT.PlaypenSans]: '"Playpen Sans", "Arial", sans-serif',
	[THEME_FONT.PlusJakartaSans]: '"Plus Jakarta Sans", "Arial", sans-serif',
	[THEME_FONT.RobotoMono]: '"Roboto Mono", monospace',
	[THEME_FONT.System]:
		'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const satisfies Record<ThemeFont, string>;

export const BRAND_THEME_PROPERTIES = [
	"--hue-primary",
	"--hue-secondary",
	"--hue-positive",
	"--hue-error",
	"--pfp-font-family-brand",
	"--pfp-font-family-body",
] as const;
