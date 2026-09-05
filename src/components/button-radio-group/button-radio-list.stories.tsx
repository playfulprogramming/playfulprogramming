import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { RadioListButton } from "./button-radio-list.tsx";
import { RadioButtonGroup } from "./button-radio-group.tsx";

const meta = preview
	.type<{ args: ComponentProps<typeof RadioListButton> }>()
	.meta({
		title: "Components/RadioListButton",
		component: RadioListButton,
		args: { value: "compact", children: "Compact layout" },
		decorators: [
			(Story) => (
				<RadioButtonGroup label="Choose a layout" defaultValue="compact">
					<Story />
					<RadioListButton value="comfortable">
						Comfortable layout
					</RadioListButton>
				</RadioButtonGroup>
			),
		],
	});
export const Default = meta.story({});
