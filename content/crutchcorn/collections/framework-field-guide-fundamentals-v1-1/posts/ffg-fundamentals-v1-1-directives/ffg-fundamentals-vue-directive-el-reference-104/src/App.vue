<!-- App.vue -->
<script setup>
const vSayHi = {
	created: (el) => console.log(el),
};
</script>

<template>
	<p v-say-hi>Hello, world</p>
</template>
