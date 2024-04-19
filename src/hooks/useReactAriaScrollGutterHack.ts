import { useLayoutEffect } from "preact/hooks";

/**
 * bandaid solution for layout shift
 *
 * https://github.com/adobe/react-spectrum/issues/5470
 * https://github.com/adobe/react-spectrum/issues/1216
 * TODO: remove this padding-right whenever we have a better solution or react aria fixes the issue
 */
export function useReactAriaScrollGutterHack() {
	useLayoutEffect(() => {
		const updateStyles = () => {
			if (CSS.supports("scrollbar-gutter: stable")) {
				document.documentElement.style.paddingRight = "0";
			}
		};

		// immediately invoke to set the styles we want
		updateStyles();

		// Observe attribute changes to apply styles as needed
		const mutationObserver = new MutationObserver(updateStyles);
		mutationObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["style"],
			subtree: false,
			attributeOldValue: false,
		});

		return () => {
			// Clean up observer on component unmount
			mutationObserver.disconnect();
		};
	}, []);
}
