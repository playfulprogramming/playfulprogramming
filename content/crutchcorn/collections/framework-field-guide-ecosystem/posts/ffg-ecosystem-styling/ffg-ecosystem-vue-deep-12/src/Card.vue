<script setup>
const props = defineProps(["title", "description"]);
</script>

<template>
	<div class="card">
		<h2 data-title>{{ props.title }}</h2>
		<p>{{ props.description }}</p>
	</div>
</template>

<style scoped>
.card {
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 16px;
	margin: 16px;
}
</style>
