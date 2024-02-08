<!-- App.vue -->
<script setup>
import { onErrorCaptured } from "vue";

import Child from "./Child.vue";

onErrorCaptured((err, instance, info) => {
	console.log(err, instance, info);
	return false;
});
</script>

<template>
	<Child />
</template>
