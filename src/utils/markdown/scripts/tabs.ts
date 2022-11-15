const LOCAL_STORAGE_KEY = "tabs-selection";

export const enableTabs = () => {
	const tabLists = document.querySelectorAll('[role="tablist"]');

	tabLists.forEach((tabList) => {
		const tabs: NodeListOf<HTMLElement> =
			tabList.querySelectorAll('[role="tab"]');

		// Add a click event handler to each tab
		tabs.forEach((tab) => {
			tab.addEventListener("click", (e) => {
				const target: HTMLElement = e.target as never;
				// Scroll onto screen in order to avoid jumping page locations
				setTimeout(() => {
					target.scrollIntoView({
						behavior: "auto",
						block: "center",
						inline: "center",
					});
				}, 0);
				changeTabs({ target });
			});
		});

		// Enable arrow navigation between tabs in the tab list
		let tabFocus = 0;

		tabList.addEventListener("keydown", (e: KeyboardEvent) => {
			// Move right
			if (e.keyCode === 39 || e.keyCode === 37) {
				tabs[tabFocus].setAttribute("tabindex", `-1`);
				if (e.keyCode === 39) {
					tabFocus++;
					// If we're at the end, go to the start
					if (tabFocus >= tabs.length) {
						tabFocus = 0;
					}
					// Move left
				} else if (e.keyCode === 37) {
					tabFocus--;
					// If we're at the start, move to the end
					if (tabFocus < 0) {
						tabFocus = tabs.length - 1;
					}
				}

				tabs[tabFocus].setAttribute("tabindex", `0`);
				tabs[tabFocus].focus();
				tabs[tabFocus].click();
			}
		});
	});

	const currentTab = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (currentTab) {
		const el: HTMLElement = document.querySelector(
			`[data-tabname="${currentTab}"]`
		);
		if (el) changeTabs({ target: el });
	}

	function changeTabs(e: { target: HTMLElement }) {
		const target = e.target;
		const tabName = target.dataset.tabname;

		// find all tabs on the page that match the selected tabname
		document
			.querySelectorAll(`[role="tab"][data-tabname="${tabName}"]`)
			.forEach((tab) => {
				const parent = tab.parentNode;
				const grandparent = parent.parentNode;

				// Set all encountered tabs as selected
				tab.setAttribute("aria-selected", "true");

				// Set all sibling tabs as unselected
				parent
					.querySelectorAll(`[role="tab"]:not([data-tabname="${tabName}"])`)
					.forEach((tab) => tab.setAttribute("aria-selected", "false"));

				// Hide all tab panels
				grandparent
					.querySelectorAll('[role="tabpanel"]')
					.forEach((p) => p.setAttribute("hidden", `true`));

				// Show the selected panel
				grandparent
					.querySelector(`#${tab.getAttribute("aria-controls")}`)
					.removeAttribute("hidden");
			});

		localStorage.setItem(LOCAL_STORAGE_KEY, tabName);
	}

	/* -------------------- */

	/**
	 *
	 * @param {HTMLElement} el
	 * @param {(el: HTMLElement) => boolean} check
	 * @returns {boolean}
	 */
	function checkElementsParents(el, check) {
		if (el.parentElement) {
			if (!check(el.parentElement)) {
				return checkElementsParents(el.parentElement, check);
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	// If user has linked to a heading that's inside of a tab
	const hash = window.location.hash;
	if (!hash) return;
	const heading = document.querySelector<HTMLElement>(hash);
	if (!heading) return;
	const isHidden = checkElementsParents(
		heading,
		(el) => el.hasAttribute("hidden") && el.getAttribute("hidden") !== "false"
	);
	// If it's not hidden, then we can assume that the browser will auto-scroll to it
	if (!isHidden) return;
	const partialHash = hash.slice(1);
	try {
		const matchingTab = document.querySelector<HTMLElement>(
			`[data-headers*="${partialHash}"`
		);
		if (!matchingTab) return;
		// If header is not in a tab
		const tabName = matchingTab.getAttribute("data-tabname");
		if (!tabName) return;
		matchingTab.click();
		setTimeout(() => {
			const el = document.querySelector(hash);
			if (!el) return;
			el.scrollIntoView(true);
		}, 0);
	} catch (e) {
		console.error("Error finding matching tab", e);
	}
};
