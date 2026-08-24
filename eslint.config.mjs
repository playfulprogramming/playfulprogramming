import eslint from "@eslint/js";
import { defineConfig, globalIgnores, includeIgnoreFile } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";
import astroParser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginImport from "eslint-plugin-import";
import preactConfig from "eslint-config-preact";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pfpTypeScriptRules = {
	"@typescript-eslint/consistent-type-imports": [
		"error",
		{ disallowTypeAnnotations: false },
	],
	"@typescript-eslint/no-empty-object-type": "off",
	"@typescript-eslint/no-unused-vars": "off",
	"import/extensions": ["error", "always", { ignorePackages: true }],
};

export default defineConfig([
	// Base ignores
	includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
	globalIgnores([
		"content/**/*",
		"public/content/**/*",
		"public/mockServiceWorker.js",
		"public/sw.js",
		"public/uninstall-sw.js",
	]),

	// Base configs
	eslint.configs.recommended,

	// Astro config
	...eslintPluginAstro.configs.recommended,

	...preactConfig.map((config) => ({
		...config,
		files: ["**/*.{jsx,ts,tsx}"],
	})),

	{
		files: ["**/*.{ts,tsx}"],
		extends: [tseslint.configs.recommended],
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
		processor: "astro/client-side-ts",
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			import: eslintPluginImport,
		},
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".astro"],
			},
		},
		rules: pfpTypeScriptRules,
	},

	// TypeScript configuration
	{
		files: ["**/*.ts", "**/*.tsx"],
		plugins: {
			"@typescript-eslint": tseslint.plugin,
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
	{
		files: ["**/*.astro/*.ts", "*.astro/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: null,
				sourceType: "module",
			},
		},
	},
]);
