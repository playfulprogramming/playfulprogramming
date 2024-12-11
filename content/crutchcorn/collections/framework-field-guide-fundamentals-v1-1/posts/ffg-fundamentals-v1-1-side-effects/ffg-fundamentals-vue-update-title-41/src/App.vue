<!-- App.vue -->
<script setup>
import { ref } from "vue";
import TitleChanger from "./TitleChanger.vue";

const show = ref(true);

function toggle() {
	show.value = !show.value;
}
</script>

<template>
	<div>
		<button @click="toggle()">Toggle title changer</button>
		<TitleChanger v-if="show" />
	</div>
</template>
