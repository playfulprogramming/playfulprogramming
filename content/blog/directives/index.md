---
{
    title: "Directives",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 14,
    series: "The Framework Field Guide"
}
---



// TODO: Write this chapter



# Basic Directives

Add CSS to button



# Lifecycle Methods in Directives

`focus` when component is rendered

- React / `useEffect` inside of custom hook
- Angular is `implements` hooks

- Vue / [Directive Hooks](https://vuejs.org/guide/reusability/custom-directives.html#directive-hooks)



# Conditionally Rendered UI Via Directives

Feature flags

<!-- tabs:start -->

## React

```jsx
const flags = {
  testing: true,
};

const useFeatureFlag = ({
  flag,
  enabledComponent,
  disabledComponent = null,
}) => {
  if (flags[flag]) {
    return { comp: enabledComponent };
  }
  return {
    comp: disabledComponent,
  };
};

export default function App() {
  const { comp } = useFeatureFlag({
    flag: 'testing',
    enabledComponent: <p>Testing</p>,
  });
  return <div>{comp}</div>;
}
```

## Angular

// TODO: Structural directives

## Vue

Does this work? How do we pass data into the `template`?

```vue
<template>
  <ul>
    <li>1</li>
    <template v-render="'#here'">
      <li>2</li>
    </template>
    <li>3</li>
  </ul>
</template>

<script>
const render = {
  mounted: (el) => {
    el.after(...el.children);
  },
};

export default {
  name: 'App',
  directives: {
    // enables v-focus in template
    render,
  },
};
</script>

<style></style>
```

Answer: We don't. That's the job of a Vue component. Namely an [async Vue component](https://vuejs.org/guide/components/async.html)



> On top of that, you shouldn't use Vue directives on components, which is what we'd want to do anyway

> https://vuejs.org/guide/reusability/custom-directives.html#usage-on-components



This is why directives are a bad solution to this problem in Vue

<!-- tabs:end -->