<!-- App.vue -->
<script setup>
function logEl(el) {
	console.log(el);
}
</script>

<template>
	<p :ref="logEl">Check your console</p>
</template>
