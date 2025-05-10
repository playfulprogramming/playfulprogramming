<!-- App.vue -->
<script setup>
import { useWindowSize } from "./use-window-size";

const { height, width } = useWindowSize();
</script>

<template>
	<p>The window is {{ height }}px high and {{ width }}px wide</p>
</template>
