import styles from "./table-of-contents-mobile.module.scss";

export const setupMobileTableOfContentsHandleClick = () => {
	const mainBody = document.getElementsByTagName("body")[0];
	const mainPageContents = document.querySelector<HTMLElement>(
		"[data-article-page-contents]",
	);

	const mobileTableOfContentsMenu = document.querySelector<HTMLElement>(
		"[data-mobile-table-of-contents-menu]",
	);

	const mobileTableOfContentsMenuHeader = document.querySelector<HTMLElement>(
		"[data-mobile-table-of-contents-menu-header-bar]",
	);

	const mobileTableOfContentsMenuList = document.querySelector<HTMLElement>(
		"[data-mobile-table-of-contents-menu-list]",
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

	const handleMenuItemClick = (event: MouseEvent) => {
		event.preventDefault();

		toggleMenuExpanded();
		scrollPageToMenuItem(event.target as HTMLAnchorElement);
	};

	mobileTableOfContentsMenuHeader?.addEventListener(
		"click",
		toggleMenuExpanded,
	);

	mobileTableOfContentsMenuListItems?.forEach((menuItem) => {
		menuItem.addEventListener("click", handleMenuItemClick);
	});
};
