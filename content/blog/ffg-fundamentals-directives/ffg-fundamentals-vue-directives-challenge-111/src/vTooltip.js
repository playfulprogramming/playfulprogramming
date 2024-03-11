// vTooltip.js
export const vTooltip = {
	beforeMount: (el) => {
		el.style.display = "none";
	},
	mounted: (el, binding) => {
		const baseEl = binding.value.current;
		el.classList.add("tooltip");

		baseEl.addEventListener("mouseenter", () => {
			const baseRect = baseEl.getBoundingClientRect();

			el.style.left = `${baseRect.left}px`;
			el.style.top = `${baseRect.bottom}px`;
			el.style.display = "block";
		});

		baseEl.addEventListener("mouseleave", () => {
			el.style.display = "none";
		});
	},
};
