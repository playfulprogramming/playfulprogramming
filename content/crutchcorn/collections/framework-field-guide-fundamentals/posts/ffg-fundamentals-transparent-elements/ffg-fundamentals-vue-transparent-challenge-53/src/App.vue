<script setup>
import ButtonBar from "./ButtonBar.vue";

function alertMe(str) {
	alert("You have pressed on " + str);
}
</script>

<template>
	<button-bar
		:fileSelected="true"
		@delete="alertMe('delete')"
		@copy="alertMe('copy')"
		@favorite="alertMe('favorite')"
		@settings="alertMe('settings')"
	/>
</template>
