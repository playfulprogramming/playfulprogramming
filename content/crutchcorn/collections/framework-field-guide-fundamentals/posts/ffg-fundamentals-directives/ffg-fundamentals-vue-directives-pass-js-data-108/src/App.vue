<!-- App.vue -->
<script setup>
class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

const colorInstance = new Color(255, 174, 174);

const vStyleBackground = {
	mounted: (el, binding) => {
		const color = binding.value;
		el.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
	},
};
</script>

<template>
	<button v-style-background="colorInstance">Hello, world</button>
</template>
