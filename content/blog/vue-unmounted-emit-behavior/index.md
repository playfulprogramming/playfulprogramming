---
{
    title: "Hidden Memory Leaks in Vue",
    description: "",
    published: '2023-12-15T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['vue', 'webdev'],
    attached: [],
    license: 'cc-by-4'
}
---

Let's make a component that shows an alert after a second. We'll use `setTimeout` to delay the alert, and we'll use `onMounted` to set up the timeout.

We'll also use `defineProps` and `defineEmits` to allow for multiple ways to consume this component.

```vue
<!-- Alert.vue -->
<script setup>
import { onMounted } from "vue";

const emit = defineEmits(["alert"]);
const props = defineProps(["alert"]);

// We are intentionally not cleaning up `onMounted`
onMounted(() => {
	setTimeout(() => {
		emit("alert");
		props.alert?.();
		console.log("I am showing the alert");
	}, 1000);
});
</script>

<template>
	<p>Showing alert...</p>
</template>
```

Now, if we consume this component like so:

```vue
<!-- App.vue -->
<script setup>
import { ref } from "vue";
import Alert from "./Alert.vue";

const show = ref(false);

const toggle = () => (show.value = !show.value);

const alertUser = () => alert("I am an alert!");
</script>

<template>
	<!-- Try clicking and unclicking quickly -->
	<button @click="toggle()">Toggle</button>
    <!-- Passing a function -->
	<Alert v-if="show" :alert="alertUser" />
</template>
```

We can see that the alert is shown. This is because we're setting up a timeout, and then unmounting the component before the timeout is complete. This is a memory leak, and an easy one to identify and fix because of its visibility to the user.

However, if we change this code to use an event instead of a function, we seemingly don't see the memory leak anymore.

```vue
<!-- App.vue -->
<script setup>
import { ref } from "vue";
import Alert from "./Alert.vue";

const show = ref(false);

const toggle = () => (show.value = !show.value);

const alertUser = () => alert("I am an alert!");
</script>

<template>
	<!-- Try clicking and unclicking quickly -->
	<button @click="toggle()">Toggle</button>
    <!-- Passing an event -->
    <Alert v-if="show" @alert="alertUser()" />
</template>
```

Try it for yourself:

<iframe data-frame-title="Vue Unmounted Emit Behavior Demo - StackBlitz" src="uu-code:./vue-unmounted-behavior?embed=1&file=src/App.vue" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

This difference in behavior occurs because Vue cleans up inter-component event listeners when a component is unmounted.

While this allows our users to avoid seeing the alert, it also means that we're still leaking memory.

// TODO: Write more