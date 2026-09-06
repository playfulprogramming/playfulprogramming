import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { RadioButtonGroup, RadioButton } from "./button-radio-group.tsx";

const meta = preview
	.type<{ args: ComponentProps<typeof RadioButtonGroup> }>()
	.meta({
		title: "components/Radio Button Group",
		component: RadioButtonGroup,
		args: {
			label: "Choose a framework",
			defaultValue: "preact",
			children: (
				<>
					<RadioButton value="preact">Preact</RadioButton>
					<RadioButton value="astro">Astro</RadioButton>
				</>
			),
		},
	});
export const Default = meta.story({});
export const Disabled = meta.story({ args: { isDisabled: true } });
