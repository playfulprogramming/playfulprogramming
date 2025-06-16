<script setup>
import { useCssModule } from "vue";
import SearchIcon from "./SearchIcon.vue";

const style = useCssModule();
</script>

<template>
	<div :class="style.container">
		<SearchIcon />
	</div>
</template>

<style module>
.container {
	border-radius: 8px;
	color: #3366ff;
	background: rgba(102, 148, 255, 0.1);
	padding: 8px;
	display: flex;
}
</style>
