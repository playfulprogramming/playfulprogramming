<!-- ContextMenu.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps(["isOpen", "x", "y"]);

const emit = defineEmits(["close"]);

const contextMenuRef = ref(null);

function closeIfOutside(e) {
	const contextMenuEl = contextMenuRef.value;
	if (!contextMenuEl) return;
	const isClickInside = contextMenuEl.contains(e.target);
	if (isClickInside) return;
	emit("close");
}

onMounted(() => {
	document.addEventListener("click", closeIfOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", closeIfOutside);
});

function focusMenu() {
	contextMenuRef.value.focus();
}

defineExpose({
	focusMenu,
});
</script>

<template>
	<div
		v-if="props.isOpen"
		ref="contextMenuRef"
		tabIndex="0"
		:style="`
      position: fixed;
      top: ${props.y}px;
      left: ${props.x}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    `"
	>
		<button @click="emit('close')">X</button>
		This is a context menu
	</div>
</template>
