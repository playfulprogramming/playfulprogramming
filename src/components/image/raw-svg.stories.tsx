import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { RawSvg } from "./raw-svg.tsx";
import icon from "#src/assets/icons/arrow_right.svg?raw";

const meta = preview.type<{ args: ComponentProps<typeof RawSvg> }>().meta({
	title: "Components/RawSvg",
	component: RawSvg,
	args: { icon, width: 48, height: 48, role: "img", "aria-label": "Continue" },
});
export const Default = meta.story({});
