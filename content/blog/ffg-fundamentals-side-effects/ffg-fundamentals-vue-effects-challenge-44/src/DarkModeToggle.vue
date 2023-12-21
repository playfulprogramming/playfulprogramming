<!-- DarkModeToggle.vue -->
<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

const explicitTheme = ref(localStorage.getItem("theme") || "inherit");

watch(explicitTheme, () => {
	localStorage.setItem("theme", explicitTheme);
});

watch(explicitTheme, () => {
	if (explicitTheme.value === "implicit") {
		document.documentElement.className = explicitTheme.value;
		return;
	}

	document.documentElement.className = explicitTheme.value;
});

const isOSDark = window.matchMedia("(prefers-color-scheme: dark)");

const changeOSTheme = () => {
	explicitTheme.value = isOSDark.matches ? "dark" : "light";
};

onMounted(() => {
	isOSDark.addEventListener("change", changeOSTheme);
});

onUnmounted(() => {
	isOSDark.removeEventListener("change", changeOSTheme);
});
</script>

<template>
	<div style="display: flex; gap: 1rem">
		<label style="display: inline-flex; flex-direction: column">
			<div>Light</div>
			<input
				name="theme"
				type="radio"
				:checked="explicitTheme === 'light'"
				@change="explicitTheme = 'light'"
			/>
		</label>
		<label style="display: inline-flex; flex-direction: column">
			<div>Inherit</div>
			<input
				name="theme"
				type="radio"
				:checked="explicitTheme === 'inherit'"
				@change="explicitTheme = 'inherit'"
			/>
		</label>
		<label style="display: inline-flex; flex-direction: column">
			<div>Dark</div>
			<input
				name="theme"
				type="radio"
				:checked="explicitTheme === 'dark'"
				@change="explicitTheme = 'dark'"
			/>
		</label>
	</div>
</template>
