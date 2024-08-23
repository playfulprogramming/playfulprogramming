<!-- ReRenderListener.vue -->
<script setup>
import { ref, onUpdated } from "vue";

const count = ref(0);

const add = () => {
	count.value++;
};

onUpdated(() => {
	console.log("Component was painted");
});
</script>

<template>
	<button @click="add()">{{ count }}</button>
</template>
