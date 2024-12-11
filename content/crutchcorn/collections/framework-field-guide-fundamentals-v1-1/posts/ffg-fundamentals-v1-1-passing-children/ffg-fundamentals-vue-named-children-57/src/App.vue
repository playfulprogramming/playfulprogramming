<!-- App.vue -->
<script setup>
import { ref } from "vue";
import Dropdown from "./Dropdown.vue";

const expanded = ref(false);
</script>

<template>
	<Dropdown :expanded="expanded" @toggle="expanded = !expanded">
		<template #header>Let's build this dropdown component</template>
		These tend to be useful for FAQ pages, hidden contents, and more!
	</Dropdown>
</template>
