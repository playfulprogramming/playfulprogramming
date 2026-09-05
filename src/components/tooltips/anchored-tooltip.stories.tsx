import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { AnchoredTooltip } from "./anchored-tooltip.tsx";
import { RawSvg } from "../image/raw-svg.tsx";
import icon from "#src/assets/icons/launch.svg?raw";

const meta = preview
	.type<{ args: ComponentProps<typeof AnchoredTooltip> }>()
	.meta({
		title: "components/Anchored Tooltip",
		component: AnchoredTooltip,
		args: {
			type: "primary",
			label: "Open example",
			icon: <RawSvg icon={icon} aria-hidden />,
		},
	});
export const Default = meta.story({});
export const Variant = meta.story({ args: { type: "variant" } });
