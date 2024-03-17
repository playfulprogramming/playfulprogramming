// use-outside-click.js
import { onMounted, onUnmounted } from "vue";

export const useOutsideClick = ({ ref, onClose }) => {
	const closeIfOutsideOfContext = (e) => {
		const isClickInside = ref.value.contains(e.target);
		if (isClickInside) return;
		onClose();
	};

	onMounted(() => {
		document.addEventListener("click", closeIfOutsideOfContext);
	});

	onUnmounted(() => {
		document.removeEventListener("click", closeIfOutsideOfContext);
	});
};
