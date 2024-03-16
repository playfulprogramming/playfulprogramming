<!-- Child.vue -->
<script setup>
import { onMounted } from "vue";

onMounted(() => {
	console.log("I am rendering");
});
</script>

<template>
	<p>I am the child</p>
</template>
