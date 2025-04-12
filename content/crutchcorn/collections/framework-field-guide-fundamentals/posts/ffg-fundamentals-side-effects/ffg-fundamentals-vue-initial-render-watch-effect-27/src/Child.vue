<!-- Child.vue -->
<script setup>
import { watchEffect } from "vue";

watchEffect(() => {
	console.log("I am initialized");
});
</script>

<template>
	<p>I am the child</p>
</template>
