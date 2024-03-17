function throttle<A extends unknown[]>(
	callback: (this: unknown, ...args: A) => void,
	limit: number,
): (this: unknown, ...args: A) => void {
	let waiting = false;
	return function (...props) {
		if (!waiting) {
			callback.apply(this, props);
			waiting = true;
			setTimeout(function () {
				waiting = false;
			}, limit);
		}
	};
}

export const enableColorChangeListeners = () => {
	const colorContainers: HTMLElement[] = Array.from(
		document.querySelectorAll("[data-change-color-to]"),
	);

	const containerPairs = colorContainers;

	const calculateContainerSizes = () => {
		return containerPairs
			.map((vals) => {
				const { top, height } = vals.getBoundingClientRect();

				const trueTop =
					top +
					document.documentElement.scrollTop -
					(document.documentElement.clientTop || 0);

				const color = vals.dataset.changeColorTo as "fund";

				return {
					...vals,
					color,
					trueTop,
					height,
				};
			})
			.sort((a, b) => (a.trueTop < b.trueTop ? -1 : 1));
	};

	let colorContainerTransitions = calculateContainerSizes();

	const colorSets = [
		"050",
		"100",
		"200",
		"300",
		"400",
		"500",
		"600",
		"700",
		"800",
		"900",
	];

	const interTokens = colorSets.map((colorNum) => `--inter-${colorNum}-base`);
	const ecosTokens = colorSets.map((colorNum) => `--ecos-${colorNum}-base`);
	const fundTokens = colorSets.map((colorNum) => `--fund-${colorNum}-base`);
	const slateTokens = colorSets.map((colorNum) => `--slate-${colorNum}-base`);

	const computedStyle = window.getComputedStyle(document.documentElement);
	const initialInterTokenValues = interTokens.map((token) =>
		computedStyle.getPropertyValue(token),
	);
	const initialEcosTokenValues = ecosTokens.map((token) =>
		computedStyle.getPropertyValue(token),
	);
	const initialFundTokenValues = fundTokens.map((token) =>
		computedStyle.getPropertyValue(token),
	);
	const initialSlateTokenValues = slateTokens.map((token) =>
		computedStyle.getPropertyValue(token),
	);

	let windowsInnerHeight = window.innerHeight;

	window.addEventListener("resize", () => {
		windowsInnerHeight = window.innerHeight;
	});

	function changeColorSetTo(
		colorSetToChangeTo: "fund" | "ecos" | "slate" | "inter",
	) {
		switch (colorSetToChangeTo) {
			case "fund": {
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index],
					);
				});
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index],
					);
				});
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index],
					);
				});
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index],
					);
				});
				break;
			}
			case "ecos": {
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index],
					);
				});
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index],
					);
				});
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index],
					);
				});
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index],
					);
				});
				break;
			}
			case "inter": {
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index],
					);
				});
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index],
					);
				});
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index],
					);
				});
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index],
					);
				});
				break;
			}
			default:
			case "slate": {
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index],
					);
				});
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index],
					);
				});
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index],
					);
				});
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index],
					);
				});
				break;
			}
		}
	}

	function checkPassiveScrollPositionAndColor() {
		const scrollTop = document.documentElement.scrollTop;

		const scrolledHalfwayUpScreen = scrollTop + windowsInnerHeight / 2;

		let dataIndex = colorContainerTransitions.findIndex((transitionData) => {
			const topOfSection = transitionData.trueTop;
			const bottomOfSection = transitionData.trueTop + transitionData.height;
			return (
				scrolledHalfwayUpScreen >= topOfSection &&
				scrolledHalfwayUpScreen <= bottomOfSection
			);
		});
		if (dataIndex === -1) {
			if (scrollTop <= colorContainerTransitions[0].trueTop) {
				dataIndex = 0;
			} else {
				dataIndex = colorContainerTransitions.length - 1;
			}
		}
		changeColorSetTo(colorContainerTransitions[dataIndex].color);
	}

	const throttledPassiveScrollColorChange = throttle(
		checkPassiveScrollPositionAndColor,
		20,
	);

	function onResize() {
		colorContainerTransitions = calculateContainerSizes();
		checkPassiveScrollPositionAndColor();
	}

	const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

	if (!mediaQuery.matches) {
		window.addEventListener("scroll", throttledPassiveScrollColorChange);
		window.addEventListener("touchmove", throttledPassiveScrollColorChange);
		window.addEventListener("resize", onResize);

		throttledPassiveScrollColorChange();
	}
	mediaQuery.addEventListener("change", () => {
		if (mediaQuery.matches) {
			window.removeEventListener("scroll", throttledPassiveScrollColorChange);
			window.removeEventListener(
				"touchmove",
				throttledPassiveScrollColorChange,
			);
			window.removeEventListener("resize", onResize);
		} else {
			window.addEventListener("scroll", throttledPassiveScrollColorChange);
			window.addEventListener("touchmove", throttledPassiveScrollColorChange);
			window.addEventListener("resize", onResize);
		}
	});
};
