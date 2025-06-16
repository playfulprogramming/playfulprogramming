<script setup>
import { css } from '@emotion/css';

const headerColor = '#2A3751';

const styles = css`
  color: ${headerColor};
  font-size: 2rem;
  text-decoration: underline;
`;
</script>

<template>
	<h1 :class="styles">I am a heading</h1>
</template>
