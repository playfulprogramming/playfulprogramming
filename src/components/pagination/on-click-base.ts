export const onSoftNavClick =
	(softNavigate: (href: string, pageNum: number) => void, pageNum: number) =>
	(e: MouseEvent) => {
		let link = e.target as HTMLElement | null;
		// Could click on a child element of an anchor
		while (link && !(link instanceof HTMLAnchorElement)) {
			link = link.parentElement;
		}

		if (!link) return;

		let sameOrigin = link.origin === location.origin;
		// Sidestep this check for tests, since tests cannot figure out what our proper origin is
		if (globalThis["inTestSuite" as never]) {
			sameOrigin = true;
		}

		if (
			link instanceof HTMLAnchorElement &&
			link.href &&
			(!link.target || link.target === "_self") &&
			sameOrigin &&
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
