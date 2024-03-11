<!-- App.vue -->

<!-- This code sample is inaccessible and generally not -->
<!--  production-grade. It's missing:                   -->
<!--  - Focus on menu open                              -->
<!--  - Closing upon external click                     -->
<!--                                                    -->
<!--  Read on to learn how to add these                 -->
<script setup>
import { ref } from "vue";

const isOpen = ref(false);

const mouseBounds = ref({
	x: 0,
	y: 0,
});

const close = () => {
	isOpen.value = false;
};

const open = (e) => {
	e.preventDefault();
	isOpen.value = true;
	mouseBounds.value = {
		// Mouse position on click
		x: e.clientX,
		y: e.clientY,
	};
};
</script>

<template>
	<div style="margin-top: 5rem; margin-left: 5rem">
		<div @contextmenu="open($event)">Right click on me!</div>
	</div>
	<div
		v-if="isOpen"
		:style="`
      position: fixed;
      top: ${mouseBounds.y}px;
      left: ${mouseBounds.x}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    `"
	>
		<button @click="close()">X</button>
		This is a context menu
	</div>
</template>
