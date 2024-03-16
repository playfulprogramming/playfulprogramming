<script setup>
import { computed } from "vue";

const props = defineProps(["bytes"]);

const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;

function formatBytes(bytes) {
	if (bytes < kilobyte) {
		return `${bytes} B`;
	} else if (bytes < megabyte) {
		return `${Math.floor(bytes / kilobyte)} KB`;
	} else if (bytes < gigabyte) {
		return `${Math.floor(bytes / megabyte)} MB`;
	} else {
		return `${Math.floor(bytes / gigabyte)} GB`;
	}
}

const humanReadableSize = computed(() => formatBytes(props.bytes));
</script>

<template>
	<p>{{ humanReadableSize }}</p>
</template>
