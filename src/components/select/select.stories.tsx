import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Select, Item, SelectWithLabel } from "./select.tsx";

const meta = preview.type<{ args: ComponentProps<typeof Select> }>().meta({
	title: "Components/Select",
	component: Select,
	args: {
		label: "Framework",
		defaultValue: "Choose a framework",
		prefixSelected: "Framework: ",
		defaultSelectedKey: "preact",
		children: (
			<>
				<Item key="preact">Preact</Item>
				<Item key="astro">Astro</Item>
				<Item key="vue">Vue</Item>
			</>
		),
	},
});
export const Default = meta.story({});
export const WithLabel = meta.story({
	render: (args) => <SelectWithLabel {...args} />,
});
export const Disabled = meta.story({ args: { isDisabled: true } });
