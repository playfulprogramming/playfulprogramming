<!-- App.vue -->
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import ContextMenu from "./ContextMenu.vue";
import { useBounds } from "./use-bounds";
const isOpen = ref(false);

const { ref: contextOrigin, bounds } = useBounds();
const contextMenu = ref();

function close() {
	isOpen.value = false;
}
function open(e) {
	e.preventDefault();
	isOpen.value = true;
	setTimeout(() => {
		contextMenu.value.focusMenu();
	}, 0);
}
</script>

<template>
	<div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
		<div ref="contextOrigin" @contextmenu="open($event)">
			Right click on me!
		</div>
	</div>
	<ContextMenu
		ref="contextMenu"
		v-if="isOpen"
		:x="bounds.x"
		:y="bounds.y"
		@close="close()"
	/>
</template>
