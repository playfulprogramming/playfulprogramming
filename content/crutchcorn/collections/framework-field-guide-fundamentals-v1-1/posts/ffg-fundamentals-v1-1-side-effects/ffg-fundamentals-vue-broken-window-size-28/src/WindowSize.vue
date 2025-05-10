<!-- WindowSize.vue -->
<script setup>
const height = window.innerHeight;
const width = window.innerWidth;
</script>

<template>
	<div>
		<p>Height: {{ height }}</p>
		<p>Width: {{ width }}</p>
	</div>
</template>
