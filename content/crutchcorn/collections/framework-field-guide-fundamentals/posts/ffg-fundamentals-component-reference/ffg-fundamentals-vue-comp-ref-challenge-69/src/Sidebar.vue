<!-- Sidebar.vue -->
<script setup>
import { ref } from "vue";

const emits = defineEmits(["toggle"]);

const isCollapsed = ref(false);

const setAndToggle = (v) => {
	isCollapsed.value = v;
	emits("toggle", v);
};

const collapse = () => {
	setAndToggle(true);
};

const expand = () => {
	setAndToggle(false);
};

const toggleCollapsed = () => {
	setAndToggle(!isCollapsed.value);
};

defineExpose({
	expand,
	collapse,
	isCollapsed,
});
</script>

<template>
	<button v-if="isCollapsed" @click="toggleCollapsed()">Toggle</button>
	<div v-if="!isCollapsed">
		<button @click="toggleCollapsed()">Toggle</button>
		<ul style="padding: 1rem">
			<li>List item 1</li>
			<li>List item 2</li>
			<li>List item 3</li>
			<li>List item 4</li>
			<li>List item 5</li>
			<li>List item 6</li>
		</ul>
	</div>
</template>
