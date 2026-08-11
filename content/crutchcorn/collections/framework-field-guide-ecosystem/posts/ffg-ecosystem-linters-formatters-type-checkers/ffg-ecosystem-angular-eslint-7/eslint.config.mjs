// @ts-check
// eslint.config.mjs

import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import pluginAngular from "angular-eslint";

export default pluginTs.config(
	{
		files: ["**/*.ts"],
		extends: [
			pluginJs.configs.recommended,
			...pluginTs.configs.recommendedTypeChecked,
			...pluginAngular.configs.tsRecommended,
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				// If TypeScript complains about this line, install `@types/node`
				tsconfigRootDir: import.meta.dirname,
			},
		},
		processor: pluginAngular.processInlineTemplates,
	},
	{
		files: ["**/*.html"],
		extends: [...pluginAngular.configs.templateRecommended],
	},
);
