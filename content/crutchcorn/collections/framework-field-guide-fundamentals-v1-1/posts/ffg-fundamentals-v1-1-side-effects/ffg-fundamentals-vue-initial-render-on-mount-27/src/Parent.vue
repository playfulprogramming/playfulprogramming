<!-- Parent.vue -->
<script setup>
import { ref } from "vue";
import Child from "./Child.vue";

const showChild = ref(true);

function setShowChild() {
	showChild.value = !showChild.value;
}
</script>

<template>
	<div>
		<button @click="setShowChild()">Toggle Child</button>
		<Child v-if="showChild" />
	</div>
</template>
