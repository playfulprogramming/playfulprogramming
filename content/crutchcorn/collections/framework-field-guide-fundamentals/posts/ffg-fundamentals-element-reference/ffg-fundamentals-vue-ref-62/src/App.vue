<!-- App.vue -->
<script setup>
import { ref, onMounted } from "vue";

// Assign the ref
const el = ref();

// Use the ref
onMounted(() => {
	console.log(el.value);
});
</script>

<template>
	<p ref="el">Check your console</p>
</template>
