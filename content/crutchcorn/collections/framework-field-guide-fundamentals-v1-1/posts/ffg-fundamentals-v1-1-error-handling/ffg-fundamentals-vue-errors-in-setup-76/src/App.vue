<!-- App.vue -->
<script setup>
import { watchEffect, computed } from "vue";

// This will prevent rendering
watchEffect(() => {
	throw new Error("New error in effect");
});

// This will also prevent rendering
const result = computed(() => {
	throw new Error("New error in computed");
});

// "computed" is lazy, meaning that it will not throw the error
//     (or compute a result) unless the value is used, like so:
console.log(result.value);
</script>

<template>
	<p>Hello, world!</p>
</template>
