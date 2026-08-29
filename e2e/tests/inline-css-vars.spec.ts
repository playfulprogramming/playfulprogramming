/**
 * detects inline style attributes and verifies they resolve
 */

import { test, expect } from "@playwright/test";

const PAGES = [
	{ name: "home", path: "/" },
	{ name: "framework field guide", path: "/collections/framework-field-guide" },
	{ name: "example post", path: "/posts/example" },
];

const collectUndeclaredVars = () =>
	[...document.querySelectorAll("[style]")]
		.flatMap((el) => {
			const computed = window.getComputedStyle(el);
			const tag = el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "");
			return [
				...(el.getAttribute("style") ?? "").matchAll(/var\(\s*(--[\w-]+)/g),
			]
				.map(([, name]) => name)
				.filter((name) => computed.getPropertyValue(name).trim() === "")
				.map((name) => ({ variable: name, element: tag }));
		})
		.filter(
			({ variable }, i, arr) =>
				arr.findIndex((v) => v.variable === variable) === i,
		);

const formatVars = (
	vars: { variable: string; element: string }[],
	page: string,
) =>
	`Undeclared CSS vars on ${page}:\n${vars.map((v) => `  ${v.variable} on <${v.element}>`).join("\n")}`;

for (const { name, path } of PAGES) {
	test(`no undeclared CSS custom properties on ${name} page`, async ({
		page,
	}) => {
		await page.goto(path, { waitUntil: "networkidle" });
		const undeclaredVars = await page.evaluate(collectUndeclaredVars);
		expect(undeclaredVars, formatVars(undeclaredVars, name)).toEqual([]);
	});
}
