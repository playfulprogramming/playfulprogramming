<!-- ToggleButton.vue -->
<script setup>
import { ref } from "vue";

const pressed = ref(false);

function togglePressed() {
	pressed.value = !pressed.value;
}
</script>

<template>
	<button
		@click="togglePressed()"
		:style="
			pressed
				? 'background-color: black; color: white'
				: 'background-color: white; color: black'
		"
		type="button"
		:aria-pressed="pressed"
	>
		<slot></slot>
	</button>
</template>
