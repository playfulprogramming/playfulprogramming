<!-- File.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FileDate from "./FileDate.vue";

const props = defineProps(["isSelected", "isFolder", "fileName", "href"]);

const emit = defineEmits(["selected"]);

const inputDate = ref(new Date());
const interval = ref(null);

onMounted(() => {
	// Check if it's a new day every 10 minutes
	interval.value = setInterval(
		() => {
			const newDate = new Date();
			if (inputDate.value.getDate() === newDate.getDate()) return;
			inputDate.value = newDate;
		},
		10 * 60 * 1000,
	);
});

onUnmounted(() => {
	clearInterval(interval.value);
});
</script>

<template>
	<tr
		@click="emit('selected')"
		:aria-selected="props.isSelected"
		:style="
			props.isSelected
				? { backgroundColor: 'blue', color: 'white' }
				: { backgroundColor: 'white', color: 'blue' }
		"
	>
		<td>
			<a :href="props.href" style="color: inherit">{{ props.fileName }}</a>
		</td>
		<td v-if="props.isFolder">Type: Folder</td>
		<td v-else>Type: File</td>
		<td><FileDate v-if="!props.isFolder" :inputDate="inputDate" /></td>
	</tr>
</template>
