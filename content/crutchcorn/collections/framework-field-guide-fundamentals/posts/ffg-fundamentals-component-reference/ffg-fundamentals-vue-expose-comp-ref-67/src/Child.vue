<!-- Child.vue -->
<script setup>
const pi = 3.14;

function sayHi() {
	alert("Hello, world");
}

defineExpose({
	pi,
	sayHi,
});
</script>

<template>
	<p>Hello, template</p>
</template>
