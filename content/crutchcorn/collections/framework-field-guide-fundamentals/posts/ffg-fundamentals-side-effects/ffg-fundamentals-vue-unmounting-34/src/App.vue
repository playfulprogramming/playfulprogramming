<script setup>
import { ref } from "vue";
import Cleanup from "./Cleanup.vue";

const show = ref(true);

const toggle = () => {
	show.value = !show.value;
};
</script>

<template>
	<div>
		<button @click="toggle">Toggle</button>
		<Cleanup v-if="show" />
	</div>
</template>
