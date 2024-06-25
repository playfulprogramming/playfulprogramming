<!-- App.vue -->
<script setup>
import { ref } from "vue";
import ContextMenu from "./ContextMenu.vue";

const isOpen = ref(false);

const mouseBounds = ref({
	x: 0,
	y: 0,
});

const close = () => {
	isOpen.value = false;
};

const open = (e) => {
	e.preventDefault();
	isOpen.value = true;
	mouseBounds.value = {
		x: e.clientX,
		y: e.clientY,
	};
};
</script>

<template>
	<div style="margin-top: 5rem; margin-left: 5rem">
		<div @contextmenu="open($event)">Right click on me!</div>
	</div>
	<ContextMenu
		:isOpen="isOpen"
		:x="mouseBounds.x"
		:y="mouseBounds.y"
		@close="close()"
	/>
</template>
