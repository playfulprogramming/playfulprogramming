<!-- App.vue -->
<script setup>
import { ref } from "vue";

const items = ref([]);

function scrollToTop() {
	items.value[0].scrollIntoView();
}

function scrollToBottom() {
	items.value[items.value.length - 1].scrollIntoView();
}

const messages = [
	"The new slides for the design keynote look wonderful!",
	"Some great new colours are planned to debut with Material Next!",
	"Hey everyone! Please take a look at the resources I’ve attached.",
	"So on Friday we were thinking about going through that park you’ve recommended.",
	"We will discuss our upcoming Pixel 6 strategy in the following week.",
	"On Thursday we drew some great new ideas for our talk.",
	"So the design teams got together and decided everything should be made of sand.",
];
</script>

<template>
	<div>
		<button @click="scrollToTop()">Scroll to top</button>
		<ul style="height: 100px; overflow: scroll">
			<li v-for="(message, i) of messages" :key="i" ref="items">
				{{ message }}
			</li>
		</ul>
		<button @click="scrollToBottom()">Scroll to bottom</button>
	</div>
</template>
