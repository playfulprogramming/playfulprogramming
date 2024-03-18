export const onSoftNavClick =
	(softNavigate: (href: string, pageNum: number) => void, pageNum: number) =>
	(e: MouseEvent) => {
		let link = e.target as HTMLElement | null;
		// Could click on a child element of an anchor
		while (link && !(link instanceof HTMLAnchorElement)) {
			link = link.parentElement;
		}

		if (!link) return;

		if (
			link instanceof HTMLAnchorElement &&
			link.href &&
			(!link.target || link.target === "_self") &&
			link.origin === location.origin &&
			e.button === 0 && // left click only
			!e.metaKey && // open in new tab (mac)
			!e.ctrlKey && // open in new tab (windows)
			!e.altKey && // download
			!e.shiftKey && // open in new window
			!e.defaultPrevented
		) {
			e.preventDefault();
			softNavigate(link.href, pageNum);
		}
	};
