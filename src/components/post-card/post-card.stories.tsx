import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { PostCard, PostCardExpanded } from "./post-card.tsx";

import { post, person } from "../../../.storybook/fixtures.ts";

const meta = preview.type<{ args: ComponentProps<typeof PostCard> }>().meta({
	title: "components/Post Card",
	component: PostCard,
	args: { post, authors: [person] },
	decorators: [
		(Story) => (
			<ul class="unlist">
				<Story />
			</ul>
		),
	],
});
export const Default = meta.story({});
export const Expanded = meta.story({
	render: (args) => <PostCardExpanded {...args} />,
});
export const LongTitle = meta.story({
	args: {
		post: {
			...post,
			title:
				"A deliberately long article title to explore how cards wrap at narrow viewport sizes",
		},
	},
});
