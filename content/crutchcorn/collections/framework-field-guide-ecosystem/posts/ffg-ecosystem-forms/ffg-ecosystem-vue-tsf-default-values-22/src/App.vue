<!-- App.vue -->
<script setup>
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    usersName: '',
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
	console.log("Form submitted with values:", value);
  },
})
</script>

<template>
	<form @submit.prevent.stop="form.handleSubmit">
		<form.Field name="usersName">
			<template v-slot="{ field }">
			<input
				:value="field.state.value"
				@input="(e) => field.handleChange(e.target.value)"
			/>
			</template>
		</form.Field>
		<button type="submit">Submit</button>
	</form>
</template>