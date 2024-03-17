<!-- File.vue -->
<script setup>
import FileDate from "./FileDate.vue";
const props = defineProps(["fileName", "href"]);
const inputDate = new Date();
</script>

<template>
	<div>
		<a :href="props.href"
			>{{ props.fileName }}
			<FileDate :inputDate="inputDate" />
		</a>
	</div>
</template>
