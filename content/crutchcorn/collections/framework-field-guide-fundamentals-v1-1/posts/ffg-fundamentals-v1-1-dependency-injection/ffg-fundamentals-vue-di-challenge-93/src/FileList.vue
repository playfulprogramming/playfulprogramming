<!-- FileList.vue -->
<script setup>
import { provide, ref } from "vue";
import File from "./File.vue";

const files = ref([
	{
		name: "Testing.wav",
		id: 1,
	},
	{
		name: "Secrets.txt",
		id: 2,
	},
	{
		name: "Other.md",
		id: 3,
	},
]);

const getFileIndexById = (id) => {
	return files.value.findIndex((file) => file.id === id);
};

const onRename = (id) => {
	const fileIndex = getFileIndexById(id);
	const file = files.value[fileIndex];
	const newName = prompt(
		`What do you want to rename the file ${file.name} to?`,
	);
	if (!newName) return;
	files.value[fileIndex] = {
		...file,
		name: newName,
	};
};

const onDelete = (id) => {
	const fileIndex = getFileIndexById(id);
	files.value.splice(fileIndex, 1);
};

provide("ContextMenu", {
	actions: [
		{
			label: "Rename",
			fn: onRename,
		},
		{
			label: "Delete",
			fn: onDelete,
		},
	],
});
</script>

<template>
	<div style="padding: 1rem">
		<h1>Files</h1>
		<File
			v-for="file of files"
			:key="file.id"
			:name="file.name"
			:id="file.id"
		/>
	</div>
</template>
