<!-- App.vue -->
<script setup>
const items = [
	{ id: 1, name: "Take out the trash", priority: 1 },
	{ id: 2, name: "Cook dinner", priority: 1 },
	{ id: 3, name: "Play video games", priority: 2 },
];

const priorityItems = items.filter((item) => item.item.priority === 1);
</script>

<template>
	<h1>To-do items</h1>
	<ul>
		<li v-for="item of priorityItems" :key="item.id">{{ item.name }}</li>
	</ul>
</template>
