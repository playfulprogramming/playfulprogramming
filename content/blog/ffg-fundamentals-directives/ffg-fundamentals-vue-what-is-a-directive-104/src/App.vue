<!-- App.vue -->
<script setup>
const vSayHi = {
	created: () => console.log("Hello, world!"),
};
</script>

<template>
	<p v-say-hi>Hello, world</p>
</template>
