const tsRules = {
	"@typescript-eslint/ban-types": "off",
	"@typescript-eslint/no-empty-interface": "off",
	"@typescript-eslint/no-unused-vars": "off",
};

module.exports = {
	env: {
		node: true,
		browser: true,
	},
	extends: ["eslint:recommended", "plugin:astro/recommended"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	globals: {
		astroHTML: true,
	},
	rules: {
		"no-unused-vars": "off",
		"no-mixed-spaces-and-tabs": "off",
		"no-useless-escape": "off",
	},
	overrides: [
		{
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
			rules: {
				...tsRules,
			},
		},
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
			extends: ["plugin:@typescript-eslint/recommended"],
			rules: {
				...tsRules,
			},
		},
		{
			// Define the configuration for `<script>` tag.
			// Script in `<script>` is assigned a virtual file name with the `.js` extension.
			files: ["**/*.astro/*.js", "*.astro/*.js"],
			parser: "@typescript-eslint/parser",
		},
	],
};
