<!-- App.vue -->
<script setup>
import { onErrorCaptured } from "vue";

import Child from "./Child.vue";

onErrorCaptured((err, instance, info) => {
	// Do something with the error
	console.log(err, instance, info);
});
</script>

<template>
	<Child />
</template>
