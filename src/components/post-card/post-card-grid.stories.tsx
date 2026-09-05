import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { PostCardGrid } from "./post-card-grid.tsx";
import { post, person } from "../../../.storybook/fixtures.ts";

const meta = preview
	.type<{ args: ComponentProps<typeof PostCardGrid> }>()
	.meta({
		title: "Components/PostCardGrid",
		component: PostCardGrid,
		args: {
			postsToDisplay: Array.from({ length: 6 }, (_, i) => ({
				...post,
				slug: `example-${i}`,
				title: `${post.title} ${i + 1}`,
			})),
			postAuthors: new Map([[person.id, person]]),
		},
	});
export const Default = meta.story({});
export const Expanded = meta.story({ args: { expanded: true } });
export const Empty = meta.story({ args: { postsToDisplay: [] } });
