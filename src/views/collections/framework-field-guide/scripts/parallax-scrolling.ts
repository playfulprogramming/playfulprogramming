// https://github.com/wuct/raf-throttle/blob/master/rafThrottle.js
function rafThrottle<A extends unknown[]>(
	callback: (this: unknown, ...args: A) => void,
): (this: unknown, ...args: A) => void {
	let requestId: number | null = null;

	let lastArgs: A;

	const later = (context: unknown) => () => {
		requestId = null;
		callback.apply(context, lastArgs);
	};

	return function (...args: A) {
		lastArgs = args;
		if (requestId === null) {
			requestId = requestAnimationFrame(later(this));
		}
	};
}

// Thanks https://easings.net/
function easeOutExpo(x: number): number {
	return x === 1 ? 1 : 1 - 2 ** (-10 * x);
}

export const enableParallaxScrolling = () => {
	const els = Array.from(
		document.querySelectorAll("[data-move-on-scroll-by]"),
	) as HTMLElement[];
	const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

	const getElTops = () =>
		els.map((el) => {
			el.style.transform = "";
			const { top: topRect, height } = el.getBoundingClientRect();

			let top =
				topRect +
				document.documentElement.scrollTop -
				(document.documentElement.clientTop || 0);

			// Keep this value around for the same 'innerHeight' calculation for later
			const trueTop = top;

			// If the item is below the upper fold, let's go ahead and start listening at 50% of the screen height, when the element is visible
			if (top >= window.innerHeight) {
				// Start animating once the element is midway down the screen
				top = top - (window.innerHeight - height) / 2;
			}

			const moveOnScrollBy = Number(el.dataset.moveOnScrollBy);

			const parentHeight = el.parentElement!.clientHeight;

			return { top, trueTop, moveOnScrollBy, parentHeight };
		});

	let initialElTops = getElTops();

	let windowWidth = window.innerWidth;

	window.addEventListener("resize", () => {
		windowWidth = window.innerWidth;
		initialElTops = getElTops();
		moveItems();
	});

	function moveItems() {
		// Do not parallax on mobile
		if (windowWidth < 600) return;
		const scrollTop = document.documentElement.scrollTop;
		for (let i = 0; i < els.length; i++) {
			const el = els[i];
			const { top, trueTop, moveOnScrollBy, parentHeight } = initialElTops[i];

			// If the element is above the fold, start running immediately
			const disableTop = trueTop < window.innerHeight;

			const topCalc = disableTop ? 0 : top;

			let px = (scrollTop - topCalc) * moveOnScrollBy;

			// Only allow the animation to go up by 10% of the height of the element at most
			const maximumNegativeAllowed = 0 - parentHeight * 0.4 * moveOnScrollBy;

			if (top >= window.innerHeight) {
				if (px > maximumNegativeAllowed && px < -1) {
					const positivePx = 0 - px;
					const positiveMaxAllowed = 0 - maximumNegativeAllowed;

					const multiplier = easeOutExpo(positivePx / positiveMaxAllowed);
					px = px * multiplier;
				}

				if (px < maximumNegativeAllowed) {
					px = maximumNegativeAllowed;
				}
			}

			el.style.transform = `translateY(${px}px)`;
		}
	}

	const throttledMoveItems = rafThrottle(moveItems);
	if (!mediaQuery.matches) {
		window.addEventListener("scroll", throttledMoveItems);
		window.addEventListener("touchmove", throttledMoveItems);
	}
	mediaQuery.addEventListener("change", () => {
		if (mediaQuery.matches) {
			els.forEach((el: HTMLElement) => (el.style.transform = ""));
			window.removeEventListener("scroll", throttledMoveItems);
			window.removeEventListener("touchmove", throttledMoveItems);
		} else {
			window.addEventListener("scroll", throttledMoveItems);
			window.addEventListener("touchmove", throttledMoveItems);
		}
	});
};
