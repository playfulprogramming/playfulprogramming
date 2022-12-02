const LOCAL_STORAGE_KEY = "tabs-selection";

type TabEntry = Map<
	string,
	{
		tab: HTMLElement;
		panel: HTMLElement;
		parent: HTMLElement;
	}
>;

export const enableTabs = () => {
	// Array of all TabName->Element mappings in tab sets
	const tabEntries: TabEntry[] = [];

	// Handle arrow navigation between tabs in the tab list
	function handleKeydown(this: HTMLElement, e: KeyboardEvent) {
		if (e.keyCode === 39 || e.keyCode === 37) {
			const tabs = this.children;
			let tabfocus = +(this.dataset.tabfocus || 0);
			tabs[tabfocus].setAttribute("tabindex", "-1");
			if (e.keyCode === 39) {
				// Move right
				// Increase tab index, wrap by # of tabs
				tabfocus = (tabfocus + 1) % tabs.length;
			} else if (e.keyCode === 37) {
				// Move left
				tabfocus--;
				// If we're at the start, move to the end
				if (tabfocus < 0) {
					tabfocus = tabs.length - 1;
				}
			}

			// Update tabfocus values
			this.dataset.tabfocus = tabfocus + "";
			// Focus + click selected tab
			const tab = tabs[tabfocus] as HTMLElement;
			tab.setAttribute("tabindex", "0");
			tab.focus();
			tab.click();
		}
	}

	function handleClick(e: Event) {
		const tabName = (e.target as HTMLElement).dataset.tabname;
		changeTabs(tabName);
	}

	// Iterate through all tabs to populate tabEntries & set listeners
	document.querySelectorAll('[role="tablist"]').forEach((tabList) => {
		const entry: TabEntry = new Map();
		const parent = tabList.parentElement;

		const tabs: NodeListOf<HTMLElement> =
			tabList.querySelectorAll('[role="tab"]');

		tabs.forEach((tab) => {
			const panel = parent.querySelector<HTMLElement>(
				`#${tab.getAttribute("aria-controls")}`
			);
			entry.set(tab.dataset.tabname, {
				tab,
				panel,
				parent,
			});

			// Add a click event handler to each tab
			tab.addEventListener("click", handleClick);
		});

		// Enable arrow navigation between tabs in the tab list
		tabList.addEventListener("keydown", handleKeydown);

		tabEntries.push(entry);
	});

	function measureTabs() {
		for (const tabEntry of tabEntries) {
			// Get parent element
			let parent: HTMLElement;
			for (const [_, tab] of tabEntry) {
				parent = tab.parent;
				break;
			}

			// Clone element and append to parent ("fixed" should avoid dramatic layout changes, but still calculate layout bounds)
			const parentClone = parent.cloneNode(true) as HTMLElement;
			parentClone.style.position = "fixed";
			document.body.appendChild(parentClone);

			// Determine the max & min height values
			let minHeight = 0;
			let maxPanel: Element | null = null;
			parentClone.querySelectorAll('[role="tabpanel"]').forEach((tabPanel) => {
				tabPanel.removeAttribute("hidden");

				if (!minHeight || tabPanel.clientHeight < minHeight) {
					minHeight = tabPanel.clientHeight;
				}

				if (maxPanel && maxPanel.clientHeight > tabPanel.clientHeight) {
					tabPanel.setAttribute("hidden", "true");
					return;
				}

				maxPanel && maxPanel.setAttribute("hidden", "true");
				maxPanel = tabPanel;
			});

			// Store the total parent height when maxPanel is visible
			const maxHeight = parentClone.clientHeight;

			// Remove the cloned node from the window
			parentClone.remove();

			// this min height should only be applied if the height diff. is < 50vh && the total height is < 100vh
			if (
				maxHeight - minHeight < window.innerHeight * 0.5 &&
				maxHeight < window.innerHeight
			)
				parent.style.minHeight = maxHeight + "px";
		}
	}

	setTimeout(measureTabs, 0);

	function changeTabs(tabName: string) {
		// find all tabs on the page that match the selected tabname
		for (const tabEntry of tabEntries) {
			const tab = tabEntry.get(tabName);
			if (!tab) continue;

			// Set all encountered tabs as selected
			tab.tab.setAttribute("aria-selected", "true");
			// Show the selected panel
			tab.panel.removeAttribute("hidden");

			// Iterate through sibling tabs
			for (const [otherKey, otherTab] of tabEntry) {
				if (otherKey === tabName) continue;

				// Set all sibling tabs as unselected
				otherTab.tab.setAttribute("aria-selected", "false");
				// Hide sibling tab panels
				otherTab.panel.setAttribute("hidden", `true`);
			}
		}

		localStorage.setItem(LOCAL_STORAGE_KEY, tabName);
	}

	/* -------------------- */

	// If the user has already visited a tab name, enable it on load
	const currentTab = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (currentTab) {
		changeTabs(currentTab);
	}

	// If user has linked to a heading that's inside of a tab
	const hash = window.location.hash;
	if (!hash) return;
	const heading = document.getElementById(hash.slice(1));
	if (!heading) return;

	for (const tabEntry of tabEntries) {
		for (const [_, tab] of tabEntry) {
			// If the tab is hidden and the heading is contained within the tab
			if (tab.panel.hasAttribute("hidden") && tab.panel.contains(heading)) {
				tab.tab.click();
				setTimeout(() => {
					heading.scrollIntoView(true);
				}, 0);
				return;
			}
		}
	}
};
