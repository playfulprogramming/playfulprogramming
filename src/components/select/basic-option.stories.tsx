import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Option } from "./basic-option.tsx";

const meta = preview.type<{ args: ComponentProps<typeof Option> }>().meta({
	title: "Components/Select/Basic Option",
	component: Option,
	args: { children: "Preact", isSelected: true },
	decorators: [
		(Story) => (
			<ul class="unlist">
				<Story />
			</ul>
		),
	],
});
export const Default = meta.story({});
export const Unselected = meta.story({ args: { isSelected: false } });
