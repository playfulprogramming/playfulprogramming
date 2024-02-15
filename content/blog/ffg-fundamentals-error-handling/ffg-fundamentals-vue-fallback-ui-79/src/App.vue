<!-- App.vue -->
<script setup>
import { onErrorCaptured, ref } from "vue";

import Child from "./Child.vue";

const hadError = ref(false);

onErrorCaptured((err, instance, info) => {
	console.log(err, instance, info);
	hadError.value = true;
	return false;
});
</script>

<template>
	<p v-if="hadError">An error occurred</p>
	<Child v-if="!hadError" />
</template>
