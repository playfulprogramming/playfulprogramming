function throttle(callback, limit) {
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
		document.querySelectorAll("[data-change-color-to]")
	);

	const generateArrayPairChain = (arr: HTMLElement[]) => {
		const result = [] as Array<{ from: HTMLElement; to: HTMLElement }>;
		for (let i = 0; i < arr.length; i += 1) {
			if (!arr[i + 1]) return result;
			result.push({ from: arr[i], to: arr[i + 1] });
		}
		return result;
	};

	const colorContainerTransitions = generateArrayPairChain(colorContainers)
		.map((vals) => {
			const { top: topFrom, height: heightFrom } =
				vals.from.getBoundingClientRect();

			const trueTopFrom =
				topFrom +
				document.documentElement.scrollTop -
				(document.documentElement.clientTop || 0);

			const { top: topTo, height: heightTo } = vals.to.getBoundingClientRect();

			const trueTopTo =
				topTo +
				document.documentElement.scrollTop -
				(document.documentElement.clientTop || 0);

			const fromColor = vals.from.dataset.changeColorTo as "fund";
			const toColor = vals.to.dataset.changeColorTo as "fund";
			return {
				...vals,
				fromColor,
				toColor,
				trueTopFrom,
				trueTopTo,
				heightFrom,
				heightTo,
			};
		})
		.sort((a, b) => (a.trueTopFrom < b.trueTopFrom ? -1 : 1));

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
		computedStyle.getPropertyValue(token)
	);
	const initialEcosTokenValues = ecosTokens.map((token) =>
		computedStyle.getPropertyValue(token)
	);
	const initialFundTokenValues = fundTokens.map((token) =>
		computedStyle.getPropertyValue(token)
	);
	const initialSlateTokenValues = slateTokens.map((token) =>
		computedStyle.getPropertyValue(token)
	);

	let windowsInnerHeight = window.innerHeight;

	window.addEventListener("resize", () => {
		windowsInnerHeight = window.innerHeight;
	});

	function changeColorSetTo(
		colorSetToChangeTo: "fund" | "ecos" | "slate" | "inter"
	) {
		switch (colorSetToChangeTo) {
			case "fund": {
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index]
					);
				});
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index]
					);
				});
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index]
					);
				});
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialFundTokenValues[index]
					);
				});
				break;
			}
			case "ecos": {
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index]
					);
				});
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index]
					);
				});
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index]
					);
				});
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialEcosTokenValues[index]
					);
				});
				break;
			}
			case "inter": {
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index]
					);
				});
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index]
					);
				});
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index]
					);
				});
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialInterTokenValues[index]
					);
				});
				break;
			}
			default:
			case "slate": {
				slateTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index]
					);
				});
				ecosTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index]
					);
				});
				fundTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index]
					);
				});
				interTokens.forEach((tokenName, index) => {
					document.documentElement.style.setProperty(
						tokenName,
						initialSlateTokenValues[index]
					);
				});
				break;
			}
		}
	}

	function checkColorToSetTo({
		scrollTop,
		transitionData,
		i,
	}: {
		scrollTop: number;
		transitionData: typeof colorContainerTransitions[0];
		i: number;
	}) {
		const halfScreenHeight = windowsInnerHeight / 2;

		if (transitionData.trueTopTo < scrollTop + halfScreenHeight) {
			if (i === colorContainerTransitions.length - 1) {
				changeColorSetTo(transitionData.toColor);
				return;
			}

			changeColorSetTo(transitionData.toColor);
		} else if (transitionData.trueTopFrom < scrollTop - halfScreenHeight) {
			changeColorSetTo(transitionData.fromColor);
		} else if (i === 0 && scrollTop < transitionData.trueTopFrom) {
			changeColorSetTo(transitionData.fromColor);
		}
	}

	let timeout;
	function checkPassiveScrollPositionAndColor() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			const scrollTop = document.documentElement.scrollTop;

			let dataIndex = colorContainerTransitions.findIndex((transitionData) => {
				return transitionData.trueTopFrom >= scrollTop;
			});
			if (dataIndex === -1) {
				dataIndex = colorContainerTransitions.length - 1;
			}
			checkColorToSetTo({
				transitionData: colorContainerTransitions[dataIndex],
				i: dataIndex,
				scrollTop,
			});
		}, 10);
	}

	const throttledPassiveScrollColorChange = throttle(
		checkPassiveScrollPositionAndColor,
		20
	);
	window.addEventListener("scroll", throttledPassiveScrollColorChange);
	window.addEventListener("touchmove", throttledPassiveScrollColorChange);

	throttledPassiveScrollColorChange();

	const listenForEvents = (i: number) => {
		const checkPositionAndChangeColor = () => {
			const transitionData = colorContainerTransitions[i];
			const scrollTop = document.documentElement.scrollTop;

			if (scrollTop > transitionData.trueTopFrom + transitionData.heightFrom) {
				return;
			}

			checkColorToSetTo({
				scrollTop,
				transitionData,
				i,
			});
		};
		const throttledScrollColorChange = throttle(
			checkPositionAndChangeColor,
			20
		);
		window.addEventListener("scroll", throttledScrollColorChange);
		window.addEventListener("touchmove", throttledScrollColorChange);
	};

	for (let i = 0; i < colorContainerTransitions.length; i++) {
		listenForEvents(i);
	}
};
