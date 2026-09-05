// Astro's browser stubs omit frontmatter stylesheet imports. CSS modules are
// tree-shaken when their class maps are unused, so explicitly inject their CSS.
const styles = import.meta.glob<string>(
	[
		"../src/components/**/*.module.scss",
		"../src/views/person/components/achievement-card/achievement-card.module.scss",
		"../src/views/blog-post/components/mailing-list/mailing-list.module.scss",
	],
	{ eager: true, query: "?inline", import: "default" },
);
if (typeof document !== "undefined") {
	const id = "storybook-astro-component-styles";
	const element =
		document.getElementById(id) ?? document.createElement("style");
	element.id = id;
	element.textContent = Object.values(styles).join("\n");
	if (!element.isConnected) document.head.appendChild(element);
}
