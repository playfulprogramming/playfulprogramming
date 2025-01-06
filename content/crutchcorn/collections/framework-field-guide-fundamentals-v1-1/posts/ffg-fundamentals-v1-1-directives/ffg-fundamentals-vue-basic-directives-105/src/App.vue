<!-- App.vue -->
<script setup>
const vStyleBackground = {
	created: (el) => {
		el.style.background = "red";
	},
};
</script>

<template>
	<button v-style-background>Hello, world</button>
</template>
