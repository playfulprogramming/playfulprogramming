import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { FourOFourEmbed } from "./404-embed.tsx";

const meta = preview
	.type<{ args: ComponentProps<typeof FourOFourEmbed> }>()
	.meta({
		title: "components/404 Embed",
		component: FourOFourEmbed,
		args: { url: "https://example.com/missing-demo" },
	});
export const Default = meta.story({});
