<!-- App.vue -->
<script setup>
import Tooltip from "./Tooltip.vue";
</script>

<template>
	<div>
		<Tooltip text="This is a tooltip">
			<button>Hover me</button>
		</Tooltip>
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
