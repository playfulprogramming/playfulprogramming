<!-- ErrorThrowing.vue -->
<script setup>
const onClick = () => {
	throw new Error("Error");
};
</script>

<template>
	<button @click="onClick()">Click me</button>
</template>
