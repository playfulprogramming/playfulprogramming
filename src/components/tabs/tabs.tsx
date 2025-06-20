import { JSXNode } from "components/types";
import "./tabs.scss";
import { useRef } from "preact/hooks";

interface TabInfo {
	slug: string;
	name: string;
}

interface TabsProps {
	id: string;
	tabs: TabInfo[];
	children: JSXNode;
	selectedTab: string;
	setSelectedTab: (tab: string) => void;
}

// If overflow-anchor cannot be applied, tabs should scroll into view when clicked
//   to prevent confusing content jumps
const shouldScrollToTab = !(
	typeof CSS !== "undefined" && CSS.supports && CSS.supports("overflow-anchor", "none")
);

export function Tabs({ id, tabs, children, selectedTab, setSelectedTab }: TabsProps) {
	const tabElsRef = useRef<Array<HTMLElement | null>>([]);

	// Handle arrow navigation between tabs in the tab list
	function handleKeydown(e: KeyboardEvent, slug: string) {
		if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
			let tabIndex = tabs.findIndex(t => t.slug == slug);
			if (e.code === "ArrowRight") {
				// Move right
				// Increase tab index, wrap by # of tabs
				tabIndex = (tabIndex + 1) % tabs.length;
			} else if (e.code === "ArrowLeft") {
				// Move left
				tabIndex--;
				// If we're at the start, move to the end
				if (tabIndex < 0) {
					tabIndex = tabs.length - 1;
				}
			}

			const tab = tabElsRef.current[tabIndex];
			let tabOffset: number | undefined;

			if (tab) {
				// Focus the selected tab
				tab.focus();

				// Check if tab list is within viewport
				const header = document.querySelector("#header-bar");
				const headerOffset = (header?.getBoundingClientRect().height ?? 0) + 20;
				const tabYPosition = tab.getBoundingClientRect().y;
				const tabHeight = tab.getBoundingClientRect().height;
				const isWithinViewport =
					tabYPosition > headerOffset &&
					tabYPosition < window.innerHeight - tabHeight;

				// Preserve scroll position if within viewport
				// Else scroll to 20px below header
				const offsetBeforeChangeTabs = tab.offsetTop - window.scrollY;
				tabOffset = isWithinViewport ? offsetBeforeChangeTabs : headerOffset;
			}

			setSelectedTab(tabs[tabIndex].slug);

			// Ensure tab list is within viewport after switching tabs
			setTimeout(() => {
				if (tab && tabOffset !== undefined) {
					window.scroll(0, tab.offsetTop - tabOffset);
				}
			}, 0);
		}
	}

	function handleClick(e: MouseEvent, slug: string) {
		const target = e.target as HTMLElement;

		const offsetBeforeChangeTabs = target.offsetTop - window.scrollY;
		setSelectedTab(slug);

		if (shouldScrollToTab) {
			// Scroll onto screen in order to avoid jumping page locations
			setTimeout(() => {
				window.scroll(0, target.offsetTop - offsetBeforeChangeTabs);
			}, 0);
		}
	}

	return (
		<div class="tabs">
			<ul role="tablist" class="tabs__tab-list">
				{tabs.map(({ slug, name }, index) => (
					<li
						key={slug}
						id={`tabs-label::${id}::${slug}`}
						role="tab"
						class="tabs__tab text-style-body-medium-bold"
						aria-selected={selectedTab == slug}
						aria-controls={`tabs-panel::${id}::${slug}`}
						tabIndex={selectedTab == slug ? 0 : -1}
						onKeyDown={(e) => handleKeydown(e, slug)}
						onClick={(e) => handleClick(e, slug)}
						ref={el => tabElsRef.current[index] = el}
					>
						{name}
					</li>
				))}
			</ul>
			{children}
		</div>
	);
}

type TabsItemProps = Omit<TabsProps, "setSelectedTab"> & {
	id: string;
	slug: string;
};

export function TabsItem(props: TabsItemProps) {
	const isSelected = props.selectedTab == props.slug;

	return (
		<div
			id={`tabs-panel::${props.id}::${props.slug}`}
			role="tabpanel"
			class="tabs__tab-panel"
			tabindex={0}
			aria-labelledby={`tabs-label::${props.id}::${props.slug}`}
			aria-hidden={isSelected ? undefined : true}
		>
			<div class="tabs__tab-panel__inner">{props.children}</div>
		</div>
	);
}
