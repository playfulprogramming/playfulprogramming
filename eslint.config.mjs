import eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";
import globals from "globals";
import astroParser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintPluginAstro from "eslint-plugin-astro";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pfpTypeScriptRules = {
	"@typescript-eslint/ban-types": "off",
	"@typescript-eslint/no-empty-interface": "off",
	"@typescript-eslint/no-unused-vars": "off",
};

export default tseslint.config(
	// Base ignores
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/package-lock.json",
			"**/*.md",
			"**/*.min.js",
			"content/**/*",
			"public/content/**/*",
		],
	},

	// Base configs
	eslint.configs.recommended,
	...tseslint.configs.recommended,

	// Astro config
	...eslintPluginAstro.configs.recommended,

	// Global settings
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				astroHTML: true,
			},
			ecmaVersion: "latest",
			sourceType: "module",
		},
		rules: {
			"no-unused-vars": "off",
			"no-mixed-spaces-and-tabs": "off",
			"no-useless-escape": "off",
		},
	},

	// Astro files configuration
	{
		files: ["**/*.astro"],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
		},
		rules: pfpTypeScriptRules,
	},

	// TypeScript configuration
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
		rules: pfpTypeScriptRules,
	},

	// Astro script configuration
	{
		files: ["**/*.astro/*.js", "*.astro/*.js"],
		languageOptions: {
			parser: tseslint.parser,
		},
	},
);
