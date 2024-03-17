<!-- App.vue -->
<script setup>
import { onErrorCaptured, ref } from "vue";

import Child from "./Child.vue";

const error = ref(null);

onErrorCaptured((err, instance, info) => {
	console.log(err, instance, info);
	error.value = err;
	return false;
});

// JSON.stringify-ing an Error object provides `{}`.
// This function fixes that
const getErrorString = (err) =>
	JSON.stringify(err, Object.getOwnPropertyNames(err));
</script>

<template>
	<div v-if="error">
		<h1>You got an error:</h1>
		<pre
			style="white-space: pre-wrap"
		><code>{{ getErrorString(error) }}</code></pre>
	</div>
	<Child v-if="!error" />
</template>
