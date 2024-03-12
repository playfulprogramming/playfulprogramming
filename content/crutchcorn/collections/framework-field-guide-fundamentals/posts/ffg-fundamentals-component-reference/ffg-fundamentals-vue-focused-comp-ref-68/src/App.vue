<!-- App.vue -->
<script setup>
import { ref } from "vue";
import ContextMenu from "./ContextMenu.vue";

const isOpen = ref(false);

const mouseBounds = ref({
	x: 0,
	y: 0,
});

const contextMenu = ref();

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
	setTimeout(() => {
		contextMenu.value.focusMenu();
	}, 0);
};
</script>

<template>
	<div style="margin-top: 5rem; margin-left: 5rem">
		<div @contextmenu="open($event)">Right click on me!</div>
	</div>
	<ContextMenu
		ref="contextMenu"
		:isOpen="isOpen"
		:x="mouseBounds.x"
		:y="mouseBounds.y"
		@close="close()"
	/>
</template>
