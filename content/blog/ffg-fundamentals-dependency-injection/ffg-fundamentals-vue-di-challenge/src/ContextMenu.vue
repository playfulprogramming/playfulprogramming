<!-- ContextMenu.vue -->
<script setup>
import { ref, onMounted, onUnmounted, inject, computed, watch } from "vue";

const props = defineProps(["isOpen", "x", "y", "data"]);

const emit = defineEmits(["close"]);

const context = inject("ContextMenu");

const actions = computed(() => {
	if (!context) return [];
	return context.actions;
});

const contextMenuRef = ref(null);

function closeIfOutside(e) {
	const contextMenuEl = contextMenuRef.value;
	if (!contextMenuEl) return;
	const isClickInside = contextMenuEl.contains(e.target);
	if (isClickInside) return;
	emit("close");
}

const closeIfContextMenu = () => {
	if (!props.isOpen) return;
	emit("close");
};

// This must live in a watch, as `onMounted` will run whether the `isOpen` boolean is set or not
watch(
	() => props.isOpen,
	(_, __, onCleanup) => {
		// Inside a timeout to make sure the initial context menu does not close the menu
		setTimeout(() => {
			document.addEventListener("contextmenu", closeIfContextMenu);
		}, 0);

		onCleanup(() =>
			document.removeEventListener("contextmenu", closeIfContextMenu),
		);
	},
);

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
		v-if="props.isOpen && context"
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
		<ul>
			<li v-for="action of actions">
				<button
					@click="
						action.fn(data);
						emit('close', false);
					"
				>
					{{ action.label }}
				</button>
			</li>
		</ul>
	</div>
</template>
