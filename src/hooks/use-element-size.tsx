import { useLayoutEffect, useState } from "preact/hooks";

interface UseElementSizeProps {
	includeMargin?: boolean;
}

export const useElementSize = ({
	includeMargin = true,
}: UseElementSizeProps = {}) => {
	const [el, setEl] = useState<HTMLElement | null>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useLayoutEffect(() => {
		if (!el) return;
		function getElementSize() {
			if (!el) return;
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

		window.addEventListener("resize", getElementSize);
		getElementSize();
		return () => window.removeEventListener("resize", getElementSize);
	}, [el]);

	return { setEl, size };
};
