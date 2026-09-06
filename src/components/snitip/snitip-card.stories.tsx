import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { SnitipCard, SnitipCardGrid } from "./snitip-card.tsx";

import { snitip } from "../../../.storybook/fixtures.ts";

const meta = preview.type<{ args: ComponentProps<typeof SnitipCard> }>().meta({
	title: "components/Snitip Card",
	component: SnitipCard,
	args: { snitip },
});
export const Default = meta.story({});
export const Grid = meta.story({
	render: () => (
		<SnitipCardGrid
			snitips={[
				snitip,
				{ ...snitip, id: "second-snitip", title: "What is a prop?" },
			]}
		/>
	),
});
