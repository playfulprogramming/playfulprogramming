import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { ResizeablePanels } from "./resizeable-panels.tsx";

const meta = preview
	.type<{ args: ComponentProps<typeof ResizeablePanels> }>()
	.meta({
		title: "components/Resizable Panels",
		component: ResizeablePanels,
		args: {
			panelHeight: 350,
			leftPanel: <pre>Drag the divider or use the arrow keys.</pre>,
			rightPanel: <p>The preview panel</p>,
		},
	});
export const Default = meta.story({});
