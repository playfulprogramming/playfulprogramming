<!-- App.vue -->
<script setup>
import { ref } from "vue";
import Alert from "./Alert.vue";

const show = ref(false);

const toggle = () => (show.value = !show.value);

const alertUser = () => alert("I am an alert!");
</script>

<template>
	<!-- Try clicking and unclicking quickly -->
	<button @click="toggle()">Toggle</button>
	<!-- Passing a function -->
	<Alert v-if="show" :alert="alertUser" />
</template>
