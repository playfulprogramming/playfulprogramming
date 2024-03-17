<!-- App.vue -->
<script setup>
import { useMobileCheck } from "./use-mobile-check";

const { isMobile } = useMobileCheck();
</script>

<template>
	<p>Is this a mobile device? {{ isMobile ? "Yes" : "No" }}</p>
</template>
