// use-bounds.js
import { ref, onMounted, onUnmounted } from "vue";

export const useBounds = () => {
	const elRef = ref();

	const bounds = ref({
		height: 0,
		width: 0,
		x: 0,
		y: 0,
	});

	function resizeListener() {
		if (!elRef.value) return;
		bounds.value = elRef.value.getBoundingClientRect();
	}
	onMounted(() => {
		resizeListener();
		window.addEventListener("resize", resizeListener);
	});
	onUnmounted(() => {
		window.removeEventListener("resize", resizeListener);
	});

	return { bounds, ref: elRef };
};
