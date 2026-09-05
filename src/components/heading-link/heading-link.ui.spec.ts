import { afterEach, expect, test, vi } from "#utils/ui-test-utils.ts";
import { initializeHeadingLinks } from "./heading-link.ts";

const roots: HTMLElement[] = [];

afterEach(() => {
	for (const root of roots.splice(0)) root.remove();
	vi.restoreAllMocks();
	vi.useRealTimers();
});

function createFixture() {
	const root = document.createElement("div");
	root.innerHTML = `
		<article class="post-body">
			<h2 id="example-heading"><span>Example heading</span></h2>
			<h3 id="linked-heading"><span>A <a href="#target"><strong>nested link</strong></a></span></h3>
			<h3>No ID</h3>
			<h3 id="skipped-heading" data-no-heading-link>Opted out</h3>
		</article>
		<h2 id="outside-article">Outside the article</h2>
		<template id="heading-link-template">
			<button data-heading-anchor="copy">
				<span data-heading-link="copy">Copy link</span>
				<span aria-live="polite"><span data-heading-link="copied" hidden>Link copied</span></span>
			</button>
		</template>
	`;
	document.body.append(root);
	roots.push(root);
	return {
		root,
		heading: root.querySelector<HTMLElement>("#example-heading")!,
		link: root.querySelector<HTMLAnchorElement>("a")!,
	};
}

test("initializes once within its supplied root, including after returning to new markup", () => {
	const { root, heading } = createFixture();
	const other = createFixture();
	initializeHeadingLinks(root);
	initializeHeadingLinks(root);

	expect(heading).toHaveClass("heading-linked");
	expect(heading.querySelectorAll("button")).toHaveLength(1);
	expect(heading.querySelector("button")).toHaveAccessibleName(
		'Copy permalink for "Example heading"',
	);
	expect(other.root.querySelectorAll("button")).toHaveLength(0);

	root.remove();
	initializeHeadingLinks(other.root);
	expect(other.heading.querySelectorAll("button")).toHaveLength(1);
});

test("leaves headings without IDs, opted-out headings, and non-article headings untouched", () => {
	const { root } = createFixture();
	initializeHeadingLinks(root);

	expect(root.querySelectorAll(".heading-linked")).toHaveLength(2);
	for (const heading of root.querySelectorAll(
		"h3:not([id]), [data-no-heading-link], #outside-article",
	)) {
		expect(heading.querySelector("button")).toBeNull();
		expect(heading).not.toHaveClass("heading-linked");
	}
});

test("does nothing when the supplied root has no permalink template", () => {
	const { root, heading } = createFixture();
	root.querySelector("template")!.remove();
	expect(() => initializeHeadingLinks(root)).not.toThrow();
	expect(heading.querySelector("button")).toBeNull();
});

test.each(["heading", "button"])(
	"clicking the %s copies once and temporarily shows copied feedback",
	(target) => {
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		const writeText = vi
			.spyOn(navigator.clipboard, "writeText")
			.mockResolvedValue();
		const { root, heading } = createFixture();
		initializeHeadingLinks(root);
		initializeHeadingLinks(root);
		const button = heading.querySelector("button")!;
		const copy = button.querySelector("[data-heading-link='copy']")!;
		const copied = button.querySelector("[data-heading-link='copied']")!;

		(target === "heading" ? heading : button).click();

		expect(writeText).toHaveBeenCalledExactlyOnceWith(
			new URL("#example-heading", location.href).toString(),
		);
		expect(button).toHaveAttribute("data-heading-anchor", "copied");
		expect(copy).not.toBeVisible();
		expect(copied).toBeVisible();

		vi.advanceTimersByTime(1000);
		expect(button).toHaveAttribute("data-heading-anchor", "copy");
		expect(copy).toBeVisible();
		expect(copied).not.toBeVisible();
	},
);

test.each(["a", "strong"])(
	"clicking a heading link's %s preserves navigation without copying",
	(selector) => {
		const writeText = vi
			.spyOn(navigator.clipboard, "writeText")
			.mockResolvedValue();
		const { root, link } = createFixture();
		initializeHeadingLinks(root);
		const click = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
		});
		// Observe the component's decision before cancelling the test navigation.
		let preventedByHeading: boolean | undefined;
		root.addEventListener("click", (event) => {
			preventedByHeading = event.defaultPrevented;
			event.preventDefault();
		});
		(selector === "a" ? link : link.querySelector("strong")!).dispatchEvent(
			click,
		);

		expect(writeText).not.toHaveBeenCalled();
		expect(preventedByHeading).toBe(false);
		expect(root.querySelector("[data-heading-anchor='copied']")).toBeNull();
	},
);
