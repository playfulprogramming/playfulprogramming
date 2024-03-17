// use-window-size.js
import { ref } from "vue";

export const useWindowSize = () => {
	const height = ref(window.innerHeight);
	const width = ref(window.innerWidth);
	return { height, width };
};
