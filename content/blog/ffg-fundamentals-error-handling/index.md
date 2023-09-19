---
{
    title: "Error Handling",
    description: "Bug are a constant in development. How can we make error handling lead to a nicer user experience when they occur in React, Angular, and Vue?",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 10,
    collection: "The Framework Field Guide - Fundamentals"
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


While I doubt we'll ever convince our users that an error is a _good_ thing, how can we make this user experience _better_, at least?

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

### Error boundary limitations

It's worth mentioning that React's `componentDidCatch` class method will only execute when there's an error during [the render step](/posts/ffg-fundamentals-side-effects). This means that the following will throw an error caught by `componentDidCatch`:

```jsx
const ErrorThrowingComponent = () => {
    // This WILL be caught by `componentDidCatch`
    throw "Error";
}
```

Meanwhile, the following error-laden event handler will not:

```jsx
const EventErrorThrowingComponent = () => {
    const onClick = () => {
        // This will NOT be caught by `componentDidCatch`
        throw "Error";
    }
    
    return <button onClick={onClick}>Click me</button>
}
```

This behavior may seem strange until you consider how JavaScript's `throw` clause works. When a JavaScript function throws an error, it also acts as an early return of sorts.

```javascript
function getRandomNumber() {
    throw "There was an error";
    // Anything below the "throw" clause will not run
    console.log("Generating a random number");
    // This means that values returned after a thrown error are not utilized
    return Math.floor(Math.random() * 10);
}

try {
    const val = getRandomNumber();
    // This will never execute because the `throw` bypasses it
    console.log("I got the random number of:", val);
} catch (e) {
    // This will always run instead
    console.log("There was an error:", e);
}
```

Moreover, these errors exceed past [their scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope), meaning that they will bubble up [the execution stack](https://www.freecodecamp.org/news/execution-context-how-javascript-works-behind-the-scenes/).

> What does that mean in English?

In practical terms, this means that a thrown error will exceed the bounds of the function you called it in, and make its way further  up the list of functions you called to get to the thrown error.

```javascript
function getBaseNumber() {
    // Error occurs here, throws it upwards
	throw "There was an error";
	return 10;
}

function getRandomNumber() {
    // Error occurs here, throws it upwards
    return Math.floor(Math.random() * getBaseNumber());
}

function getRandomTodoItem() {
    const items = [
        "Go to the gym",
        "Play video games",
        "Work on book",
        "Program"
    ]

    // Error occurs here, throws it upwards
    const randNum = getRandomNumber();

    return items[randNum % items.length];
}

function getDaySchedule() {
    let schedule = [];
    for (let i = 0; i<3; i++) {
		schedule.push(
            // First execution will throw this error upwards
            getRandomTodoItem();
        )
    }
}

function main() {
    try {
    	getDaySchedule();
    } catch (e) {
        // Only now will the error be stopped
        console.log("An error occured:", e);
    }
}
```

![TODO: Write alt](./error_bubbling.png)



Because of these two properties of errors, React is unable to "recover" (continue rendering after an error has occurred) from an error thrown during a render cycle. Because of this inability to "recover", they had to build in a first-class solution to render errors in React to act as a `try/catch` block.

------

Conversely, due to the nature of event handlers, React doesn't _need_ to handle errors that occur during event handlers. Assume we have the following code in an HTML file:

```html
<!-- index.html -->
<button id="btn">Click me</button>

<script>
   const el = document.getElementById("btn");
   el.addEventListener('click', () => {
       throw "There was an error"
   })
</script>
```

When you click on the `<button>` here, it will throw an error but this error will not escape out of the event listener's scope. This means that the following will not work:

```javascript
try {
    const el = document.getElementById("btn");
    el.addEventListener('click', () => {
       throw "There was an error"
    })
} catch (e) {
    // This will not ever run with this code
    alert("There was an error in the event listener");
}
```

So to catch an error in an event handler, React would have to add [a window `'errror'` listener](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event), like so:

```javascript
const el = document.getElementById("btn");
el.addEventListener('click', () => {
   throw "There was an error"
})

window.addEventListener("error", (e) => {
	alert("There was an error in the event listener")
});
```

But let's think about what adding this `window` listener would mean:

- More complex code in the React library
  - Harder to maintain
  - Larger bundle size
- When the user clicks on a faulty button, the whole component crashes rather than a single aspect of it failing

This doesn't seem worth the tradeoffs when we're able to add our own `try/catch` handlers inside of event handlers.

After all, a partially broken application is better than a fully broken one!



## Angular

Angular utilizes its [dependency injection system](/posts/ffg-fundamentals-dependency-injection) to allow developers to keep track of errors as they occur.

However, in order to provide the custom error handler service, you **must** provide it at the root of your application, meaning that you cannot simply provide it from your parent component.

<!-- // TODO: migrate to standalone APIs -->

```typescript
class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    // Do something with the error
    console.log(error);
  }
}

@NgModule({
  declarations: [/*...*/],
  imports: [/*...*/],
  // Declare your custom error handler here
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [/*...*/],
})
export class AppModule {}
```

Now that we've set up our `ErrorHandler` instance, we can test that it works using a component that throws an error:

```typescript
@Component({
  selector: 'child',
  template: `
    <p>Testing</p>
  `,
})
class ChildComponent implements OnInit {
  ngOnInit() {
    // This is an example of an error being thrown
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
```

## Vue

Vue enables us to track errors in an application with a simple `onErrorCaptured` composition API.

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

Now when we throw an error inside of a child component, like so:

```vue
<!-- Child.vue -->
<script setup>
throw 'Test'
</script>

<template>
  <p>Hello, world!</p>
</template>
```

It will run the function inside of `onErrorCaptured`.

<!-- tabs:end -->

Great! We're now able to keep track of what errors are occurring in our app. Hopefully, this allows us to address bugs as the user experiences them, making the app feel more stable as time goes on.

Now let's see if we're not able to make the experience a bit nicer for our users when they _do_ hit an error.

# Ignoring the Error

Some bugs? They're show stoppers. When the happen, you can't do anything to recover from the error and as a result you have to halt the user's ability to interact with the page.

Other bugs on the other hand may not require such harsh actions. For example, if you can silently log an error, pretending that nothing ever happened and allowing the app to continue on as normal, that is oftentimes a better user experience.

Let's see how we can implement this in our apps.

<!-- tabs:start -->

## React

Unfortunately, React is not able to handle thrown errors invisibly to the user when they're thrown within a functional component. This is ultimately because React functional components are simply functions, which do not have an escape mechanism built into them for errors being thrown.

## Angular

Luckily for Angular developers, this idea of silently swallowing errors, rather than making the page go blank, is the default behavior of a custom error handler.

This isn't always ideal, however, and oftentimes you want to present an error that occurs to the user. We'll take a look at how to do this in the next section.

## Vue

In order to avoid an error blanking out your Vue application, simply return `false` from your `onErrorCaptured` composition.

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

While silently failing _can_ be a valid strategy to hiding errors from your user, other times you may want to display a different UI when an error is thrown.

For example, let's build a screen that tells the user that an unknown error has occurred when something is thrown.

<!-- tabs:start -->

## React

Because our `ErrorBoundary` component renders the children that's passed in, we can update our state when an error occurs. To do this, React provide a special _static_ handler method called `getDerivedStateFromError` which allows us to set a property in our `state` object when an error is hit.

```jsx
class ErrorBoundary extends Component {
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

Because a custom error handler is implemented using an Angular service, we can use our `inject` function to gain access to the error handler.

From there, it's as simple as storing a Boolean when an error _is_ thrown and using that Boolean to render out a fallback UI when `true`. 

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
  selector: 'my-app',
  template: `
    <p *ngIf="errorHandler.hadError">There was an error</p>
    <child *ngIf="!errorHandler.hadError"></child>
  `,
})
class AppComponent {
  errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

// Provide the error handler
```

> Unlike most instances of `inject` usage, we have to use `as MyErrorHandler`, otherwise TypeScript does not know about the new `hadError` property we just set.

## Vue

Because we still have full access to our component's state within `onErrorCaptured`, we can change a `ref` from `false` to `true` to keep track of if an error occurred.

If it hasn't render our main app, otherwise render our fallback UI.

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

While displaying a fallback UI is often to the user's benefit, most users want some indication of _what_ went wrong, rather than simply "something" went wrong.

Let's display to our users the error that's thrown by the component.

<!-- tabs:start -->

### React

While we previously used `getDerivedStateFromError` to set a Boolean in our `state` object, we can instead use the first argument of the static handler to assign the object to an [`Error` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). 

```jsx
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
      return { error: error };  
  }
  
  componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);  
  }
  
  render() {
    if (this.state.error) {
    	return <h1>{this.state.error}</h1>;    
    }
    return this.props.children; 
  }
}
```



### Angular

Rather than storing a Boolean when an error occurs, we can store [the error value itself](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) within an `error` object, and display the underlying value when present.

```typescript
import {
  Component,
  NgModule,
  inject,
  ErrorHandler,
  OnInit,
} from '@angular/core';

class MyErrorHandler implements ErrorHandler {
  error = null;

  handleError(error) {
    console.log(error);
    this.error = error;
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p *ngIf="errorHandler.error">{{errorHandler.error}}</p>
    <child *ngIf="!errorHandler.error"></child>
  `,
})
class AppComponent {
  errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

// ...
```



### Vue

Using our `ref` to keep track of the error, we can then display the error's contents on-screen when it occurs.

```vue
<!-- App.vue -->
<script setup>
import { onErrorCaptured, ref } from 'vue'

import Child from './Child.vue'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  console.log(err, instance, info)
  error.value = error
  return false
})
</script>

<template>
  <p v-if="hadError">{{ hadError }}</p>
  <Child v-if="!hadError" />
</template>
```

<!-- tabs:end -->

# Challenge

Let's say that we were building out [our previous code challenge](/posts/ffg-fundamentals-component-reference#Challenge) and accidentally typo-d the name of a variable in our `Sidebar` component:

<!-- tabs:start -->

## React

```jsx
export const Sidebar = forwardRef(({ toggle }, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const setAndToggle = (v) => {
    setIsCollapsed(v);
    toggle(v);
  };

  // ...

  const toggleCollapsed = () => {
    setAndToggle(isCollapsed);
  };

  /**
   * `collapsed` doesn't exist!
   * It's supposed to be `isCollapsed`! 😱
   */
  if (collapsed) {
    return <button onClick={toggleCollapsed}>Toggle</button>;
  }

  return (
    <div>
      <button onClick={toggleCollapsed}>Toggle</button>
      <ul style={{ padding: '1rem' }}>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
    </div>
  );
});

const collapsedWidth = 100;
const expandedWidth = 150;

export default function App() {
  const [width, setWidth] = useState(expandedWidth);
  const sidebarRef = useRef();

  // ...

  return (
    <Layout
      sidebarWidth={width}
      sidebar={
        <Sidebar
          ref={sidebarRef}
          toggle={(isCollapsed) => {
            if (isCollapsed) {
              setWidth(collapsedWidth);
              return;
            }
            setWidth(expandedWidth);
          }}
        />
      }
    >
      <p style={{ padding: '1rem' }}>Hi there!</p>
    </Layout>
  );
}
```

## Angular

// TODO: Port code

## Vue

// TODO: Port code

<!-- tabs:end -->

Upon rendering the sidebar, we're greeted with an error:
```javascript
collapsed is not defined
```

While we can solve this by correcting the typo, we'll also want to add an error handler to log these kinds of issues in case they happen in production. After all, [if a bug is found in the wild without a way to report it back to the developer, is it ever fixed](https://en.wikipedia.org/wiki/If_a_tree_falls_in_a_forest)?

Let's solve this by:

- Figuring out how the user will report bugs
- Implementing an error handler
- Showing the user a nicer error screen

## Reporting Bugs Back to Developers

Let's provide the user a means to email us if they find something similar in their time using the app.

We can do this by showing the user [a `mailto:` link](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#email_links) when an error occurs. That way, reporting the bug is a single mouse click.

This `mailto:` link might look like the following HTML

```html
<a href="mailto:dev@example.com&subject=Bug%20Found&body=There%20was%20an%20error">Email Us</a>
```

Where `subject` and `body` are encoded using `encodeURIComponent` like so:

```javascript
// JavaScript psuedo-code
const mailTo = "dev@example.com";

const errorMessage = `
There was some error that occured. It's unclear why that happened.
`;

const header = "Bug Found"

const encodedErr = encodeURIComponent(errorMessage);

const encodedHeader = encodeURIComponent(header);

const href = `mailto:${mailTo}&subject=${encodedHeader}&body=${encodedErr}`;

// HREF can be bound via each frameworks' attribute binding syntax
const html = `<a href="${href}">Email Us</a>`
```

## Implementing the Error Handler

// TODO: Write

<!-- tabs:start -->

### React

```jsx
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: error };
  }

  render() {
    const err = this.state.error;
    if (err) {
      return (
        <div>
          <h1>There was an error</h1>
          <pre>
            <code>{err.message}</code>
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [width, setWidth] = useState(expandedWidth);
  const sidebarRef = useRef();

  // ...

  return (
    <ErrorBoundary>
      <Layout
        sidebarWidth={width}
        sidebar={
          <Sidebar
            ref={sidebarRef}
            toggle={(isCollapsed) => {
              if (isCollapsed) {
                setWidth(collapsedWidth);
                return;
              }
              setWidth(expandedWidth);
            }}
          />
        }
      >
        <p style={{ padding: '1rem' }}>Hi there!</p>
      </Layout>
    </ErrorBoundary>
  );
}
```

### Angular

// TODO: Port the code


### Vue

// TODO: Port the code

<!-- tabs:end -->





## Showing a Nicer Error Message

// TODO: Write

<!-- tabs:start -->

### React

```jsx
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: error };
  }

  render() {
    const err = this.state.error;
    if (err) {
      const mailTo = 'dev@example.com';
      const header = 'Bug Found';
      const message = `
      There was a bug found of type: "${err.name}".

      The message was: "${err.message}".

      The stack trace is:

      """
      ${err.stack}
      """
      `.trim();

      const encodedMsg = encodeURIComponent(message);

      const encodedHeader = encodeURIComponent(header);

      const href = `mailto:${mailTo}&subject=${encodedHeader}&body=${encodedMsg}`;

      return (
        <div>
          <h1>{err.name}</h1>
          <pre>
            <code>{err.message}</code>
          </pre>
          <a href={href}>Email us to report the bug</a>
          <br />
          <br />
          <details>
            <summary>Error stack</summary>
            <pre>
              <code>{err.stack}</code>
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Angular

// TODO: Port code sample

### Vue

// TODO: Port code sample

<!-- tabs:end -->

