<!-- FileList.vue -->
<script setup>
import { ref } from "vue";
import File from "./File.vue";

const selectedIndex = ref(-1);

function onSelected(idx) {
	if (selectedIndex.value === idx) {
		selectedIndex.value = -1;
		return;
	}
	selectedIndex.value = idx;
}
</script>

<template>
	<ul>
		<li>
			<File
				@selected="onSelected(0)"
				:isSelected="selectedIndex === 0"
				fileName="File one"
				href="/file/file_one"
			/>
		</li>
		<li>
			<File
				@selected="onSelected(1)"
				:isSelected="selectedIndex === 1"
				fileName="File two"
				href="/file/file_two"
			/>
		</li>
		<li>
			<File
				@selected="onSelected(2)"
				:isSelected="selectedIndex === 2"
				fileName="File three"
				href="/file/file_three"
			/>
		</li>
	</ul>
</template>
