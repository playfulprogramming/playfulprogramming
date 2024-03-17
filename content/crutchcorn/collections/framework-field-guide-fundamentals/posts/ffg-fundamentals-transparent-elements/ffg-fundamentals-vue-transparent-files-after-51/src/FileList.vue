<!-- FileList.vue -->
<script setup>
import { ref } from "vue";
import File from "./File.vue";

const filesArray = [
	{
		fileName: "File one",
		href: "/file/file_one",
		isFolder: false,
		id: 1,
	},
	{
		fileName: "File two",
		href: "/file/file_two",
		isFolder: false,
		id: 2,
	},
	{
		fileName: "File three",
		href: "/file/file_three",
		isFolder: false,
		id: 3,
	},
	{
		fileName: "Folder one",
		href: "/file/folder_one/",
		isFolder: true,
		id: 4,
	},
	{
		fileName: "Folder two",
		href: "/file/folder_two/",
		isFolder: true,
		id: 5,
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

const onlyShowFiles = ref(false);

function toggleOnlyShow() {
	onlyShowFiles.value = !onlyShowFiles.value;
}
</script>

<template>
	<div>
		<button @click="toggleOnlyShow()">Only show files</button>
		<ul>
			<template v-for="(file, i) of filesArray" :key="file.id">
				<li v-if="onlyShowFiles ? !file.isFolder : true">
					<File
						@selected="onSelected(i)"
						:isSelected="selectedIndex === i"
						:fileName="file.fileName"
						:href="file.href"
						:isFolder="file.isFolder"
					/>
				</li>
			</template>
		</ul>
	</div>
</template>
