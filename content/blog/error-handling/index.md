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

While this logging often involves submitting data to a server, let's keep things local to the user's machine for now. 

<!-- tabs:start -->

## React

Up to this point, all of our React components have been functions. While this _is_ how most modern React applications are built today there is another way of writing a React component; this being the "class" API.

Class-based React components have existed _well_ before functional components have. Class-based components were in React since day one and functional components were only truly made viable with a significant revamp [in React 16.8; coinciding with the introduction of React Hooks](https://reactjs.org/docs/hooks-intro.html).

Here's a simple React component in both functional and class based APIs:

```jsx
// Functional component
const Counter = (props) => {
    // Setting up state
    const [count, setCount] = useState(0);
    
    // Function to update state
    const addOne = () => setCount(count + 1);
    
    // Rendered UI via JSX
    return <div>
        <p>You have pushed the button {count} times</p>
    	<button onClick={addOne}>Add one</button>
        {/* Using props to project children */}
        {props.children}
    </div>
}
```

```jsx
// Class component
import {Component} from 'react';

class Counter extends Component {
    // Setting up state
    state = {count: 0};

    // Function to update state
    addOne() {
        // Notice we use an object and `setState` to update state
        this.setState({count: this.state.count + 1});
    }
    
    // Rendered UI via JSX
    render() {
        <div>
            <p>You have pushed the button {this.state.count} times</p>
            <button onClick={this.addOne}>Add one</button>
            {/* Using props to project children */}
            {this.props.children}
        </div>
    }
}
```

Both of these components work exactly the same, with no functional differences between them. This is because almost every API that was available to class components made its way over to functional components through React Hooks. 

_**Almost** every API made the migration to Hooks._

One of the few exceptions to that rule is the ability to catch and track errors that are thrown within a React application.

### Use class components to build an error boundary

Now that we understand what a class component is, and why it's required to use one for error handling, let's build one ourselves!

Just like any other class component, we start with an `extends` clause to tell React that this class is, in fact, a component.

From there, we add in a special `componentDidCatch` method, like so:

```jsx
import {Component} from 'react';

class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    	// Do something with the error
      console.log(error, errorInfo);  
  }
  
  render() {
    return this.props.children; 
  }
}
```

This method is then called any time a child component throws an error.

Luckily for us, we can mix-and-match class components and functional components. This means that we can demonstrate the `componentDidCatch` handler using the following code:

```jsx
const ErrorThrowingComponent = () => {
    // This is an example of an error being thrown
    throw "Error";
}

const App = () => {
    return <ErrorBoundary>
    	<ErrorThrowingComponent/>
    </ErrorBoundary>
}
```

Now, while our screen will still be white when the error is thrown, it will hit our `componentDidCatch` handler as we would expect.

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
  state = { hasError: false };

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
  state = { hasError: false };

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