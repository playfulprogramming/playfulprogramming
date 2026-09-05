import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Tabs, TabsItem } from "./tabs-signal.tsx";

import { tabs } from "../../../.storybook/fixtures.ts";
function Demo(args: ComponentProps<typeof Tabs>) {
	return (
		<Tabs {...args}>
			{args.tabs.map((tab) => (
				<TabsItem key={tab.slug} id={args.id} tabs={args.tabs} slug={tab.slug}>
					<p>{tab.name} content</p>
				</TabsItem>
			))}
		</Tabs>
	);
}
const meta = preview.type<{ args: ComponentProps<typeof Tabs> }>().meta({
	title: "components/Tabs/Signal Tabs",
	component: Tabs,
	args: { id: "storybook-signal-tabs", tabs, children: <></> },
	render: (args) => <Demo {...args} />,
});
export const Default = meta.story({});
