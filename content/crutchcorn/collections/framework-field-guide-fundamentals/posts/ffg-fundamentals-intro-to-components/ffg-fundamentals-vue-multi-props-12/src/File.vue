<!-- File.vue -->
<script setup>
import FileDate from "./FileDate.vue";
const props = defineProps(["fileName", "href"]);
</script>

<template>
	<div>
		<a :href="props.href">{{ props.fileName }}<FileDate /></a>
	</div>
</template>
