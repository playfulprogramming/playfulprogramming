---
{
    title: "How to Share Lifecycle Methods Between Components in Angular",
    description: "Sharing code between components in Angular is TOUGH. Here's one way you can do so by utilizing base components that you extend - and why you shouldn't use them.",
    published: '2022-08-20T21:52:59.284Z',
    authors: ['crutchcorn', 'LayZee'],
    tags: ['angular', 'javascript', 'webdev'],
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

In this article we'll learn:

- [What a base component class is](#base-class)
- [How to use a base class in Angular](#base-class-angular)
- [How to simplify Angular base class usage using an abstract class](#abstract-class)
- [Overwriting lifecycle methods in Angular extended classes](#lifecycle-methods)
- [Using dependency injection with your extended class](#dependency-injection)
- [Why you don't want to use base classes with Angular](#dont-extend-base-classes)

# What is an extension class, anyway? {#base-class}

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

# How to use basic class extension usage in Angular {#base-class-angular}

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

This might look correct, but yields us a compiler error:

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

You'll notice, however, that while `BaseComponent` does have the `implements` keyword, the `AppComponent` does not. While it's seemingly not a _requirement_ to have the `implements` keyword on `AppComponent` in modern versions of Angular, I'd personally still highly suggested.

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

# Simplify Base Component Usage by using an abstract class {#abstract-class}

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

To solve this, we can either import `BaseComponent` in an `NgModule` or, alternatively, mark `BaseComponent` as an abstract class:

```typescript
@Component({
  template: ''
})
abstract class BaseComponent implements OnInit, OnDestroy {
  // ...
}
```

## `@Injectable` is an alternative of an abstract class {#injectable}

[Since Angular 10 you can now use `@Injectable` to declare your `BaseComponent` instead](https://angular.io/guide/migration-injectable). This sidesteps the problem of having to mark a component `class` as abstract because even without it `Injectable`s do not need to be declared in a module:

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

That said, [while using `@Injectable` is explicitly supported](https://github.com/angular/angular/issues/41229#issuecomment-800310757), it's very hacky to use this in place of `@Component`. This is because Angular's `@Injectable`s do not support lifecycle methods without a `Component` that extends it.

As such, we'll be sticking to the `abstract` class solution.

# Overwriting Lifecycle Methods {#lifecycle-methods}

If you recall from our quick overview of what a base class does, you can replace the base class implementation of both methods and properties.

The same is true for lifecycle methods, since they're just a type of method on the component class instance.

```typescript
@Component({
  template: ''
})
abstract class BaseComponent implements OnInit {
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
    console.log("And I am the AppComponent")
  }
}
```

The downside here, however, is that `ngOnInit` on `AppComponent` will no longer call the `BaseComponent`'s `ngOnInit` logic. After all, what if you wanted to simply _add_ behavior to `ngOnInit`, rather than replace it entirely?

Luckily, we can use the `super` keyword to refer to the base class instance and call the original method inside of the overwritten method:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit {
  override ngOnInit() {
    // This will log `I AM BASE COMPONENT`
  	super.ngOnInit();
    console.log("And I am the AppComponent")
  }
}
```

# Use Dependency Injection with your extended class {#dependency-injection}

While you're able to use global `window` variable in a browser environment, if you're attempting to use `window` in a [server-side rendered](/posts/what-is-ssr-and-ssg) Angular application, it will throw an error.

```
window is not defined
```

To solve this problem you can use Angular's dependency injection to inject an instance of `document` to `BaseComponent`, and get access to the `window` through `defaultView` that way:

```javascript
@Component({
  template: ''
})
abstract class BaseComponent implements OnInit, OnDestroy {
  window!: Window;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = document.defaultView!;
  }
}
```

Because of this, this is the recommended way to get access to the `document` and `window` instance inside of an Angular component, even if it's a non-SSR app.

Luckily, this works out-of-the-box with extended Angular component classes:

```typescript
import {Component, Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
  template: ''
})
abstract class BaseComponent implements OnInit, OnDestroy {
  window!: Window;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = document.defaultView!;
  }

  height = this.window.innerHeight;
  width = this.window.innerWidth;

  // This needs to be an arrow function
  onResize = () => {
    this.height = this.window.innerHeight;
    this.width = this.window.innerWidth;
  }

  ngOnInit() {
    this.window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    this.window.removeEventListener('resize', this.onResize);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>The window is {{height}}px high and {{width}}px wide</p>
  `,
})
class AppComponent extends BaseComponent implements OnInit, OnDestroy {
}
```



## Overwriting `constructor` behavior {#overwriting-constructors}

When working with class extension, regardless of being used in Angular or in JavaScript itself, you need to call `super()` when trying to overwrite a constructor:

```javascript
class BaseClass {
  name = "";
  constructor() {
    name = "Frank";
  }
}

class AppClass extends BaseClass {
	constructor() {
		// This is required
    super();
	}
}
```

Without calling `super`, you'll get the following error:

```
Uncaught ReferenceError: must call super constructor before using 'this' in derived class constructor
```

Likewise, you need to call `super` when overwriting a class component's `constructor` as well.

```typescript
@Component({
  template: ''
})
abstract class BaseComponent {
  name = "";
  constructor() {
    this.name = "Kevin";
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>{{name}}</p>
  `,
})
class AppComponent extends BaseComponent {
  constructor() {
    super();
    this.name = "Corbin";
  }
}
```

This water gets muddied when using dependency injection in a base component that utilizes dependency injection.

```typescript
@Component({
  template: ''
})
abstract class BaseComponent {
  window!: Window;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = document.defaultView!;
  }

  // ...
}

@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent {
  // This code doesn't work. Read on to learn why
  constructor() {
    super();
  }
}
```

As the `super` method needs to be passed with the same arguments from dependenct injection, least we see the following error:

```
TS2554: Expected 1 arguments, but got 0.
  app.component.ts(8, 15): An argument for 'document' was not provided.
```

To solve this, we need to pass `document` from a new instance of `AppComponent`'s dependency injection to `BaseComponent`:

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

But alas, this does not work!

Similar to how we had to add `override` to our `AppComponent`'s lifecycle methods, we need to do the same with our constructor. Otherwise, we'll get this error:

```
TS4115: This parameter property must have an 'override' modifier because it overrides a member in base class 'BaseComponent'.
```

Let's update the code to show what that might look like:

```typescript
@Component({
  template: ''
})
abstract class BaseComponent implements OnInit {
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

Something worth mentioning is that this code _still_ doesn't work. You'll see a compiler error with the following code:

```
TS2415: Class 'AppComponent' incorrectly extends base class 'BaseComponent'.
   Types have separate declarations of a private property 'document'.
```

To solve this, we simply need to make our `BaseComponent`'s `constructor` properties `public` instead of `private`:

```typescript
@Component({
  template: ''
})
abstract class BaseComponent implements OnInit {
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

Alternatively, we can stop using parmeter properties in `BaseComponent` and just not mark the field as `public` _or_ `private`, like so:

```typescript
@Component({
  template: ''
})
abstract class BaseComponent implements OnInit {
  private document: Document;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document;
  }

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
  constructor(@Inject(DOCUMENT) document: Document) {
    super(document);
    console.log(document.body);
  }
}
```

## You don't need to use `constructor` to use Dependency Injection {#inject-function}

While our previous code works, it comes with the caveat that you have to still refactor your extended classes in the instance that you want to add a new injection into your base class.

Luckily, Angular 14 introduces the ability to use the `inject` function which removes the need to use `constructor` to use dependency injection. The API is relatively straightforward, replace `constructor` usage of Dependency Injection with the `inject` function as a property initializer:

```tsx
import { inject } from '@angular/core';

@Component({
  template: ''
})
abstract class BaseComponent {
  // The `Document` type annotation is optional as it can be inferred by the `inject` function
  private document: Document = inject(DOCUMENT);
  
  window!: Window = this.document.defaultView;

  // No constructor needed as we use property injection instead of constructor injection
  
  // ...
}
```

Because of this, our `AppComponent` class can be much simpler:

```tsx
@Component({
  selector: 'app-root',
  template: `
    <p>Test</p>
  `,
})
class AppComponent extends BaseComponent {
  // This code now works as the base class doesn't have constructor parameters anymore
  constructor() {
    super();
  }
}
```



# Why you don't want to extend Angular base classes {#dont-extend-base-classes}

Now that we've learned how to extend base classes in Angular to share lifecycle methods, allow me to flip the script:

**You shouldn't use a base class in Angular**.

<video title="A shocked sock puppet monkey" src="./shocked-monkey-gif.mp4"></video>

Why?

Well, it's often cited by Angular experts that using a base class is brittle and difficult to maintain.

For example, let's say that you have a base component that doesn't use dependency injection, but then suddenly need to add dependency injection. What do you do?

Well, you'd have to refactor every instance that you extended that class.

Similarly, if you add a lifecycle method that you want to overwrite in the future, there can be someheadaches depending in which order you do things in.

While [the `inject` function](#inject-function) solves some of these problems, it implicitly introduces a new dependency, which might:

- Result in run-time errors thanks to missing providers
- Break or make testing more difficult for the same reason

Plus, there are more than a few ways to write this code in a different, more stable, way.

## Fixing things the right way {#the-fix}

There are better ways to write the `WindowSize` code differently today that solve the problems of maintainability a bit better.

Let's take a look at two different methods for fixing the problem:

- A naïve implementation that replaces lifecycle methods for manual function calls
- A more "Angular" way of fixing the issue, using RxJS

## The naïve way to fix the issue

A simple way of fixing some of the maintainability problems of using lifecyle methods , using an `@Injectable` class that's provided on a per-class level enables you to have the `constructor` method setup side effects and the `Injectable`'s `ngOnDestroy` lifecycle method take it down:

> Remember, `Injectable`s don't have `ngOnInit`!

```typescript
@Injectable()
class WindowSizeService implements OnDestroy {
  private window!: Window;
  height = 0;
  width = 0;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.window = document.defaultView!;
    this.height = this.window.innerHeight
    this.width = this.window.innerWidth
    window.addEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>The window is {{windowSize.height}}px high and {{windowSize.width}}px wide</p>
  `,
  providers: [WindowSizeService]
})
class AppComponent {
  constructor(public windowSize: WindowSizeService) {
  }
}
```

This code functions, but introduces other issues when it comes to maintainability. After all, if you want to pass something into `addListeners` or `removeListeners`, you introduce the same refactoring issue you had previously.

Further, `height` and `width` are simply mutated which, while will still trigger change detection, makes it difficult to impossile to track when they've changed. Ideally, we should have a way to know when `height` and `width` are changed.

If only Angular had a way to track a series of changes in some kind of... Observable...

Oh!

## The Angular way to fix the code

While mutable properties can get the job done, they're far from optimal. Let's instead leverage `rxjs`, which is built into Angular after all, to create an observable.

For this type of DOM event listening, RxJS exposes a [`fromEvent`](https://rxjs.dev/api/index/function/fromEvent) method that we can pipe into a [`map`](https://rxjs.dev/api/operators/map) to create an [Observable](https://rxjs.dev/guide/observable).

```typescript
import {fromEvent, debounceTime, map, Subject, takeUntil, Observable} from 'rxjs';

interface WindowSize {
  readonly height: number;
  readonly width: number;
}

@Injectable()
class WindowSizeService implements OnDestroy {
  private destroy$ = new Subject<void>();

  size$: Observable<WindowSize>;

  constructor(@Inject(DOCUMENT) document: Document) {
    const window = document.defaultView!;
    this.size$ = fromEvent(window, 'resize').pipe(
      debounceTime(50),
      map(() => ({
        height: window.innerHeight,
        width: window.innerWidth,
      })),
      startWith({
        height: window.innerHeight,
        width: window.innerWidth,
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

This is a much more straightforward setup process that's much more Angular-ific!

As an added benifit, we now can utilize an [`AsyncPipe`](https://angular.io/api/common/AsyncPipe) in order to listen for changes on the `size$` observable:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <p *ngIf="windowSize.size$ | async as size">The window is {{size.height}}px high and {{size.width}}px wide</p>
  `,
  providers: [WindowSizeService]
})
class AppComponent {
  windowSize = inject(WindowSizeService);
}
```



# Conclusion

And that's it! I hope this has been an insightful look into how you can extend component logic.

And this isn't an area of stagnation within Angular - they're introducing new functionality to share component logic using [the upcoming `hostDirectives` API](https://github.com/angular/angular/pull/46868).

Hey, while you're here - do you want to learn more Angular in-depth like this? Maybe you've been working in Angular for some time and want to learn React or Vue, but not start from scratch?

Check out [my free book, "The Framework Field Guide", that teaches React, Angular, and Vue all at the same time.](https://framework.guide).
