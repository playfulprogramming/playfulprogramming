import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Tabs, TabsItem } from "./tabs.tsx";

import { tabs } from "../../../.storybook/fixtures.ts";
import { useState } from "preact/hooks";
function Demo(args: ComponentProps<typeof Tabs>) {
	const [selectedTab, setSelectedTab] = useState(args.selectedTab);
	return (
		<Tabs {...args} selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
			{args.tabs.map((tab) => (
				<TabsItem
					key={tab.slug}
					id={args.id}
					tabs={args.tabs}
					slug={tab.slug}
					selectedTab={selectedTab}
				>
					<p>{tab.name} content</p>
				</TabsItem>
			))}
		</Tabs>
	);
}
const meta = preview.type<{ args: ComponentProps<typeof Tabs> }>().meta({
	title: "Components/Tabs/Controlled Tabs",
	component: Tabs,
	args: {
		id: "storybook-tabs",
		tabs,
		selectedTab: "overview",
		setSelectedTab: () => {},
		children: <></>,
	},
	render: (args) => <Demo {...args} />,
});
export const Default = meta.story({});
