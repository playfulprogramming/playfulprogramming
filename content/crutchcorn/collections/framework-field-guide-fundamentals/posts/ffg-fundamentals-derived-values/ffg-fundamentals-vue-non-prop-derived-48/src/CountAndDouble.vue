<!-- CountAndDouble.vue -->
<script setup>
import { ref, computed } from "vue";

const number = ref(0);

function addOne() {
	number.value++;
}

const doubleNum = computed(() => number.value * 2);
</script>

<template>
	<div>
		<p>{{ number }}</p>
		<p>{{ doubleNum }}</p>
		<button @click="addOne()">Add one</button>
	</div>
</template>
