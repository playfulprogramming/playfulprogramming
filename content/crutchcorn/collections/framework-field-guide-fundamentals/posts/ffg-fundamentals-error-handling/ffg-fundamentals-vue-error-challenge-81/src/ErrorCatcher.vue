<script setup>
import { onErrorCaptured, ref, computed } from "vue";

const error = ref(null);

const mailTo = "dev@example.com";
const header = "Bug Found";
const message = computed(() =>
	!error.value
		? ""
		: `
      There was a bug found of type: "${error.value.name}".

      The message was: "${error.value.message}".

      The stack trace is:

      """
      ${error.value.stack}
      """
      `.trim(),
);

const encodedMsg = computed(() => encodeURIComponent(message.value));

const encodedHeader = encodeURIComponent(header);

const href = computed(
	() => `mailto:${mailTo}&subject=${encodedHeader}&body=${encodedMsg.value}`,
);

onErrorCaptured((err, instance, info) => {
	error.value = err;
	return false;
});
</script>

<template>
	<div v-if="error">
		<h1>{{ error.name }}</h1>
		<pre><code>{{error.message}}</code></pre>
		<a :href="href">Email us to report the bug</a>
		<br />
		<br />
		<details>
			<summary>Error stack</summary>
			<pre><code>{{error.stack}}</code></pre>
		</details>
	</div>
	<slot v-if="!error" />
</template>
