import globals from "globals";
import parser from "astro-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/node_modules/**",
        "**/dist/**",
        "**/package-lock.json",
        "**/*.md",
        "**/*.min.js",
        "content/**/*",
        "public/content/**/*",
        ".git/**",
        ".vscode/**",
        "coverage/**"
    ],
}, ...compat.extends("eslint:recommended", "plugin:astro/recommended"), {
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
}, {
    files: ["**/*.astro"],
    languageOptions: {
        parser: parser,
        ecmaVersion: 5,
        sourceType: "script",
        parserOptions: {
            parser: "@typescript-eslint/parser",
            extraFileExtensions: [".astro"],
        },
    },
    rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-unused-vars": "off",
    },
}, ...compat.extends("plugin:@typescript-eslint/recommended").map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
})), {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
        parser: tsParser,
    },
    rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-unused-vars": "off",
    },
}, {
    files: ["**/*.astro/*.js", "*.astro/*.js"],
    languageOptions: {
        parser: tsParser,
    },
}];