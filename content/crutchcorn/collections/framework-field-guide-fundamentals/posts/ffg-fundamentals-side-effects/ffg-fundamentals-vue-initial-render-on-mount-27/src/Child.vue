<!-- Child.vue -->
<script setup>
import { onMounted } from "vue";

onMounted(() => {
	console.log("I am initialized");
});
</script>

<template>
	<p>I am the child</p>
</template>
