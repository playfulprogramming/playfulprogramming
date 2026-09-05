import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { SnitipDialog } from "./snitip-dialog.tsx";
import { snitip } from "../../../.storybook/fixtures.ts";
import { useRef } from "preact/hooks";
function Demo(args: ComponentProps<typeof SnitipDialog>) {
	const ref = useRef<HTMLDivElement>(null);
	return (
		<div ref={ref}>
			<button onClick={() => ref.current?.querySelector("dialog")?.showModal()}>
				What is a component?
			</button>
			<SnitipDialog {...args} />
		</div>
	);
}
const meta = preview
	.type<{ args: ComponentProps<typeof SnitipDialog> }>()
	.meta({
		title: "Components/SnitipDialog",
		component: SnitipDialog,
		args: { id: "story-snitip-dialog", snitip },
		render: (args) => <Demo {...args} />,
	});
export const Default = meta.story({});
