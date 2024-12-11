<!-- KeyExample.vue -->
<script setup>
import { ref } from "vue";

const num = ref(0);

function increase() {
	num.value++;
}
</script>

<template>
	<input :key="num" />
	<button @click="increase()">Increase</button>
	<p>{{ num }}</p>
</template>
