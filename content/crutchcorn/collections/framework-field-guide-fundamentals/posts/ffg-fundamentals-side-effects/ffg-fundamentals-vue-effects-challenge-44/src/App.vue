<!-- App.vue -->
<script setup>
import DarkModeToggle from "./DarkModeToggle.vue";
</script>

<template>
	<div>
		<DarkModeToggle />
		<p style="color: var(--primary)">This text is blue</p>
	</div>
</template>

<style>
:root {
	--primary: #1a42e5;
}

.dark {
	background: #121926;
	color: #d6e4ff;
	--primary: #6694ff;
}
</style>
