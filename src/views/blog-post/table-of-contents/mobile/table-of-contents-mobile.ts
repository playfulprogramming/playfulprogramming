import styles from "./table-of-contents-mobile.module.scss";

export const setupMobileTableOfContentsToggle = () => {
	const mainBody = document.getElementsByTagName("body")[0];
	const mainPageContents = document.querySelector<HTMLElement>(
		"[data-article-page-contents]",
	);

	const mobileTableOfContentsMenu = document.querySelector<HTMLElement>(
		"[data-mobile-table-of-contents-menu]",
	);
	const mobileTableOfContentsMenuHeaderText =
		document.querySelector<HTMLElement>(
			"[data-mobile-table-of-contents-menu-header]",
		);
	const mobileTableOfContentsMenuList = document.querySelector<HTMLElement>(
		"[data-mobile-table-of-contents-menu-list]",
	);

	const mobileTableOfContentsMenuToggleButton =
		document.querySelector<HTMLButtonElement>(
			"[data-mobile-table-of-contents-toggle-button]",
		);

	const mobileTableOfContentsMenuListItems =
		mobileTableOfContentsMenuList?.querySelectorAll<HTMLLinkElement>("a");

	const _toggleMobileMenuStyles = () => {
		mobileTableOfContentsMenu?.classList.toggle(styles.tocMobileMenuCollapsed);
		mainBody?.classList.toggle(styles.tocMobileOpenMainBody);
	};

	const _toggleMobileMenuInert = () => {
		const mobileMenuCollapsed = mobileTableOfContentsMenu?.classList.contains(
			styles.tocMobileMenuCollapsed,
		);

		if (mainPageContents) {
			mainPageContents.inert = !mobileMenuCollapsed;
		}
		if (mobileTableOfContentsMenuList) {
			mobileTableOfContentsMenuList.inert = mobileMenuCollapsed || false;
		}
	};

	const toggleMenuExpanded = () => {
		_toggleMobileMenuStyles();
		_toggleMobileMenuInert();
	};

	const scrollPageToMenuItem = (anchor: HTMLAnchorElement) => {
		if (!anchor) return;
		const href = anchor.getAttribute("href");
		if (!href) return;
		const heading = document.getElementById(href.slice(1));
		if (!heading) return;

		heading?.scrollIntoView({
			block: "center",
			behavior: "auto",
		});
	};

	const handleMenuItemClick = (event) => {
		event.preventDefault();

		toggleMenuExpanded();
		scrollPageToMenuItem(event.target);
	};

	mobileTableOfContentsMenuToggleButton?.addEventListener(
		"click",
		toggleMenuExpanded,
	);

	mobileTableOfContentsMenuListItems?.forEach((menuItem) => {
		menuItem.addEventListener("click", handleMenuItemClick);
	});
};
