import { useLayoutEffect, useState } from "preact/hooks";

interface UseElementSizeProps {
	includeMargin?: boolean;
}

export const useElementSize = ({
	includeMargin = true,
}: UseElementSizeProps = {}) => {
	const [el, setEl] = useState<HTMLElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useLayoutEffect(() => {
		if (!el) return;
		function getHeaderHeight() {
			const style = window.getComputedStyle(el);
			let calculatedHeight = el.offsetHeight;
			let calculatedWidth = el.offsetWidth;

			if (includeMargin) {
				calculatedHeight +=
					parseInt(style.marginTop) + parseInt(style.marginBottom);
				calculatedWidth +=
					parseInt(style.marginLeft) + parseInt(style.marginRight);
			}
			setSize({ height: calculatedHeight, width: calculatedWidth });
		}

		window.addEventListener("resize", getHeaderHeight);
		getHeaderHeight();
		return () => window.removeEventListener("resize", getHeaderHeight);
	}, [el]);

	return { setEl, size };
};
