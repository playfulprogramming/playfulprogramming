<!-- File.vue -->
<script setup>
import { ref } from "vue";
import ContextMenu from "./ContextMenu.vue";

const props = defineProps(["name", "id"]);

const mouseBounds = ref({
	x: 0,
	y: 0,
});
const isOpen = ref(false);

const setIsOpen = (v) => (isOpen.value = v);

const contextMenu = ref();

function onContextMenu(e) {
	e.preventDefault();
	isOpen.value = true;
	mouseBounds.value = {
		x: e.clientX,
		y: e.clientY,
	};
	setTimeout(() => {
		contextMenu.value.focusMenu();
	}, 0);
}
</script>

<template>
	<button
		@contextmenu="onContextMenu($event)"
		style="display: block; width: 100%; margin-bottom: 1rem"
	>
		{{ props.name }}
	</button>
	<ContextMenu
		:data="props.id"
		ref="contextMenu"
		:isOpen="isOpen"
		@close="setIsOpen(false)"
		:x="mouseBounds.x"
		:y="mouseBounds.y"
	/>
</template>
