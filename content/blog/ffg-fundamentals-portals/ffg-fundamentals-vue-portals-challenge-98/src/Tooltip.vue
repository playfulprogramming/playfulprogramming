<!-- Tooltip.vue -->
<script setup>
import { ref, watch } from "vue";
const isVisible = ref(false);

const showTooltip = () => {
	isVisible.value = true;
};

const hideTooltip = () => {
	isVisible.value = false;
};

const targetRef = ref(null);
const tooltipRef = ref(null);

watch(isVisible, (value) => {
	if (!value || !tooltipRef.value || !targetRef.value) return;
	const targetRect = targetRef.value.getBoundingClientRect();

	if (!tooltipRef.value) return;
	tooltipRef.value.style.left = `${targetRect.left}px`;
	tooltipRef.value.style.top = `${targetRect.bottom}px`;
});

const props = defineProps(["text"]);
</script>

<template>
	<div>
		<div
			ref="targetRef"
			@mouseenter="showTooltip()"
			@mouseleave="hideTooltip()"
		>
			<slot></slot>
		</div>
	</div>
	<Teleport to="body" v-if="isVisible">
		<div ref="tooltipRef" class="tooltip">
			{{ props.text }}
		</div>
	</Teleport>
</template>
