<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
	<button @click="count++">Add one to: {{ count }}</button>
	<button @click="count--">Remove one from: {{ count }}</button>
	<ul id="list">
		<li v-for="(_, i) of [].constructor(count)">List item {{ i }}</li>
	</ul>
</template>
