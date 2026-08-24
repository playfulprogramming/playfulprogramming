import {
	BRAND_THEME_STORAGE_KEY,
	COLOR_MODE_STORAGE_KEY,
	THEME_COLOR_DARK,
	THEME_COLOR_LIGHT,
} from "../constants/theme.ts";

export type ColorModePreference = "light" | "dark" | "system";
export type ResolvedColorMode = Exclude<ColorModePreference, "system">;

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

export const ALLOWED_THEME_FONTS = Object.values(THEME_FONT) as ThemeFont[];

export const BRAND_THEME_PROPERTIES = [
	"--hue-primary",
	"--hue-secondary",
	"--hue-positive",
	"--hue-error",
	"--pfp-font-family-brand",
	"--pfp-font-family-body",
] as const;

export type BrandThemeProperty = (typeof BRAND_THEME_PROPERTIES)[number];
export type BrandTheme = Record<BrandThemeProperty, string>;
export type BrandThemeUpdate = Partial<BrandTheme>;

type MatchMedia = (
	query: string,
) => Pick<MediaQueryList, "matches"> | undefined;

export interface ApplyColorModeOptions {
	root?: HTMLElement | null;
	targetDocument?: Document | null;
	matchMedia?: MatchMedia;
	persist?: boolean;
}

export interface UpdateBrandThemeOptions {
	persist?: boolean;
}

const BRAND_THEME_PROPERTY_SET = new Set<string>(BRAND_THEME_PROPERTIES);
const HUE_PROPERTIES = new Set<BrandThemeProperty>([
	"--hue-primary",
	"--hue-secondary",
	"--hue-positive",
	"--hue-error",
]);
const FONT_PROPERTIES = new Set<BrandThemeProperty>([
	"--pfp-font-family-brand",
	"--pfp-font-family-body",
]);
const THEME_FONT_SET = new Set<string>(ALLOWED_THEME_FONTS);
const THEME_FONT_FAMILY_ENTRIES = Object.entries(THEME_FONT_FAMILIES) as [
	ThemeFont,
	string,
][];
const NUMBER_PATTERN = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;

const getThemeFontFamily = (value: string) => {
	if (THEME_FONT_SET.has(value)) {
		return THEME_FONT_FAMILIES[value as ThemeFont];
	}
};

const getThemeFont = (family: string) =>
	THEME_FONT_FAMILY_ENTRIES.find(([, value]) => value === family)?.[0];

const getDocument = () =>
	typeof document === "undefined" ? undefined : document;

const getDocumentRoot = () => getDocument()?.documentElement;

const getStorage = () => {
	if (typeof window === "undefined") return undefined;

	try {
		return window.localStorage;
	} catch {
		return undefined;
	}
};

const getStoredValue = (key: string) => {
	try {
		return getStorage()?.getItem(key) ?? null;
	} catch {
		return null;
	}
};

const setStoredValue = (key: string, value: string) => {
	try {
		getStorage()?.setItem(key, value);
	} catch {
		// Storage can be unavailable or full. The applied theme still works.
	}
};

const removeStoredValue = (key: string) => {
	try {
		getStorage()?.removeItem(key);
	} catch {
		// Storage can be unavailable. The applied theme still works.
	}
};

export const isColorModePreference = (
	value: unknown,
): value is ColorModePreference =>
	value === "light" || value === "dark" || value === "system";

export const readColorModePreference = (): ColorModePreference => {
	const savedPreference = getStoredValue(COLOR_MODE_STORAGE_KEY);
	return isColorModePreference(savedPreference) ? savedPreference : "system";
};

export const saveColorModePreference = (preference: ColorModePreference) => {
	if (preference === "system") {
		removeStoredValue(COLOR_MODE_STORAGE_KEY);
		return;
	}

	setStoredValue(COLOR_MODE_STORAGE_KEY, preference);
};

export const resolveColorMode = (
	preference: ColorModePreference,
	matchMedia?: MatchMedia,
): ResolvedColorMode => {
	if (preference === "light" || preference === "dark") return preference;

	const mediaMatcher =
		matchMedia ??
		(typeof window === "undefined"
			? undefined
			: window.matchMedia.bind(window));

	try {
		return mediaMatcher?.(COLOR_SCHEME_MEDIA_QUERY)?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
};

export const syncThemeColorMeta = (
	colorMode: ResolvedColorMode,
	targetDocument: Document | undefined = getDocument(),
) => {
	if (!targetDocument) return;

	const color = colorMode === "light" ? THEME_COLOR_LIGHT : THEME_COLOR_DARK;
	targetDocument
		.querySelectorAll("meta[name='theme-color']")
		.forEach((element) => element.setAttribute("content", color));
};

export const applyColorMode = (
	preference: ColorModePreference,
	options: ApplyColorModeOptions = {},
): ResolvedColorMode => {
	const normalizedPreference = isColorModePreference(preference)
		? preference
		: "system";
	const colorMode = resolveColorMode(normalizedPreference, options.matchMedia);
	const root =
		options.root === undefined
			? getDocumentRoot()
			: (options.root ?? undefined);

	root?.classList.toggle("light", colorMode === "light");
	root?.classList.toggle("dark", colorMode === "dark");

	const targetDocument =
		options.targetDocument === undefined
			? (root?.ownerDocument ?? getDocument())
			: (options.targetDocument ?? undefined);
	syncThemeColorMeta(colorMode, targetDocument);

	if (options.persist !== false) {
		saveColorModePreference(normalizedPreference);
	}

	return colorMode;
};

export const loadColorMode = (
	options: Omit<ApplyColorModeOptions, "persist"> = {},
) =>
	applyColorMode(readColorModePreference(), {
		...options,
		persist: false,
	});

const normalizeBrandThemeProperty = (
	property: string,
): BrandThemeProperty | undefined => {
	const cssProperty = property.startsWith("--") ? property : `--${property}`;
	return BRAND_THEME_PROPERTY_SET.has(cssProperty)
		? (cssProperty as BrandThemeProperty)
		: undefined;
};

export const isValidBrandThemeValue = (
	property: BrandThemeProperty,
	value: unknown,
): value is string => {
	if (typeof value !== "string") return false;

	const normalizedValue = value.trim();
	if (!normalizedValue) return true;

	if (FONT_PROPERTIES.has(property)) {
		return getThemeFontFamily(normalizedValue) !== undefined;
	}

	if (!NUMBER_PATTERN.test(normalizedValue)) return false;
	const number = Number(normalizedValue);
	if (!Number.isFinite(number)) return false;

	return HUE_PROPERTIES.has(property) && number >= 0 && number <= 360;
};

export const sanitizeBrandTheme = (value: unknown): BrandThemeUpdate => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};

	const theme: BrandThemeUpdate = {};
	for (const [storedProperty, storedValue] of Object.entries(value)) {
		const property = normalizeBrandThemeProperty(storedProperty);
		if (!property || !isValidBrandThemeValue(property, storedValue)) continue;
		theme[property] = storedValue.trim();
	}

	return theme;
};

export const readBrandTheme = (
	root: HTMLElement | undefined = getDocumentRoot(),
): BrandTheme =>
	Object.fromEntries(
		BRAND_THEME_PROPERTIES.map((property) => {
			const value = root?.style.getPropertyValue(property).trim() ?? "";
			return [
				property,
				FONT_PROPERTIES.has(property) && value
					? (getThemeFont(value) ?? "")
					: value,
			];
		}),
	) as BrandTheme;

export const readSavedBrandTheme = (): BrandThemeUpdate | undefined => {
	const savedTheme = getStoredValue(BRAND_THEME_STORAGE_KEY);
	if (!savedTheme) return undefined;

	try {
		const parsedTheme: unknown = JSON.parse(savedTheme);
		if (
			!parsedTheme ||
			typeof parsedTheme !== "object" ||
			Array.isArray(parsedTheme)
		) {
			return undefined;
		}
		return sanitizeBrandTheme(parsedTheme);
	} catch {
		return undefined;
	}
};

export const applyBrandTheme = (
	theme: unknown,
	root: HTMLElement | undefined = getDocumentRoot(),
): BrandThemeUpdate => {
	const sanitizedTheme = sanitizeBrandTheme(theme);
	if (!root) return sanitizedTheme;

	for (const [property, value] of Object.entries(sanitizedTheme) as [
		BrandThemeProperty,
		string,
	][]) {
		const cssValue =
			FONT_PROPERTIES.has(property) && value
				? THEME_FONT_FAMILIES[value as ThemeFont]
				: value;
		if (cssValue) root.style.setProperty(property, cssValue);
		else root.style.removeProperty(property);
	}

	return sanitizedTheme;
};

export const saveBrandTheme = (
	root: HTMLElement | undefined = getDocumentRoot(),
) => {
	if (!root) return;

	const currentTheme = readBrandTheme(root);
	const theme = Object.fromEntries(
		BRAND_THEME_PROPERTIES.map((property) => [
			property,
			isValidBrandThemeValue(property, currentTheme[property])
				? currentTheme[property]
				: "",
		]),
	) as BrandTheme;
	if (BRAND_THEME_PROPERTIES.every((property) => !theme[property])) {
		removeStoredValue(BRAND_THEME_STORAGE_KEY);
		return theme;
	}

	const storedTheme = Object.fromEntries(
		BRAND_THEME_PROPERTIES.map((property) => [
			property.slice(2),
			theme[property],
		]),
	);
	setStoredValue(BRAND_THEME_STORAGE_KEY, JSON.stringify(storedTheme));
	return theme;
};

export const loadBrandTheme = (
	root: HTMLElement | undefined = getDocumentRoot(),
) => {
	const savedTheme = readSavedBrandTheme();
	if (!savedTheme) return;
	return applyBrandTheme(savedTheme, root);
};

export const resetBrandTheme = (
	root: HTMLElement | undefined = getDocumentRoot(),
) => {
	for (const property of BRAND_THEME_PROPERTIES) {
		root?.style.removeProperty(property);
	}
	removeStoredValue(BRAND_THEME_STORAGE_KEY);
};

export const harmonize = (
	hue: number,
	tint: number,
	isSemantic: boolean = false,
	strength = 0.15,
) => {
	const limit = 10;
	const offset = ((tint - hue + 540) % 360) - 180;
	const result = hue + offset * strength;

	return (
		(isSemantic
			? Math.min(Math.max(result, hue - limit), hue + limit)
			: result + 360) % 360
	);
};

export const randHue = () => Math.floor(Math.random() * 360);

export const updateBrandTheme = (
	root: HTMLElement | undefined = getDocumentRoot(),
	options: UpdateBrandThemeOptions = {},
) => {
	if (!root || typeof getComputedStyle === "undefined") return;

	const styles = getComputedStyle(root);

	const positive = Number(
		styles.getPropertyValue("--pfp-hue-positive").trim() || 0,
	);

	const error = Number(styles.getPropertyValue("--pfp-hue-error").trim() || 0);

	const primary = randHue();
	const secondary = harmonize((primary + 120) % 360, primary);
	const harmonizedPositive = harmonize(positive, primary, true);
	const harmonizedError = harmonize(error, primary, true);

	root.style.setProperty("--hue-primary", String(primary));
	root.style.setProperty("--hue-secondary", String(secondary));
	root.style.setProperty("--hue-positive", String(harmonizedPositive));
	root.style.setProperty("--hue-error", String(harmonizedError));

	if (options.persist !== false) saveBrandTheme(root);
};
