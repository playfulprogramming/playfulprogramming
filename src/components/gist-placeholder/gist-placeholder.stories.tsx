import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { GistPlaceholder } from "./gist-placeholder.tsx";

const meta = preview
	.type<{ args: ComponentProps<typeof GistPlaceholder> }>()
	.meta({
		title: "Components/GistPlaceholder",
		component: GistPlaceholder,
		args: {
			username: "example",
			filename: "hello.ts",
			href: "https://gist.github.com",
			children: (
				<pre>
					<code>{'console.log("Hello, world!");'}</code>
				</pre>
			),
		},
	});
export const Default = meta.story({});
