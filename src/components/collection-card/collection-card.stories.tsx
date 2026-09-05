import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { CollectionCard } from "./collection-card.tsx";
import { collection, person } from "../../../.storybook/fixtures.ts";

const meta = preview
	.type<{ args: ComponentProps<typeof CollectionCard> }>()
	.meta({
		title: "Components/CollectionCard",
		component: CollectionCard,
		args: { collection, authors: [person] },
		decorators: [
			(Story) => (
				<ul class="unlist">
					<Story />
				</ul>
			),
		],
	});
export const Default = meta.story({});
