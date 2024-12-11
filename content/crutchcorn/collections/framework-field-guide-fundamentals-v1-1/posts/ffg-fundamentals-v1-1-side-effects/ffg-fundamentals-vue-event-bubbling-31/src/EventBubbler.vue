<!-- EventBubbler.vue -->
<script setup>
const logMessage = () => alert("Clicked!");
</script>

<template>
	<div @click="logMessage()">
		<p>
			<span style="color: red">Click me</span> or even
			<span style="background: green; color: white">me</span>!
		</p>
	</div>
</template>
