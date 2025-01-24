<!-- App.vue -->
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Layout from "./Layout.vue";
import Sidebar from "./Sidebar.vue";

const collapsedWidth = 100;
const expandedWidth = 150;
const widthToCollapseAt = 600;

const sidebar = ref();

const width = ref(expandedWidth);

const onToggle = (isCollapsed) => {
	if (isCollapsed) {
		width.value = collapsedWidth;
		return;
	}
	width.value = expandedWidth;
};

const onResize = () => {
	if (window.innerWidth < widthToCollapseAt) {
		sidebar.value.collapse();
	} else if (sidebar.value.isCollapsed) {
		sidebar.value.expand();
	}
};

onMounted(() => {
	window.addEventListener("resize", onResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", onResize);
});
</script>

<template>
	<Layout :sidebarWidth="width">
		<template #sidebar>
			<Sidebar ref="sidebar" @toggle="onToggle($event)" />
		</template>
		<p style="padding: 1rem">Hi there!</p>
	</Layout>
</template>
