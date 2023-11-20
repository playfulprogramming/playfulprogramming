<!-- File.vue -->
<template>
  <div>
    <a href="/file/file_one">{{ props.fileName }}<FileDate /></a>
  </div>
</template>

<script setup>
import FileDate from './FileDate.vue';

const props = defineProps(['fileName']);
</script>
