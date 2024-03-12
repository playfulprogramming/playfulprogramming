<!-- ToggleButtonList.vue -->
<script setup>
import ToggleButton from "./ToggleButton.vue";
import RainbowExclamationMark from "./RainbowExclamationMark.vue";

const friends = ["Kevin,", "Evelyn,", "and James"];
</script>

<template>
	<ToggleButton
		>Hello <span v-for="friend of friends">{{ friend }} </span>!</ToggleButton
	>
	<ToggleButton
		>Hello other friends
		<RainbowExclamationMark />
	</ToggleButton>
</template>
