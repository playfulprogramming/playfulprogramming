<!-- App.vue -->
<script setup>
const vStyleBackground = {
	mounted: (el, binding) => {
		el.style.background = binding.value;
	},
};
</script>

<template>
	<button v-style-background="'#FFAEAE'">Hello, world</button>
</template>
