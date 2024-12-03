<!-- FileList.vue -->
<script setup>
import File from "./File.vue";
</script>

<template>
	<ul>
		<li><File :fileName="'File one'" :href="'/file/file_one'" /></li>
		<li><File :fileName="'File two'" :href="'/file/file_two'" /></li>
		<li><File :fileName="'File three'" :href="'/file/file_three'" /></li>
	</ul>
</template>
