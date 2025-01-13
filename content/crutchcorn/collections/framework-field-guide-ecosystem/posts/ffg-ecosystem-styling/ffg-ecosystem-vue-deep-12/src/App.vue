<script setup>
import Card from "./Card.vue"
</script>

<template>
	<ul>
		<li class="red-card">
			<Card title="Red Card" description="Description 1"/>
		</li>
		<li class="blue-card">
			<Card title="Blue Card" description="Description 2"/>
		</li>
		<li class="green-card">
			<Card title="Green Card" description="Description 3"/>
		</li>
	</ul>
</template>

<style scoped>
ul {
	display: flex;
	list-style: none;
}

.red-card :deep([data-title]) {
	color: red;
}

.blue-card :deep([data-title]) {
	color: blue;
}

.green-card :deep([data-title]) {
	color: green;
}
</style>
