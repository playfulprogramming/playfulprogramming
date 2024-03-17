<!-- FileList.vue -->
<script setup>
import { ref } from "vue";
import File from "./File.vue";

const filesArray = [
	{
		fileName: "File one",
		href: "/file/file_one",
		isFolder: false,
	},
	{
		fileName: "File two",
		href: "/file/file_two",
		isFolder: false,
	},
	{
		fileName: "File three",
		href: "/file/file_three",
		isFolder: false,
	},
];

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
		<!-- This will throw a warning, more on that soon -->
		<li v-for="(file, i) in filesArray">
			<File
				@selected="onSelected(i)"
				:isSelected="selectedIndex === i"
				:fileName="file.fileName"
				:href="file.href"
				:isFolder="file.isFolder"
			/>
		</li>
	</ul>
</template>
