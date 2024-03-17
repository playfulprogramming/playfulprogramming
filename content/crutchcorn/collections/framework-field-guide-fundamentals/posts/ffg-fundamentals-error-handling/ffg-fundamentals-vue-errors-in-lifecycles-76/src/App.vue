<!-- App.vue -->
<script setup>
import { onMounted } from "vue";

onMounted(() => {
	// Will not prevent `Hello, world!` from showing
	throw new Error("New error");
});
</script>

<template>
	<p>Hello, world!</p>
</template>
