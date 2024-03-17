<!-- WindowSize.vue -->
<script setup>
import { ref } from "vue";

const height = ref(window.innerHeight);
const width = ref(window.innerWidth);

function resizeHandler() {
	height.value = window.innerHeight;
	width.value = window.innerWidth;
}
</script>

<template>
	<!-- This code doesn't work, we'll explain why soon -->
	<div @resize="resizeHandler()">
		<p>Height: {{ height }}</p>
		<p>Width: {{ width }}</p>
	</div>
</template>
