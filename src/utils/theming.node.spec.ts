import { afterEach, describe, expect, test, vi } from "vitest";

import {
	BRAND_THEME_STORAGE_KEY,
	COLOR_MODE_STORAGE_KEY,
	THEME_COLOR_DARK,
	THEME_COLOR_LIGHT,
} from "../constants/theme.ts";
import {
	ALLOWED_THEME_FONT_FAMILIES,
	applyBrandTheme,
	applyColorMode,
	BRAND_THEME_PROPERTIES,
	COLOR_SCHEME_MEDIA_QUERY,
	loadBrandTheme,
	loadColorMode,
	readBrandTheme,
	readColorModePreference,
	readSavedBrandTheme,
	resetBrandTheme,
	resolveColorMode,
	sanitizeBrandTheme,
	saveBrandTheme,
	THEME_FONT_FAMILIES,
	updateBrandTheme,
} from "./theming.ts";

class MemoryStorage implements Storage {
	readonly values = new Map<string, string>();

	get length() {
		return this.values.size;
	}

	clear() {
		this.values.clear();
	}

	getItem(key: string) {
		return this.values.get(key) ?? null;
	}

	key(index: number) {
		return [...this.values.keys()][index] ?? null;
	}

	removeItem(key: string) {
		this.values.delete(key);
	}

	setItem(key: string, value: string) {
		this.values.set(key, String(value));
	}
}

const useStorage = (initialValues: Record<string, string> = {}) => {
	const storage = new MemoryStorage();
	for (const [key, value] of Object.entries(initialValues)) {
		storage.setItem(key, value);
	}
	vi.stubGlobal("window", { localStorage: storage });
	return storage;
};

const createStyle = (initialValues: Record<string, string> = {}) => {
	const values = new Map(Object.entries(initialValues));
	const style = {
		getPropertyValue: vi.fn((property: string) => values.get(property) ?? ""),
		removeProperty: vi.fn((property: string) => {
			const previousValue = values.get(property) ?? "";
			values.delete(property);
			return previousValue;
		}),
		setProperty: vi.fn((property: string, value: string) => {
			values.set(property, String(value));
		}),
	} as unknown as CSSStyleDeclaration;

	return { style, values };
};

const createDocument = () => {
	const themeColorMetas = [
		{ setAttribute: vi.fn() },
		{ setAttribute: vi.fn() },
	];
	const targetDocument = {
		querySelectorAll: vi.fn(() => themeColorMetas),
	} as unknown as Document;

	return { targetDocument, themeColorMetas };
};

const createRoot = (
	initialStyles: Record<string, string> = {},
	initialClasses: string[] = [],
	ownerDocument?: Document,
) => {
	const { style, values } = createStyle(initialStyles);
	const classes = new Set(initialClasses);
	const classList = {
		toggle: vi.fn((className: string, force?: boolean) => {
			const shouldAdd = force ?? !classes.has(className);
			if (shouldAdd) classes.add(className);
			else classes.delete(className);
			return shouldAdd;
		}),
	};
	const root = {
		classList,
		ownerDocument,
		style,
	} as unknown as HTMLElement;

	return { classes, root, style, values };
};

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("color mode", () => {
	test("reads supported preferences and treats invalid storage as system", () => {
		const storage = useStorage({ [COLOR_MODE_STORAGE_KEY]: "dark" });

		expect(readColorModePreference()).toBe("dark");

		storage.setItem(COLOR_MODE_STORAGE_KEY, "sepia");
		expect(readColorModePreference()).toBe("system");
	});

	test("resolves system from the dark-mode media query", () => {
		const matchMedia = vi.fn(() => ({ matches: true }));

		expect(resolveColorMode("system", matchMedia)).toBe("dark");
		expect(matchMedia).toHaveBeenCalledWith(COLOR_SCHEME_MEDIA_QUERY);
		expect(resolveColorMode("system", () => ({ matches: false }))).toBe(
			"light",
		);
		expect(
			resolveColorMode("system", () => {
				throw new Error("media queries unavailable");
			}),
		).toBe("light");
	});

	test("explicit preferences do not consult the system media query", () => {
		const matchMedia = vi.fn(() => ({ matches: false }));

		expect(resolveColorMode("dark", matchMedia)).toBe("dark");
		expect(resolveColorMode("light", matchMedia)).toBe("light");
		expect(matchMedia).not.toHaveBeenCalled();
	});

	test("applies the resolved mode while preserving unrelated root classes", () => {
		const storage = useStorage();
		const { targetDocument, themeColorMetas } = createDocument();
		const { classes, root } = createRoot(
			{},
			["light", "hydrated", "page-home"],
			targetDocument,
		);

		expect(applyColorMode("dark", { root })).toBe("dark");
		expect([...classes]).toEqual(["hydrated", "page-home", "dark"]);
		expect(storage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("dark");
		for (const meta of themeColorMetas) {
			expect(meta.setAttribute).toHaveBeenCalledWith(
				"content",
				THEME_COLOR_DARK,
			);
		}
	});

	test("loads a system preference without rewriting storage", () => {
		const storage = useStorage();
		const setItem = vi.spyOn(storage, "setItem");
		const removeItem = vi.spyOn(storage, "removeItem");
		const { targetDocument, themeColorMetas } = createDocument();
		const { classes, root } = createRoot({}, ["dark", "app"], targetDocument);

		expect(
			loadColorMode({
				matchMedia: () => ({ matches: false }),
				root,
			}),
		).toBe("light");
		expect([...classes]).toEqual(["app", "light"]);
		expect(setItem).not.toHaveBeenCalled();
		expect(removeItem).not.toHaveBeenCalled();
		for (const meta of themeColorMetas) {
			expect(meta.setAttribute).toHaveBeenCalledWith(
				"content",
				THEME_COLOR_LIGHT,
			);
		}
	});
});

describe("brand theme validation", () => {
	test("accepts only known properties and safe numeric values", () => {
		expect(
			sanitizeBrandTheme({
				"--hue-primary": " 360 ",
				"hue-secondary": ".5",
				"hue-positive": "0",
				"hue-error": "-1",
				"chroma-factor": "2",
				"--not-a-theme-property": "12",
				"--pfp-font-family-body": "url(https://example.com/font)",
			}),
		).toEqual({
			"--chroma-factor": "2",
			"--hue-positive": "0",
			"--hue-primary": "360",
			"--hue-secondary": ".5",
		});

		expect(
			sanitizeBrandTheme({
				"hue-primary": "361",
				"hue-secondary": "1turn",
				"hue-positive": "calc(20 + 1)",
				"hue-error": 12,
				"chroma-factor": "2.01",
			}),
		).toEqual({});
	});

	test("accepts every allowlisted font family and rejects arbitrary CSS", () => {
		for (const fontFamily of ALLOWED_THEME_FONT_FAMILIES) {
			expect(
				sanitizeBrandTheme({
					"pfp-font-family-body": ` ${fontFamily} `,
					"--pfp-font-family-brand": fontFamily,
				}),
			).toEqual({
				"--pfp-font-family-body": fontFamily,
				"--pfp-font-family-brand": fontFamily,
			});
		}

		expect(
			sanitizeBrandTheme({
				"pfp-font-family-body": '"Figtree", serif',
				"pfp-font-family-brand": "var(--user-controlled-font)",
			}),
		).toEqual({});
		expect(
			sanitizeBrandTheme({
				"pfp-font-family-brand": '"Changa One", "Arial", sans-serif',
			}),
		).toEqual({});
	});

	test("treats empty allowed values as a request to clear a property", () => {
		expect(
			sanitizeBrandTheme({
				"hue-primary": "  ",
				"pfp-font-family-body": "",
			}),
		).toEqual({
			"--hue-primary": "",
			"--pfp-font-family-body": "",
		});
	});
});

describe("brand theme persistence", () => {
	test("snapshots every customizable property with storage-safe keys", () => {
		const storage = useStorage();
		const { root } = createRoot({
			"--chroma-factor": " 0.75 ",
			"--hue-primary": " 210 ",
			"--pfp-font-family-body": THEME_FONT_FAMILIES.figtree,
		});

		expect(saveBrandTheme(root)).toEqual({
			"--chroma-factor": "0.75",
			"--hue-error": "",
			"--hue-positive": "",
			"--hue-primary": "210",
			"--hue-secondary": "",
			"--pfp-font-family-body": THEME_FONT_FAMILIES.figtree,
			"--pfp-font-family-brand": "",
		});
		expect(JSON.parse(storage.getItem(BRAND_THEME_STORAGE_KEY) ?? "")).toEqual({
			"chroma-factor": "0.75",
			"hue-error": "",
			"hue-positive": "",
			"hue-primary": "210",
			"hue-secondary": "",
			"pfp-font-family-body": THEME_FONT_FAMILIES.figtree,
			"pfp-font-family-brand": "",
		});
	});

	test("applies a sanitized partial theme without disturbing other styles", () => {
		const { root, values } = createRoot({
			"--hue-primary": "20",
			"--hue-secondary": "30",
			"--unrelated-token": "keep-me",
		});

		expect(
			applyBrandTheme(
				{
					"hue-primary": " 120 ",
					"hue-secondary": "",
					"not-allowed": "100",
				},
				root,
			),
		).toEqual({
			"--hue-primary": "120",
			"--hue-secondary": "",
		});
		expect(Object.fromEntries(values)).toEqual({
			"--hue-primary": "120",
			"--unrelated-token": "keep-me",
		});
	});

	test("loads a saved snapshot after sanitizing it", () => {
		useStorage({
			[BRAND_THEME_STORAGE_KEY]: JSON.stringify({
				"hue-primary": "42",
				"hue-secondary": "expression(alert(1))",
				"pfp-font-family-brand": THEME_FONT_FAMILIES.robotoMono,
			}),
		});
		const { root, values } = createRoot();

		expect(loadBrandTheme(root)).toEqual({
			"--hue-primary": "42",
			"--pfp-font-family-brand": THEME_FONT_FAMILIES.robotoMono,
		});
		expect(Object.fromEntries(values)).toEqual({
			"--hue-primary": "42",
			"--pfp-font-family-brand": THEME_FONT_FAMILIES.robotoMono,
		});
	});

	test.each(["{not-json", "null", "[]", '"a string"'])(
		"ignores malformed saved theme %s",
		(savedTheme) => {
			useStorage({ [BRAND_THEME_STORAGE_KEY]: savedTheme });
			expect(readSavedBrandTheme()).toBeUndefined();
		},
	);

	test("resets every customizable property and its snapshot only", () => {
		const storage = useStorage({
			[BRAND_THEME_STORAGE_KEY]: "saved theme",
			unrelated: "keep me",
		});
		const initialStyles = Object.fromEntries(
			BRAND_THEME_PROPERTIES.map((property) => [property, "set"]),
		);
		const { root, values } = createRoot({
			...initialStyles,
			"--unrelated-token": "keep-me",
		});

		resetBrandTheme(root);

		expect(readBrandTheme(root)).toEqual(
			Object.fromEntries(
				BRAND_THEME_PROPERTIES.map((property) => [property, ""]),
			),
		);
		expect(Object.fromEntries(values)).toEqual({
			"--unrelated-token": "keep-me",
		});
		expect(storage.getItem(BRAND_THEME_STORAGE_KEY)).toBeNull();
		expect(storage.getItem("unrelated")).toBe("keep me");
	});

	test("updates a preview without persisting it", () => {
		const storage = useStorage({
			[BRAND_THEME_STORAGE_KEY]: '{"hue-primary":"9"}',
		});
		const setItem = vi.spyOn(storage, "setItem");
		const { root, values } = createRoot();
		vi.stubGlobal("getComputedStyle", () => ({
			getPropertyValue: (property: string) =>
				property === "--pfp-hue-positive" ? "120" : "10",
		}));
		vi.spyOn(Math, "random").mockReturnValueOnce(0.5).mockReturnValueOnce(0.25);

		updateBrandTheme(root, true, false);

		expect(Object.fromEntries(values)).toEqual({
			"--chroma-factor": "0.5",
			"--hue-error": "20",
			"--hue-positive": "129",
			"--hue-primary": "180",
			"--hue-secondary": "282",
		});
		expect(setItem).not.toHaveBeenCalled();
		expect(storage.getItem(BRAND_THEME_STORAGE_KEY)).toBe(
			'{"hue-primary":"9"}',
		);
	});
});
