<!-- ContextMenu.vue -->
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useOutsideClick } from "./use-outside-click";

const props = defineProps(["x", "y"]);
const emit = defineEmits(["close"]);
const contextMenuRef = ref(null);

useOutsideClick({ ref: contextMenuRef, onClose: () => emit("close") });

function focusMenu() {
	contextMenuRef.value.focus();
}
defineExpose({
	focusMenu,
});
</script>

<template>
	<div
		tabIndex="0"
		ref="contextMenuRef"
		:style="{
			position: 'fixed',
			top: props.y + 20,
			left: props.x + 20,
			background: 'white',
			border: '1px solid black',
			borderRadius: 16,
			padding: '1rem',
		}"
	>
		<button @click="$emit('close')">X</button>
		This is a context menu
	</div>
</template>
