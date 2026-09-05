import { Tabs, TabsItem } from "#components/tabs/tabs-signal.tsx";
import { tabs } from "../fixtures.ts";

// The Astro adapter only bundles islands with a default component export.
export default function BlockingTabsDemo() {
	const id = "storybook-blocking-tabs";
	return (
		<Tabs id={id} tabs={tabs}>
			{tabs.map((tab) => (
				<TabsItem key={tab.slug} id={id} tabs={tabs} slug={tab.slug}>
					<p>{tab.name} content</p>
				</TabsItem>
			))}
		</Tabs>
	);
}
