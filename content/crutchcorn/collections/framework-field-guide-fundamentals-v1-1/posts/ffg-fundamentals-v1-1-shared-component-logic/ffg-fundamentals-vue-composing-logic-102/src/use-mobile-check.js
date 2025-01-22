// use-mobile-check.js
import { computed } from "vue";
import { useWindowSize } from "./use-window-size.js";

export const useMobileCheck = () => {
	const { height, width } = useWindowSize();
	const isMobile = computed(() => {
		if (width.value <= 480) return true;
		else return false;
	});

	return { isMobile };
};
