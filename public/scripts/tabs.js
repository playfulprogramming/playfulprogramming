/* AFTER CHANGING THIS FILE, PLEASE MANUALLY MINIFY IT AND PUT INTO tabs.min.js */

const LOCAL_STORAGE_KEY = "tabs-selection";

window.addEventListener("DOMContentLoaded", () => {
	const tabLists = document.querySelectorAll('[role="tablist"]');

	tabLists.forEach((tabList) => {
		/**
		 * @type {NodeListOf<HTMLElement>}
		 */
		const tabs = tabList.querySelectorAll('[role="tab"]');

		// Add a click event handler to each tab
		tabs.forEach((tab) => {
			tab.addEventListener("click", (e) => {
				/**
				 * @type {HTMLElement}
				 */
				const target = e.target;
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

		tabList.addEventListener("keydown", (_e) => {
			/**
			 * @type {KeyboardEvent}
			 */
			const e = _e;
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
		/**
		 * @type {HTMLElement}
		 */
		const el = document.querySelector(`[data-tabname="${currentTab}"]`);
		if (el) changeTabs({ target: el });
	}

	function changeTabs(_e) {
		/**
		 * @type {{ target: HTMLElement }}
		 */
		const e = _e;
		const target = e.target;
		const parent = target.parentNode;
		const grandparent = parent.parentNode;

		// Remove all current selected tabs
		parent
			.querySelectorAll('[aria-selected="true"]')
			.forEach((t) => t.setAttribute("aria-selected", `false`));

		// Set this tab as selected
		target.setAttribute("aria-selected", `true`);

		const tabName = target.dataset.tabname;
		/**
		 * @type {NodeListOf<HTMLElement>}
		 */
		const relatedTabs = document.querySelectorAll(
			`[role="tab"][data-tabname="${target.dataset.tabname}"]`
		);

		localStorage.setItem(LOCAL_STORAGE_KEY, tabName);

		for (let relatedTab of relatedTabs) {
			if (relatedTab === target) continue;
			changeTabs({ target: relatedTab });
		}

		// Hide all tab panels
		grandparent
			.querySelectorAll('[role="tabpanel"]')
			.forEach((p) => p.setAttribute("hidden", `true`));

		// Show the selected panel
		grandparent.parentNode
			.querySelector(`#${target.getAttribute("aria-controls")}`)
			.removeAttribute("hidden");
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

	(() => {
		// If user has linked to a heading that's inside of a tab
		const hash = window.location.hash;
		if (!hash) return;
		const heading = document.querySelector < HTMLElement > hash;
		if (!heading) return;
		const isHidden = checkElementsParents(
			heading,
			(el) => el.hasAttribute("hidden") && el.getAttribute("hidden") !== "false"
		);
		// If it's not hidden, then we can assume that the browser will auto-scroll to it
		if (!isHidden) return;
		const partialHash = hash.slice(1);
		try {
			const matchingTab =
				document.querySelector <
				HTMLElement >
				`[data-headers*="${partialHash}"`;
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
	})();
});
