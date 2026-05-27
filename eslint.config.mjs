import eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";
import globals from "globals";
import astroParser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginImport from "eslint-plugin-import";
import preactConfig from "eslint-config-preact";
import { includeIgnoreFile } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pfpTypeScriptRules = {
	"@typescript-eslint/ban-types": "off",
	"@typescript-eslint/consistent-type-imports": [
		"error",
		{ disallowTypeAnnotations: false },
	],
	"@typescript-eslint/no-empty-interface": "off",
	"@typescript-eslint/no-unused-vars": "off",
	"import/extensions": ["error", "always", { ignorePackages: true }],
};

export default tseslint.config(
	// Base ignores
	includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
	{
		ignores: ["content/**/*", "public/content/**/*", "public/sw.js"],
	},

	// Base configs
	eslint.configs.recommended,
	...tseslint.configs.recommended,

	// Astro config
	...eslintPluginAstro.configs.recommended,

	preactConfig.map((config) => ({
		...config,
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
	})),

	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				tsconfigRootDir: __dirname,
			},
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
	},

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
			"react/no-danger": "off",
			"no-undef": "off",
		},
	},

	// Astro files configuration
	{
		files: ["**/*.astro"],
		plugins: {
			import: eslintPluginImport,
		},
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
		plugins: {
			import: eslintPluginImport,
		},
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: __dirname,
			},
		},
		rules: pfpTypeScriptRules,
	},

	{
		files: ["**/*.ui.spec.{ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector: "ImportDeclaration[source.value='vitest']",
					message:
						"Import test helpers from 'ui-test-utils' instead of importing from 'vitest'",
				},
			],
		},
	},
	{
		files: ["**/*.node.spec.ts"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector: "ImportDeclaration[source.value='ui-test-utils']",
					message: "Import test helpers from 'vitest' instead",
				},
			],
		},
	},

	// Astro script configuration
	{
		files: ["**/*.astro/*.js", "*.astro/*.js"],
		languageOptions: {
			parser: tseslint.parser,
		},
	},
);
