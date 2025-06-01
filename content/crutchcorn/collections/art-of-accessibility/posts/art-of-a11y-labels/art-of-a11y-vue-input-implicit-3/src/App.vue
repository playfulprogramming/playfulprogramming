<!-- App.vue -->
<script setup>
import TextInput from "./TextInput.vue";
</script>

<template>
	<form>
		<TextInput label="Email" id="email" error="Invalid email" />
		<TextInput label="Password" type="password" />
		<button type="submit">Login</button>
	</form>
</template>
