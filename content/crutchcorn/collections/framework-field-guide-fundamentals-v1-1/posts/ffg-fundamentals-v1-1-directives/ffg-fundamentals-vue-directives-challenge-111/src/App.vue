<!-- App.vue -->
<script setup>
import { vTooltip } from "./vTooltip.js";

const obj = { current: null };
</script>

<template>
	<div>
		<button :ref="(el) => (obj.current = el)">Hover me</button>
		<!-- Anything passed to `v-tooltip` is not reactive, so we need to use an object with a mutable `current` property -->
		<div v-tooltip="obj">This is a tooltip</div>
	</div>
</template>

<style>
.tooltip {
	position: absolute;
	background-color: #333;
	color: #fff;
	padding: 8px;
	border-radius: 4px;
	z-index: 1000;
}
</style>
