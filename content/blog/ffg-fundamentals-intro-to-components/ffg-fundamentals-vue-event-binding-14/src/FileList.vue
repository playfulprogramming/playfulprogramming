<!-- FileList.vue -->
<script setup>
import File from "./File.vue";
</script>

<template>
	<ul>
		<li><File :fileName="'File one'" /></li>
		<li><File :fileName="'File two'" /></li>
		<li><File :fileName="'File three'" /></li>
	</ul>
</template>
