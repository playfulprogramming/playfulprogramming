---
{
    title: "Share Lifecycle Methods in Angular using Base Classes",
    description: "",
    published: '2022-09-13T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['angular', 'javascript', 'webdev'],
    attached: [],
    license: 'cc-by-4'
}
---

In recent years, we've seen frameworks like React and Vue develop utilities to share code that uses lifecycle methods. What does that look like?

> I promise this article is about Angular, stick with me on this.

For example, if you wanted to have a component that measures the browser window, you might write some code like so:

<!-- tabs:start -->

# React

```jsx
const App = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);
  
  return <p>The window is {height}px high and {width}px wide</p>
}
```

# Vue

```vue
<!-- App.vue -->
<template>
	<p>The window is {{height}}px high and {{width}}px wide</p>
</template>

<script setup>
import {ref, onMounted, onUnMounted} from 'vue';
  
const height = ref(window.innerHeight);
const width = ref(window.innerWidth);
  
function onResize() {
  height.value = window.innerHeight;
  width.value = window.innerWidth;
}
  
onMounted(() => {
  window.addEventListener('resize', onResize);
});

onUnMounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>
```

<!-- tabs:end -->

> Like seeing equivical code between multiple frameworks at once? You might like the book I'm writing called ["The Framework Field Guide", which teaches React, Angular, and Vue all at once](https://framework.guide).

This works great for a single component, but what if you want to reuse this `window` logic in more than one component?

While you _could_ copy and paste the code between multiple components, or even export functions to setup and take down the event listeners, both of these methods are clunky. This is where the aforementioned Hooks and Composition APIs come into play for React and Vue respectively.

<!-- tabs:start -->

# React

```jsx
const useWindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

	return {height, width};  
}

const App = () => {
  const {height, width} = useWindowSize();
  return <p>The window is {height}px high and {width}px wide</p>
}
```

# Vue

```typescript
// useWindowSize.ts
import {ref, onMounted, onUnMounted} from 'vue';

export const useWindowSize = () => {
  const height = ref(window.innerHeight);
  const width = ref(window.innerWidth);

  function onResize() {
    height.value = window.innerHeight;
    width.value = window.innerWidth;
  }

  onMounted(() => {
    window.addEventListener('resize', onResize);
  });

  onUnMounted(() => {
    window.removeEventListener('resize', onResize);
  });
  
  return {height, width};
}
```

```vue
<!-- App.vue -->
<template>
	<p>The window is {{height}}px high and {{width}}px wide</p>
</template>

<script setup>
import {useWindowSize} from './useWindowSize';
  
const {height, width} = useWindowSize();
</script>
```

<!-- tabs:end -->

This enables us to use the `useWindowSize` logic in more than one component - lifecycle methods and all.

But what about Angular? How can you reuse code logic, including lifecycle methods, without having to copy and paste code?

Answer: A base component class that you extend. 

>  Before we go on **please note that this method of extending lifecycle methods is generally frowned upon by Angular experts, as it's difficult to maintain and is often brittle. Instead, it's suggested to use a per-component dependency injection provided class instance with functions you call manually.**
>
> This article is mostly for educational purposes to explain _how_ to do this base component method. Make sure you have a good reason for doing so if you want to continue.



# What is an extension class, anyway?

Let's work off of the assumption that you're familiar with what a class is, but may not be familiar with what class extension or inheretence is.

Very quickly, let's assume that we have this JavaScript class:

```javascript
class HelloMessage {
	message = "Hello";
 	name = "";
  
  constructor(name) {
    this.name = name;
  }
  
  sayHi() {
    console.log(`${this.message} ${this.name}`);
  }
}

const messageInstance = new HelloMessage("Corbin");
messageInstance.sayHi(); // Will log "Hello Corbin"
```

This class has a few things going on:

- Two properties: `message` and `name`
- A constructor, with a parameter to set `name` to a new value
- A method of `sayHi`

When we create an "instance" of this class, it will in turn call the `constructor` and give us an object with all of the properties and methods associated with `HelloMessage` as an "instance" of that class.



Now, let's say that we want to reuse the `sayHi` logic in multiple classes at a time.

> Sounds like a familiar problem, doesn't it?

We can create a class that provides the `sayHi` method:

```javascript
class BaseHelloMessage {
	message = "Hey there!";
 	name = "";
  
  constructor(name) {
    this.name = name;
  }
  
  sayHi() {
    console.log(`${this.message} ${this.name}`);
  }
}
```

Now, we can create multiple classes that have the same properties and methods as `BaseHelloMessage` by using `extends`:

```javascript
class HelloMessage extends BaseHelloMessage {
}

const helloMsgInstance = new HelloMessage("Corbin");
// Inhereted from "BaseHelloMessage"
helloMsgInstance.sayHi();

class OtherHelloMessage extends BaseHelloMessage {
}

const otherHelloMsgInstance = new OtherHelloMessage("Corbin");
// Also inhereted from "BaseHelloMessage"
console.log(otherHelloMsgInstance.name);
```

But oh no! `message` is set to `"Hey there!"`, which isn't what we want for `OtherHelloMessage`. Instead, let's _overwrite_ the `message` property to be `"Hi-a!"`

We can easily do this by using an "Override":

```javascript
// `sayHi` will output "Hey there! Corbin"
class HelloMessage extends BaseHelloMessage {
}

// `sayHi` will output "Hi-a! Corbin"
class OtherHelloMessage extends BaseHelloMessage {
  message = "Hi-a!";
}
```

This works in JavaScript, but TypeScript will give you a small warning:

> TS4114: This member must have an 'override' modifier because it overrides a member in the base class 'BaseComponent'.

To solve this, we can simply change `OtherHelloMessage` to be:

```typescript
// `sayHi` will output "Hi-a! Corbin"
class OtherHelloMessage extends BaseHelloMessage {
  override message = "Hi-a!";
}
```

Okay, now that we understand class extensions, let's see how we can use them in Angular!

# How to use basic class extension usage in Angular

Let's assume that we're writing the following class in Angular, in order to get the window size and display it to the user:

```typescript
@Component({
  template: `
    <p>The window is {{height}}px high and {{width}}px wide</p>
  `,
  selector: 'app-root'
})
class AppComponent implements OnInit, OnDestroy {
  height = window.innerHeight;
  width = window.innerWidth;

  // This needs to be an arrow function
  onResize = () => {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  ngOnInit() {
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}
```

But still wanted to share this `window` size logic between multiple components.

Luckily, we can do this using a traditional Object-Oriented Programming (OOP) method: Create a base class that we extend later.

Let's try this really quick and create a `BaseComponent` class:

```typescript
class BaseComponent implements OnInit, OnDestroy {
  height = window.innerHeight;
  width = window.innerWidth;

  // This needs to be an arrow function
  onResize = () => {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  ngOnInit() {
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>The window is {{height}}px high and {{width}}px wide</p>
  `,
})
class AppComponent extends BaseComponent {
}
```

This might look correct, but yeilds us a compiler error:

```
Error: src/app/app.module.ts:5:7 - error NG2007: Class is using Angular features but is not decorated. Please add an explicit Angular decorator.
```

To fix this, we simply need to follow the instructions of the TypeScript compiler warning. Because `BaseComponent` could be almost considered to be a component, let's create it as an instance of such:

```typescript
@Component({
  template: '',
  selector: 'base-component'
})
class BaseComponent implements OnInit, OnDestroy {
  height = window.innerHeight;
  width = window.innerWidth;

  // This needs to be an arrow function, otherwise `this` will bind to the Window
  // For more, see: https://twitter.com/crutchcorn/status/1530104879271645184
  onResize = () => {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  ngOnInit() {
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>The window is {{height}}px high and {{width}}px wide</p>
  `,
})
class AppComponent extends BaseComponent {
}
```

This solves the error and now `AppComponent` tracks resizing as-expected!

You'll notice, however, that while `BaseComponent` does have the `implements` keyword, the `AppComponent` does not. While it's seemingly not a _requirement_ to have the `implements` keyword on `AppComponent` in modern versions of Angular, it's still highly suggested.

```typescript
@Component({
  selector: 'app-root',
  template: `
    <p>The window is {{height}}px high and {{width}}px wide</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit, OnDestroy {
}
```

This is because it's easier to glance at the `AppComponent` code and see what lifecycle methods are used in the extended class or not.

# Simplifying Base Component Usage by using `@Injectable`

While our `BaseComponent` is extendible now, there's a new frustration that's arose as a result of using the `@Component`: We just registered a new component that can be accidentally used in another component's template.

For example, if we had a template that looked like:

```html
<base-component></base-component>
```

We wouldn't get a compiler error, but would have a loose bit of code running needlessly. Ideally we'd like to have `BaseComponent` still able to use lifecycle methods without registering a new template tag.

Fortunately, that's possible, as of Angular 9; simply remove `BaseComponent`'s `@Component` `selector` property and it won't register a new tag.

```typescript
@Component({
  template: ''
})
class BaseComponent implements OnInit, OnDestroy {
  // ...
}
```

That solves one problem, but still leaves one present with using `@Component`: you must add a declaration of the `BaseComponent` into an `NgModule`. Otherwise, you'll end up with the following error during compilation:

```
BaseComponent is not declared in any Angular module 
```

Luckily, [since Angular 10 you can now use `@Injectable` to declare your `BaseComponent` instead](https://angular.io/guide/migration-injectable). This sidesteps the problem because `Injectable`s do not need to be declared:

```typescript
@Injectable()
class BaseComponent implements OnInit, OnDestroy {
  // ...
}
```

You might expect there to be some migration of `AppComponent` when you're using `@Injectable` instead of `@Component` for the `BaseComponent`, but alas there is not.

```typescript
@Injectable()
class BaseComponent implements OnInit {
  ngOnInit() {
    console.log('I AM BASE COMPONENT');
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent {
}
```

# Overwriting Lifecycle Methods

// TODO: Write

```
@Injectable()
class BaseComponent implements OnInit {
  ngOnInit() {
    console.log('I AM BASE COMPONENT');
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit {
  override ngOnInit() {
    super.ngOnInit();
  }
}
```



# Use Dependency Injection with your extended class

// TODO: Write

```typescript
import {Component, Inject, Injectable, NgModule, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable()
class BaseComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngOnInit() {
    console.log(document.title);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit {
}
```





# Overwriting `constructor` behavior

// TODO: Write

```
TS2554: Expected 1 arguments, but got 0.

app.module.ts(7, 15): An argument for 'document' was not provided.
```



```typescript
@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit {
  // This code doesn't work. Read on to learn why
  constructor(@Inject(DOCUMENT) private document: Document) {
    super(document);
    console.log(document.body);
  }
}
```

Similar to how we had to add `override` to our `AppComponent`'s lifecycle methods, we need to do the same with our constructor. Otherwise, we'll see the following error:

```
TS4115: This parameter property must have an 'override' modifier because it overrides a member in base class 'BaseComponent'.
```

Let's update the code to show what that might look like:

```typescript
@Injectable()
class BaseComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngOnInit() {
    console.log(document.title);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private override document: Document) {
    super(document);
    console.log(document.body);
  }
}
```

While this might appear to work at first, you'll quickly find a compiler error with the following code:

```
TS2415: Class 'AppComponent' incorrectly extends base class 'BaseComponent'.
   Types have separate declarations of a private property 'document'.
```

To solve this, we simply need to make our `BaseComponent`'s `constructor` properties `public` instead of `private`:

```typescript
@Injectable()
class BaseComponent implements OnInit {
  constructor(@Inject(DOCUMENT) public document: Document) {}
  ngOnInit() {
    console.log(document.title);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit {
  constructor(@Inject(DOCUMENT) public override document: Document) {
    super(document);
    console.log(document.body);
  }
}
```

> Remember to keep your `override` property in the `AppComponent` `constructor`, otherwise you'll have errors.