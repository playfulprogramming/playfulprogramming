import { afterEach, expect, test, vi } from "#utils/ui-test-utils.ts";
import { waitFor } from "@testing-library/preact";
import { initializeSnitips } from "./snitip-script-impl.ts";

const cleanups: Array<() => void> = [];

afterEach(() => {
	for (const cleanup of cleanups.splice(0).reverse()) cleanup();
	vi.restoreAllMocks();
	vi.useRealTimers();
});

function createFixture() {
	const root = document.createElement("div");
	root.innerHTML = `
		<section data-first-reference>
			<span data-snitip-trigger="component" data-snitip-dialog="test-snitip">
				<button aria-haspopup="dialog" aria-expanded="false">First reference</button>
			</span>
		</section>
		<section data-second-reference>
			<span data-snitip-trigger="component" data-snitip-dialog="test-snitip">
				<button aria-haspopup="dialog" aria-expanded="false">Second reference</button>
			</span>
		</section>
		<dialog id="test-snitip">
			<svg data-snitip-arrow></svg>
			<form method="dialog">
				<h2 data-snitip-title tabindex="-1">Component</h2>
				<button data-snitip-close>Close tooltip</button>
			</form>
		</dialog>
		<p>Article text after the dialog.</p>
	`;
	document.body.append(root);
	cleanups.push(() => root.remove());
	const first = root.querySelector<HTMLElement>("[data-first-reference]")!;
	const second = root.querySelector<HTMLElement>("[data-second-reference]")!;
	return {
		root,
		first,
		second,
		firstButton: first.querySelector("button")!,
		secondButton: second.querySelector("button")!,
		dialog: root.querySelector("dialog")!,
		title: root.querySelector<HTMLElement>("[data-snitip-title]")!,
	};
}

function initialize(root: ParentNode) {
	const cleanup = initializeSnitips(root);
	cleanups.push(cleanup);
	return cleanup;
}

test("initializing the same markup twice does not duplicate or remove its listeners", () => {
	const { root, firstButton, dialog, title } = createFixture();
	initialize(root);
	const cleanupDuplicate = initialize(root);
	cleanupDuplicate();
	const focus = vi.spyOn(title, "focus");

	firstButton.click();

	expect(dialog.open).toBe(true);
	expect(firstButton).toHaveAttribute("aria-expanded", "true");
	expect(focus).toHaveBeenCalledTimes(1);
});

test("shared dialogs stay initialized until their last trigger is cleaned up", async () => {
	const { root, first, second, firstButton, secondButton, dialog } =
		createFixture();
	const originalNextSibling = dialog.nextSibling;
	const cleanupFirst = initialize(first);
	const cleanupSecond = initialize(second);

	firstButton.click();
	cleanupFirst();
	expect(dialog.open).toBe(false);
	expect(dialog.parentNode).toBe(document.body);
	expect(firstButton).toHaveAttribute("aria-expanded", "false");
	// The native close event is queued; let it finish before opening again.
	await new Promise<void>((resolve) => setTimeout(resolve, 0));

	secondButton.click();
	expect(dialog.open).toBe(true);
	expect(secondButton).toHaveAttribute("aria-expanded", "true");
	cleanupSecond();
	expect(dialog.open).toBe(false);
	expect(dialog.parentNode).toBe(root);
	expect(dialog.nextSibling).toBe(originalNextSibling);
	expect(secondButton).toHaveAttribute("aria-expanded", "false");

	secondButton.click();
	expect(dialog.open).toBe(false);
	await new Promise<void>((resolve) => setTimeout(resolve, 0));
	initialize(root);
	secondButton.click();
	expect(dialog.open).toBe(true);
});

test("cleanup cancels queued focus restoration after closing a dialog", async () => {
	vi.useFakeTimers({
		toFake: ["requestAnimationFrame", "cancelAnimationFrame"],
	});
	const { root, firstButton, dialog } = createFixture();
	const cleanup = initialize(root);
	firstButton.click();
	const focus = vi.spyOn(firstButton, "focus");
	dialog.close();
	await waitFor(() =>
		expect(firstButton).toHaveAttribute("aria-expanded", "false"),
	);

	cleanup();
	vi.runAllTimers();

	expect(focus).not.toHaveBeenCalled();
	expect(dialog.parentNode).toBe(root);
	expect(root.querySelector("[data-snitip-initialized]")).toBeNull();
});

test("a queued close event does not reset a dialog reopened by another reference", async () => {
	const { root, firstButton, secondButton, dialog, title } = createFixture();
	initialize(root);
	firstButton.click();
	const closed = new Promise<void>((resolve) => {
		dialog.addEventListener("close", () => resolve(), { once: true });
	});
	dialog.close();
	secondButton.click();
	await closed;

	expect(dialog.open).toBe(true);
	expect(firstButton).toHaveAttribute("aria-expanded", "false");
	expect(secondButton).toHaveAttribute("aria-expanded", "true");
	expect(title).toHaveFocus();
});

test.each(["before close event", "before focus frame"])(
	"closing respects focus moved to another reference %s",
	async (timing) => {
		vi.useFakeTimers({
			toFake: ["requestAnimationFrame", "cancelAnimationFrame"],
		});
		const { root, firstButton, secondButton, dialog } = createFixture();
		initialize(root);
		firstButton.click();
		const closed = new Promise<void>((resolve) => {
			dialog.addEventListener("close", () => resolve(), { once: true });
		});
		dialog.close();
		if (timing === "before close event") secondButton.focus();
		await closed;
		if (timing === "before focus frame") secondButton.focus();
		vi.runAllTimers();

		expect(secondButton).toHaveFocus();
	},
);
