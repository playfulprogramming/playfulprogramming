<!-- App.vue -->
<script setup>
import { ref, onUnmounted } from "vue";

const buttonRef = ref();

const mouseOverTimeout = ref(null);

const tooltipMeta = ref({
	x: 0,
	y: 0,
	height: 0,
	width: 0,
	show: false,
});

const onMouseOver = () => {
	mouseOverTimeout.value = setTimeout(() => {
		const bounding = buttonRef.value.getBoundingClientRect();
		tooltipMeta.value = {
			x: bounding.x,
			y: bounding.y,
			height: bounding.height,
			width: bounding.width,
			show: true,
		};
	}, 1000);
};

const onMouseLeave = () => {
	tooltipMeta.value = {
		x: 0,
		y: 0,
		height: 0,
		width: 0,
		show: false,
	};
	clearTimeout(mouseOverTimeout.current);
};

onUnmounted(() => {
	clearTimeout(mouseOverTimeout.current);
});
</script>

<template>
	<div
		style="
			height: 100px;
			width: 100%;
			background: lightgrey;
			position: relative;
			z-index: 2;
		"
	></div>
	<div
		style="
			z-index: 1;
			position: relative;
			padding-left: 10rem;
			padding-top: 2rem;
		"
	>
		<Teleport to="body" v-if="tooltipMeta.show">
			<div
				:style="`
				z-index: 9;
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ${tooltipMeta.width}px;
        position: fixed;
        top: ${tooltipMeta.y - tooltipMeta.height - 16 - 6 - 8}px;
        left: ${tooltipMeta.x}px;
      `"
			>
				<div
					:style="`
          white-space: nowrap;
          padding: 8px;
          background: #40627b;
          color: white;
          border-radius: 16px;
        `"
				>
					This will send an email to the recipients
				</div>
				<div
					:style="`
          height: 12px;
          width: 12px;
          transform: rotate(45deg) translateX(-50%);
          background: #40627b;
          bottom: calc(-6px - 4px);
          position: absolute;
          left: 50%;
          zIndex: -1;
        `"
				></div>
			</div>
		</Teleport>
		<button
			ref="buttonRef"
			@mouseover="onMouseOver()"
			@mouseleave="onMouseLeave()"
		>
			Send
		</button>
	</div>
</template>
