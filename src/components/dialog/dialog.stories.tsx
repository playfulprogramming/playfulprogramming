import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Dialog } from "./dialog.tsx";
import { useState } from "preact/hooks";
import { Button } from "../button/button.tsx";
function Demo(args: ComponentProps<typeof Dialog>) {
	const [open, setOpen] = useState(args.open);
	return (
		<>
			<Button tag="button" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<Dialog
				{...args}
				open={open}
				aria-labelledby="story-dialog-title"
				onClose={() => setOpen(false)}
			/>
		</>
	);
}
const meta = preview.type<{ args: ComponentProps<typeof Dialog> }>().meta({
	title: "Components/Dialog",
	component: Dialog,
	args: {
		open: false,
		children: (
			<>
				<h2 id="story-dialog-title">A small dialog</h2>
				<p>Close with the button, Escape, or the backdrop.</p>
				<button value="done">Done</button>
			</>
		),
		onClose: () => {},
	},
	render: (args) => <Demo key={String(args.open)} {...args} />,
});
export const Default = meta.story({});
export const Open = meta.story({ args: { open: true } });
