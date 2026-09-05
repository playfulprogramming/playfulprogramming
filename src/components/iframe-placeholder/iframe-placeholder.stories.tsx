import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { IFramePlaceholder } from "./iframe-placeholder.tsx";

const meta = preview
	.type<{ args: ComponentProps<typeof IFramePlaceholder> }>()
	.meta({
		title: "Components/IFramePlaceholder",
		component: IFramePlaceholder,
		args: {
			width: "640",
			height: "360",
			src: "about:blank",
			pageTitle: "Local example",
			iframeAttrs: {
				title: "Local example",
				srcDoc: "<h1>Hello from the embedded example</h1>",
			},
		},
	});
export const Default = meta.story({});
