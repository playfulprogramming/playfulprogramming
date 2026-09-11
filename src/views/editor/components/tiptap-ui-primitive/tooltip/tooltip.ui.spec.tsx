import { expect, test } from "#utils/ui-test-utils.ts";
import { render } from "@testing-library/preact";
import { createRef } from "preact";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.tsx";

test("a tooltip trigger preserves its child and forwarded refs", () => {
	const childRef = createRef<HTMLButtonElement>();
	const triggerRef = createRef<HTMLButtonElement>();
	const { getByRole, unmount } = render(
		<Tooltip initialOpen>
			<TooltipTrigger asChild ref={triggerRef}>
				<button ref={childRef}>Format text</button>
			</TooltipTrigger>
			<TooltipContent portal={false}>Formatting options</TooltipContent>
		</Tooltip>,
	);

	const trigger = getByRole("button", { name: "Format text" });
	expect(childRef.current).toBe(trigger);
	expect(triggerRef.current).toBe(trigger);
	expect(getByRole("tooltip")).toHaveTextContent("Formatting options");

	unmount();
	expect(childRef.current).toBeNull();
	expect(triggerRef.current).toBeNull();
});

test("a tooltip wrapper keeps its nested element ref separate", () => {
	const childRef = createRef<HTMLSpanElement>();
	const triggerRef = createRef<HTMLButtonElement>();
	const { getByRole, getByText, unmount } = render(
		<Tooltip>
			<TooltipTrigger ref={triggerRef}>
				<span ref={childRef}>Format text</span>
			</TooltipTrigger>
		</Tooltip>,
	);

	expect(childRef.current).toBe(getByText("Format text"));
	expect(triggerRef.current).toBe(getByRole("button", { name: "Format text" }));

	unmount();
	expect(childRef.current).toBeNull();
	expect(triggerRef.current).toBeNull();
});
