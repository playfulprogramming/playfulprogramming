<!-- App.vue -->
<script setup>
const vStyleBackground = {
	mounted: (el, binding) => {
		const color = binding.value;
		el.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
	},
};
</script>

<template>
	<button v-style-background="{ r: 255, g: 174, b: 174 }">Hello, world</button>
</template>
