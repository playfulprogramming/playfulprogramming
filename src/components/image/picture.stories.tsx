import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Picture } from "./picture.tsx";
import { illustration } from "../../../.storybook/fixtures.ts";

const meta = preview.type<{ args: ComponentProps<typeof Picture> }>().meta({
	title: "components/Picture",
	component: Picture,
	args: {
		src: illustration,
		width: 480,
		height: 320,
		alt: "Community illustration",
		loading: "eager",
	},
});
export const Default = meta.story({});
