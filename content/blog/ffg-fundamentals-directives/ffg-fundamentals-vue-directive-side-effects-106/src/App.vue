<!-- App.vue -->
<script setup>
const vFocusElement = {
	mounted: (el) => {
		el.focus();
	},
};
</script>

<template>
	<button v-focus-element>Hello, world</button>
</template>
