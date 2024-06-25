<!-- WindowSize.vue -->
<script setup>
import { ref, onMounted } from "vue";

const height = ref(window.innerHeight);
const width = ref(window.innerWidth);

function resizeHandler() {
	height.value = window.innerHeight;
	width.value = window.innerWidth;
}

onMounted(() => {
	// This code will cause a memory leak, more on that soon
	window.addEventListener("resize", resizeHandler);
});
</script>

<template>
	<div>
		<p>Height: {{ height }}</p>
		<p>Width: {{ width }}</p>
	</div>
</template>
