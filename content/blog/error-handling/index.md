---
{
    title: "Error Handling",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 16,
    series: "The Framework Field Guide"
}
---



// TODO: Write



# Logging Errors

<!-- tabs:start -->

## React

// TODO: write

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);  
  }
  
  render() {
    return this.props.children; 
  }
}
```



## Angular

// TODO: Write

## Vue

// TODO: Write

```vue
<!-- App.vue -->
<script setup>
import { onErrorCaptured } from 'vue'

import Child from './Child.vue'

onErrorCaptured((err, instance, info) => {
  console.log(err, instance, info)
})
</script>

<template>
  <Child />
</template>
```



```vue
<!-- Child.vue -->
<script setup>
throw 'Test'
</script>

<template>
  <p>Hello, world!</p>
</template>
```





<!-- tabs:end -->



# Ignoring the Error

Sometimes, it's ideal to ignore the error and pretend that nothing ever happened, allowing the app to continue on as normal

// TODO: write

<!-- tabs:start -->

## React

// TODO: write

React cannot do this, because functional components are normal functions

## Angular

// TODO: Write

## Vue

// TODO: Write

Return `false` in `onErrorCaptured`

```vue
<!-- App.vue -->
<script setup>
import { onErrorCaptured } from 'vue'

import Child from './Child.vue'

onErrorCaptured((err, instance, info) => {
  console.log(err, instance, info);
  return false;
})
</script>

<template>
  <Child />
</template>
```

This allows components like this:
```vue
<!-- Child.vue -->
<script setup>
throw 'Test'
</script>

<template>
  <p>Hello, world!</p>
</template>
```

To still render their contents, while logging the error.

<!-- tabs:end -->






# Fallback UI



<!-- tabs:start -->

## React

// TODO: write

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) { 
      return { hasError: true };  
  }
  
  componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);  
  }
  
  render() {
    if (this.state.hasError) {
    	return <h1>Something went wrong.</h1>;    
    }
    return this.props.children; 
  }
}
```



## Angular

// TODO: Write

## Vue

// TODO: Write

```vue
<!-- App.vue -->
<script setup>
import { onErrorCaptured, ref } from 'vue'

import Child from './Child.vue'

const hadError = ref(false)

onErrorCaptured((err, instance, info) => {
  console.log(err, instance, info)
  hadError.value = true;
  return false
})
</script>

<template>
  <p v-if="hadError">An error occured</p>
  <Child v-if="!hadError" />
</template>
```



<!-- tabs:end -->


## Displaying the Error



<!-- tabs:start -->

### React

// TODO: write

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
      return { hasError: error };  
  }
  
  componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);  
  }
  
  render() {
    if (this.state.hasError) {
    	return <h1>{this.state.hasError}</h1>;    
    }
    return this.props.children; 
  }
}
```



### Angular

// TODO: Write

### Vue

// TODO: Write

```vue
<!-- App.vue -->
<script setup>
import { onErrorCaptured, ref } from 'vue'

import Child from './Child.vue'

const hadError = ref(false)

onErrorCaptured((err, instance, info) => {
  console.log(err, instance, info)
  hadError.value = error
  return false
})
</script>

<template>
  <p v-if="hadError">{{ hadError }}</p>
  <Child v-if="!hadError" />
</template>
```

<!-- tabs:end -->