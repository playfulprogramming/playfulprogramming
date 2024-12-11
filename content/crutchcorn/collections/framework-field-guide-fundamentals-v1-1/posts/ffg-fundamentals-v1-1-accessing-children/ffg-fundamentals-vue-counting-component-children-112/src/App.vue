<!-- App.vue -->
<script setup>
import ParentList from "./ParentList.vue";

const list = [1, 2, 3];
</script>

<template>
	<ParentList :list="list">
		<li v-for="i in list">Item {{ i }}</li>
	</ParentList>
</template>
