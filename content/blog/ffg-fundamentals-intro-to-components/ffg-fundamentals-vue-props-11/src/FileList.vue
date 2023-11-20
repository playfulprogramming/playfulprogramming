<!-- FileList.vue -->
<template>
  <ul>
    <li><File :fileName="'File one'" /></li>
    <li><File :fileName="'File two'" /></li>
    <li><File :fileName="'File three'" /></li>
  </ul>
</template>

<script setup>
import File from './File.vue';
</script>
