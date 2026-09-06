import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import {
	Button,
	LargeButton,
	IconOnlyButton,
	LargeIconOnlyButton,
} from "./button.tsx";

import { RawSvg } from "../image/raw-svg.tsx";
import icon from "#src/assets/icons/arrow_right.svg?raw";

const meta = preview.type<{ args: ComponentProps<typeof Button> }>().meta({
	title: "components/Button",
	component: Button,
	args: { tag: "button", children: "Explore components", variant: "primary" },
});
export const Default = meta.story({});
export const Emphasized = meta.story({
	args: { variant: "primary-emphasized" },
});
export const Secondary = meta.story({ args: { variant: "secondary" } });
export const Text = meta.story({ args: { variant: "text" } });
export const Disabled = meta.story({
	render: (args) => (
		<Button tag="button" variant={args.variant} disabled>
			{args.children}
		</Button>
	),
});
export const Link = meta.story({
	args: { tag: "a", href: "https://playfulprogramming.com" },
});
export const Large = meta.story({
	render: (args) => <LargeButton {...args} />,
});
export const IconOnly = meta.story({
	render: (args) => (
		<IconOnlyButton {...args} aria-label="Continue">
			<RawSvg icon={icon} aria-hidden />
		</IconOnlyButton>
	),
});
export const LargeIconOnly = meta.story({
	render: (args) => (
		<LargeIconOnlyButton {...args} aria-label="Continue">
			<RawSvg icon={icon} aria-hidden />
		</LargeIconOnlyButton>
	),
});
