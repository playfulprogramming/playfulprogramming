<!-- GreatGrandChild.vue -->
<script setup>
import { inject } from "vue";

const { greeting, changeGreeting } = inject("MESSAGE");
</script>

<template>
	<div>
		<p>{{ greeting }}, user!</p>
		<label>
			<div>Set a new greeting</div>
			<input :value="greeting" @input="changeGreeting($event.target.value)" />
		</label>
	</div>
</template>
