---
{
    title: "Error Handling",
    description: "Bug are a constant in development. How can we make error handling lead to a nicer user experience when they occur in React, Angular, and Vue?",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 16,
    series: "The Framework Field Guide"
}
---


Despite our best efforts, bugs will find their way into our applications. Unfortunately, we can't simply ignore them or else the user experience suffers greatly.

Take the following code:

<!-- tabs:start -->

# React

```jsx
export const App = () => {
  const items = [
    { id: 1, name: 'Take out the trash', priority: 1 },
    { id: 2, name: 'Cook dinner', priority: 1 },
    { id: 3, name: 'Play video games', priority: 2 },
  ];

  const priorityItems = items.filter((item) => item.item.priority === 1);

  return (
    <>
      <h1>To-do items</h1>
      <ul>
        {priorityItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
};
```

# Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>To-do items</h1>
    <ul>
      <li *ngFor="let item of priorityItems">{{ item.name }}</li>
    </ul>
  `,
})
export class AppComponent {
  items = [
    { id: 1, name: 'Take out the trash', priority: 1 },
    { id: 2, name: 'Cook dinner', priority: 1 },
    { id: 3, name: 'Play video games', priority: 2 },
  ];

  priorityItems = this.items.filter((item: any) => item.item.priority === 1);
}
```

# Vue

```vue
<!-- App.vue -->
<script setup>
const items = [
  { id: 1, name: 'Take out the trash', priority: 1 },
  { id: 2, name: 'Cook dinner', priority: 1 },
  { id: 3, name: 'Play video games', priority: 2 },
]

const priorityItems = items.filter((item) => item.item.priority === 1)
</script>

<template>
  <h1>To-do items</h1>
  <ul>
    <li v-for="item of priorityItems" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

<!-- tabs:end -->

Without running the code, everything looks pretty good, right?

> Maybe you've spotted the error by now - that's great! Just remember - we all make these small mistakes from time-to-time. Don't dismiss the idea of error handling out of hand as we go forward.

But oh no! When you run the application, it's not showing the `h1` or any of the list items like we would expect it to.

The reason those items aren't showing on-screen is because an error is being thrown. Open your console on any of these examples and you'll find an error waiting for you:

> Error: can't access property "priority", item.item is undefined

Luckily, this error is a fairly easy fix, but even if we do; bugs will inevitably be introduced into our apps. A white screen is a pretty sub-par experience for our end users - they likely won't even understand what happened that lead them to this broken page.


While I doubt we'll ever convince our users that an error is a _good_ thing, how can we make this user experince _better_, at least?

# Logging Errors

The first step to providing a better end-user experience when it comes to errors is to reduce how many are made.

> Well, duh

Sure, this seems obvious, but consider this: If an error occurs on the user's machine, and it isn't caught during internally, how are you supposed to know how to fix it?

This is where the concept of "logging" comes into play. The general idea behind logging is that you can capture a collection of errors and information about the events that led up to the errors, and provide a way to export this data so that your user can send it to you to debug.

While this logging often involves submitting data to the server, let's evaluate how you're able to use 

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
    	// Do something with the error
      console.log(error, errorInfo);  
  }
  
  render() {
    return this.props.children; 
  }
}
```



## Angular

// TODO: Write

```typescript
class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    // Do something with the error
    console.log(error);
  }
}

@Component({
  selector: 'child',
  template: `
    <p>Testing</p>
  `,
})
class ChildComponent implements OnInit {
  ngOnInit() {
    throw 'Test';
  }
}

@Component({
  selector: 'my-app',
  template: `
    <child></child>
  `,
})
class AppComponent {
}

@NgModule({
  declarations: [AppComponent, ChildComponent],
  imports: [BrowserModule],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Providing within our component doesn't work - this needs to be a global instance of `ErrorHandler`.

<!-- // TODO: migrate to standalone APIs -->

## Vue

// TODO: Write

```vue
<!-- App.vue -->
<script setup>
import { onErrorCaptured } from 'vue'

import Child from './Child.vue'

onErrorCaptured((err, instance, info) => {
  // Do something with the error
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

This is the default behavior of an Angular component, anyway. No code changes from the previous example is needed. 

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

```typescript
import {
  Component,
  NgModule,
  inject,
  ErrorHandler,
  OnInit,
} from '@angular/core';

class MyErrorHandler implements ErrorHandler {
  hadError = false;

  handleError(error) {
    console.log(error);
    this.hadError = true;
  }
}

@Component({
  selector: 'child',
  template: `
    <p>Testing</p>
  `,
})
class ChildComponent implements OnInit {
  ngOnInit() {
    throw 'Test';
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p *ngIf="errorHandler.hadError">There was an error</p>
    <child *ngIf="!errorHandler.hadError"></child>
  `,
})
class AppComponent {
  errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

@NgModule({
  declarations: [AppComponent, ChildComponent],
  imports: [BrowserModule],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Unlike most instances of `inject` usage, we have to use `as MyErrorHandler`, otherwise TypeScript does not know about the new `hadError` property we set.

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

```typescript
import { BrowserModule } from '@angular/platform-browser';

import {
  Component,
  NgModule,
  inject,
  ErrorHandler,
  OnInit,
} from '@angular/core';

class MyErrorHandler implements ErrorHandler {
  hadError = false;

  handleError(error) {
    console.log(error);
    this.hadError = error;
  }
}

@Component({
  selector: 'child',
  template: `
    <p>Testing</p>
  `,
})
class ChildComponent implements OnInit {
  ngOnInit() {
    throw 'Test';
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p *ngIf="errorHandler.hadError">{{errorHandler.hadError}}</p>
    <child *ngIf="!errorHandler.hadError"></child>
  `,
})
class AppComponent {
  errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

@NgModule({
  declarations: [AppComponent, ChildComponent],
  imports: [BrowserModule],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```



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