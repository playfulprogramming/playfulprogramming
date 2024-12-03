<!-- FileList.vue -->
<script setup>
import File from "./File.vue";

// ...
</script>

<template>
	<ul>
		<li>
			<File fileName="File one" href="/file/file_one" />
		</li>
		<li>
			<File fileName="Folder one" href="/file/folder_one/" :isFolder="true" />
		</li>
	</ul>
</template>
