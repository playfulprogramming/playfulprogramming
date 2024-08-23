<!-- Sidebar.vue -->
<script setup>
import { provide } from "vue";
import File from "./File.vue";

const directories = [
	{
		name: "Movies",
		id: 1,
	},
	{
		name: "Documents",
		id: 2,
	},
	{
		name: "Etc",
		id: 3,
	},
];

const getDirectoryById = (id) => {
	return directories.find((dir) => dir.id === id);
};

const onCopy = (id) => {
	const dir = getDirectoryById(id);
	// Some browsers still do not support this
	if (navigator?.clipboard?.writeText) {
		navigator.clipboard.writeText(dir.name);
		alert("Name is copied");
	} else {
		alert("Unable to copy directory name due to browser incompatibility");
	}
};

provide("ContextMenu", {
	actions: [
		{
			label: "Copy directory name",
			fn: onCopy,
		},
	],
});
</script>

<template>
	<div style="padding: 1rem">
		<h1 style="font-size: 1.25rem">Directories</h1>
		<File
			v-for="directory of directories"
			:key="directory.id"
			:name="directory.name"
			:id="directory.id"
		/>
	</div>
</template>
