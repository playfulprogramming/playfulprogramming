<!-- OurButton.vue -->
<script setup lang="ts" generic="T extends keyof HTMLElementTagNameMap = 'a'">
const props = defineProps<
    // Partial<HTMLElementTagNameMap[T]> &
    {
      as?: T;
    }
>();
const Component = props.as || 'a';
</script>
<template>
  <component :is="Component" v-bind="props" class="our-button">
    <slot/>
  </component>
</template>

<style scoped>
.our-button {
  display: inline-block;
  padding: 0.5em 1em;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 0.25em;
}

.our-button:hover {
  background: #0056b3;
}

.our-button:active {
  background: #004b9e;
}

.our-button:focus {
  outline: 2px solid #0056b3;
}
</style>
