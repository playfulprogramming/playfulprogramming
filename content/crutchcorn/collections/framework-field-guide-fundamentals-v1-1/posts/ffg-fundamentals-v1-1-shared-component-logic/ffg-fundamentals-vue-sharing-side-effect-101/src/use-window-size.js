// use-window-size.js
import { onMounted, onUnmounted, ref } from "vue";

export const useWindowSize = () => {
	const height = ref(window.innerHeight);
	const width = ref(window.innerWidth);

	function onResize() {
		height.value = window.innerHeight;
		width.value = window.innerWidth;
	}

	onMounted(() => {
		window.addEventListener("resize", onResize);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});

	return { height, width };
};
