---
{
    title: "Dependency Injection",
    description: "Passing around props sucks. They're trivial get out of sync and easy to forget to pass. What if there was a better way to pass data between different parts of your app?",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 12,
    series: "The Framework Field Guide"
}
---

One of the core tenants of components we've used repeatedly in the book is the idea of component inputs, or properties.

While component inputs work well for one-off behavior, it can be challenging to scale when you need the same set of data across multiple components.

For example, let's look back at our files app we've been developing throughout the book.

![// TODO: Add alt](./file_list_owner.png);

Here, we have a list of files, the user's profile picture in the corner of the screen. Here's an example of what our data for the page looks like:

```javascript
const APP_DATA = {
    currentUser: {
    	name: "Corbin Crutchley",
        profilePictureURL: "https://avatars.githubusercontent.com/u/9100169"
    },
	collection: [
		{
            name: "Movies",
            type: "folder",
			ownerName: null,
            size: 386547056640
		},
		{
            name: "Concepts",
            type: "folder",
			ownerName: "Kevin Aguillar",
            size: 0
		}
	]
}
```

> This data has been shortened to keep focus

Let's say that every time we see `null` where the `ownerName` is, we want to replace this information with the `currentUser`'s `name` field.

Let's use some pseudo-code and mock out what those components might look like with data passing from the parent to the child:

```jsx
// This is not real code, but demonstrates how we might structure our data passing
// Don't worry about syntax, but do focus on how data is being passed between components
const App = {
    data: APP_DATA,
    template: <div>
    	<Header currentUser="data.currentUser"/>
        <Files files="data.collection" currentUser="data.currentUser"/>
     </div>
}

const Header = {
    props: ['currentUser'],
    template: <div>
    	<Icon/>
        <SearchBar/>
        <ProfilePicture currentUser="props.currentUser"/>
    </div>
}


const ProfilePicture = {
    props: ['currentUser'],
    template: <img src="props.currentUser.profilePictureURL"/>
}

const Files = {
    props: ['currentUser', 'files'],
    template: <FileTable>
    	{props.files.map(file => <FileItem file="file" currentUser="props.currentUser"/>)}
    </FileTable>
}

const FileItem = {
    props: ['currentUser', 'file'],
    template: <tr>
    	<FileName file="props.file"/>
    	<LastModified file="props.file"/>
    	<FileOwner file="props.file" currentUser="props.currentUser"/>
    	<FileType file="props.file"/>
    	<FileSize file="props.file"/>
    </tr>
}

const FileOwner = {
    props: ['currentUser', 'file'],
    data: {
        userNameToShow: props.file.ownerName || props.currentUser.name
    },
    template: <td>{{userNameToShow}}</td>
}

render(App);
```

While this isn't real code, we can make a simple discovery by looking at our code laid out like this: We're passing `currentUser` to almost every single component!

While it's obnoxious to pass `currentUser` in every component, we need that data in all of these components, so we can't simply remove the inputs, can we?

Well, we can! Sort of...

What we **can** do is pass these components _implicitly_ instead of _explicitly_. This means that instead of telling the child component what data it should accept, we simply hand off data regardless of if it's needed or not. From there, it's the child component's job to raise it's hand and ask for data.

<!-- Editor's TODO: Add image to go alongside the buffet analogy -->

Think of this like a food buffet. Instead of serving food directly to the customer's table, the customer comes to the table with all of the food, takes what it wants, and is satisfied with the results all-the-same.

We do this method of implicit data passing using a methodology called "dependency injection".

# Providing Basic Values with Dependency Injection

When we talk about dependency injection, we talk about a method of providing data from a parent component down to a child component. Each of these three frameworks provides a simple way of injecting data implicitly into their components.

Let's start with the most basic method of dependency injection by providing some simple values, like a number or string, down to a child component.

<!-- tabs:start -->

## React

In the React world, all dependency injection is powered by a `createContext` method, which you then `Provide` to your child components, and within those child components you consume the data with a `useContext` hook.

```jsx
import {createContext, useContext} from 'react';

// We start by creating a context name
const HelloMessageContext = React.createContext();

function Parent() {
  return (
	// Then create a provider for this context
    <HelloMessageContext.Provider value={'Hello, world!'}>
      <Child />
    </HelloMessageContext.Provider>
  );
};

function Child() {
  // Later, we use `useContext` to consume the value from dependency injection
  const helloMessage = useContext(HelloMessageContext);
  return <p>{helloMessage}</p>;
};
```

## Angular

While other frameworks have a more singularly focused dependency injection API, Angular's dependency injection API is simultaneously more complex, but more powerful as a result.

Within Angular's DI system, it all starts with a `InjectionToken` of some kind. We'll start by importing Angular `InjectionToken` API, and creating a new token that we can use later. 

```typescript
import { InjectionToken, Component, Inject} from '@angular/core';

const WELCOME_MESSAGE_TOKEN = new InjectionToken('WELCOME_MESSAGE');
```

We'll then use this token to create a `provider` that we pass to a component's `providers` list:

```typescript
@Component({
  selector: 'app-root',
  template: `<child></child>`,
  providers: [
    {provide: WELCOME_MESSAGE_TOKEN, useValue: 'Hello, world!' },
  ]
})
export class AppComponent {
}
```

This API uses `useValue` to provide the value associated with the token we pass.

Finally, we use an `@Inject` decorator in our constructor to tell Angular "We want this value in our component".  

````typescript
@Component({
  selector: 'child',
  template: `<p>{{welcomeMsg}}</p>`
})
export class ChildComponent {
  constructor(@Inject(WELCOME_MESSAGE_TOKEN) public welcomeMsg: string) {}

  ngOnInit() {
    console.log(this.welcomeMsg);
  }
}
````

### `inject` function

Alongside Angular's `@Inject` decorator, there's a function called `inject` that we can use in our `ChildComponent` component to inject the value from our `InjectionToken` instead:

```typescript
import { InjectionToken, Component, inject} from '@angular/core';

@Component({
  selector: 'child',
  template: `<p>{{welcomeMsg}}</p>`
})
export class ChildComponent {
  welcomeMsg = inject(WELCOME_MESSAGE_TOKEN);

  ngOnInit() {
    console.log(this.welcomeMsg);
  }
}
```

## Vue

Vue's dependency injection API only has two parts to it:

1) A `provide` method, used to provide values from the parent component.
2) An `inject` method, used to get the provided values in the child component.

```vue
<!-- Parent.vue -->
<template>
  <child />
</template>

<script setup>
import { provide } from 'vue'
import Child from './Child.vue'

provide('WELCOME_MESSAGE', 'Hello, world!')
</script>
```

```vue
<!-- Child.vue -->
<template>
  <p>{{ welcomeMsg }}</p>
</template>

<script setup>
import { inject } from 'vue'

const welcomeMsg = inject('WELCOME_MESSAGE')
</script>
```

<!-- tabs:end -->

Here, we expect this component to show a `<p>` tag that renders out `"Hello, world!"`.

While this is convenient for passing simple values to multiple parts of the app, most usages of dependency injection tend to have more complex data provided. Let's extend this logic to provide an object to children instead.

<!-- tabs:start -->

## React

As we mentioned before, all of React's dependency injection logic uses `createContext`, `Provider`, and `useContext`. As such, to provide an object is a trivial change from before, simply by changing the `value` we pass to our provider:

````jsx
const HelloMessageContext = createContext();

const Child = () => {
  const helloMessage = useContext(HelloMessageContext);
  return <p>{helloMessage.message}</p>;
};

const Parent = () => {
  const helloMessageObject = { message: 'Hello, world!' };

  return (
    <HelloMessageContext.Provider value={helloMessageObject}>
      <Child />
    </HelloMessageContext.Provider>
  );
};
````

## Angular

 Because Angular's `useValue` accepts any arbitrary value, we can simply pass it an object to move away from a simple string injection:

```typescript
import { InjectionToken, Component, Inject } from '@angular/core';

const WELCOME_MESSAGE_TOKEN = new InjectionToken('WELCOME_MESSAGE');

@Component({
  selector: 'app-root',
  template: `<child></child>`,
  providers: [
    { provide: WELCOME_MESSAGE_TOKEN, useValue: { message: 'Hello, world!' } },
  ],
})
export class AppComponent {}

@Component({
  selector: 'child',
  template: `<p>{{welcomeMsg.message}}</p>`,
})
export class ChildComponent {
  constructor(
    @Inject(WELCOME_MESSAGE_TOKEN) public welcomeMsg: { message: string }
  ) {}
}
```

While this functions, it's not very clean. In particular, some of the headaches present with this method include:

- Duplicative TypeScript typings between `@Inject` usage and `useValue` providing
  - Mismatches can cause `undefined` bugs intentionally
- Needing to use `@Inject` decorator is overly verbose

Luckily for us, Angular provides a better solution for this problem than `useValue` and `InjectionToken`. 

Instead, let's create a class that we mark with an `@Injectable` decorator:

```typescript
import { Injectable, Component, OnInit } from '@angular/core';

@Injectable()
class InjectedValue {
  message = "Hello, world";
}
```

Here, we're telling Angular to treat our `InjectedValue` class as a `InjectionToken` that we can use by name in our `providers`.

```typescript
@Component({
  selector: "app-root",
  providers: [InjectedValue],
  template: `<child></child>`
})
class ParentComponent {
}
```

Finally, because our `InjectedValue` class was marked with `@Injectable`, we can remove our previous usage of `@Inject` inside of our child constructor:

```typescript
@Component({
  selector: "child",
  template: `<div>{{injectedValue.message}}</div>`
})
class ChildComponent implements OnInit {
  constructor(public injectedValue: InjectedValue) {}

  ngOnInit() {
    console.log(this.injectedValue);
  }
}
```

Much cleaner!

## Vue

Just like React, Vue's simple dependency injection API means that we only need to change our `provide` value to an object, and we're off to the races!

```vue
<!-- Parent.vue -->
<template>
  <child />
</template>

<script setup>
import { provide } from 'vue'
import Child from './Child.vue'

const welcomeObj = { message: 'Hello, world!' }
provide('WELCOME_MESSAGE', welcomeObj)
</script>
```

```vue
<!-- Child.vue -->
<template>
  <p>{{ welcomeMsgObj.message }}</p>
</template>

<script setup>
import { inject } from 'vue'

const welcomeMsgObj = inject('WELCOME_MESSAGE')
</script>
```

<!-- tabs:end -->

# Changing Values After Injection

While providing values from a parent node down to a child component is useful on its own, it's made even more powerful by the inclusion of data manipulation.

For example, what happens when your user wants to change their name with some kind of rename functionality? You should be able to change how the data is stored in your dependency injection to propagate those changes throughout your whole application immediately.

<!-- tabs:start -->

## React

Because our `Provider` is able to pass down values of any kind, we can combine this with `useState` in order to allow React to update the values for children.

```jsx
const HelloMessageContext = createContext();

const Child = () => {
  const helloMessage = useContext(HelloMessageContext);
  return <p>{helloMessage}</p>;
};

const Parent = () => {
  const [message, setMessage] = useState('Initial value');
  return (
    <HelloMessageContext.Provider value={message}>
      <Child />
      <button onClick={() => setMessage('Updated value')}>
        Update the message
      </button>
    </HelloMessageContext.Provider>
  );
};
```

When we update the `message` value, it will trigger a re-render on the `Child` component and, in turn, update the displayed message.

## Angular

Because we've marked our `InjectedValue` class as an `Injectable`, we can simply have the parent component request access in the `constructor` in order to mutate the class instance.

````typescript
@Injectable()
class InjectedValue {
  message = 'Initial value';
}

@Component({
  selector: 'app-root',
  providers: [InjectedValue],
  template: `
    <child></child>
    <button (click)="updateMessage()">Update the message</button>
  `,
})
class ParentComponent {
  // We can access the `injectedValue` from the same component we provide it from
  constructor(private injectedValue: InjectedValue) {}

  updateMessage() {
    this.injectedValue.message = 'Updated value';
  }
}

@Component({
  selector: 'child',
  template: `<p>{{injectedValue.message}}</p>`,
})
class ChildComponent {
  constructor(public injectedValue: InjectedValue) {}
}
````

## Vue

Vue's minimal API surface allows us to easily compose `ref` and `provide` usage in order to provide values that we can change after injection. 

```vue
<!-- Parent.vue -->
<template>
  <child />
  <button @click="updateMessage()">Update the message</button>
</template>

<script setup>
import { provide, ref } from 'vue'
import Child from './Child.vue'

const welcomeMessage = ref('Initial value')
provide('WELCOME_MESSAGE', welcomeMessage)

function updateMessage() {
  welcomeMessage.value = 'Updated value'
}
</script>
```

```vue
<!-- Child.vue -->
<template>
  <p>{{ welcomeMessage }}</p>
</template>

<script setup>
import { inject } from 'vue'

// Worth mentioning, `welcomeMessage` is now _not_ a string, but rather a `ref`
// If you needed to use `welcomeMessage` inside of `<script setup>`, you'd
// need to use `.value`
const welcomeMessage = inject('WELCOME_MESSAGE')
</script>
```

<!-- tabs:end -->

## Changing Injected Values from Child

While mutating the injected value is intrinsically valuable, we often want to change the value from the child component instead of from the root. However, because dependency injection is usually unidirectional (from the parent to the child), we have to rely on specific functionality of the frameworks to enable this functionality. 

Let's see how that's done:

<!-- tabs:start -->

### React

Before, we utilized the ability to use `useState` in our `Provider` in order to handle data changes from the parent provider.

Luckily, React's `useContext` enables us to pass data of _any_ kind, functions included. This means that we can pass both the getter and setter function of `useState`, like so:

```jsx

const HelloMessageContext = createContext();

function Parent() {
  const [message, setMessage] = useState('Initial value');
  // We can pass both the setter and getter
  const providedValue = { message, setMessage };
  return (
    <HelloMessageContext.Provider value={providedValue}>
      <Child />
    </HelloMessageContext.Provider>
  );
}

function Child() {
  // And later, access them both as if they were local to the component
  const { message, setMessage } = useContext(HelloMessageContext);
  return (
    <>
      <p>{message}</p>
      <button onClick={() => setMessage('Updated value')}>
        Update the message
      </button>
    </>
  );
}
```

#### Using a reducer pattern

While `useState` and `useContext` make a powerful combination for simple data passing using dependency injection, it's far from a perfect solution when dealing with large data sets.

For example, what happens if we want to implement a counter, that includes an `increment` and `decrement` function?

This is where `useReducer` might come into play. Let's take a step back for a moment, and remove the `useContext` method.

A "reducer" pattern involves a list of actions that the user can take. These actions are provided the current `state` value, which will be updated based on the returned value from the reducer.

> It's worth mentioning that the reducer pattern is not unique to React. That said, React is unique in that it has a built-in method to build reducers, unlike many other frameworks. 

Let's take a look at the most basic version of a `reducer` that only can count up from `0`:

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  return {count: state.count + 1}
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch()}>Add one</button>
    </>
  );
}
```

Here, whenever `dispatch` is called, it will run the `reducer` with no arguments for `action`, and React will automatically pass `state` for us. Then, when we `return` inside of the reducer, React will automatically keep track of the returned value as the new `state` value.

However, this isn't particularly useful and seems like more boilerplate than needed for what's effectively a simple `useState`. To make `useReducer` more worthwhile, we need to add more actions.

 For example, we'll have an `increment` and `decrement` action that will respectively add one and remove one from the `state`.

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Remove one
      </button>
    </>
  );
}
```

Here, we can pass a `type` object as a parameter of `reducer`'s `action`, run a `switch`/`case` over it, and return relevant data changes as-needed.

But that's not all we can do with a reducer! We can also pass in what's often called a `payload` in order to set raw data to our `state` as well:

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'set':
      return { count: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Remove one
      </button>
      <button onClick={() => dispatch({ type: 'set', payload: 0 })}>
        Set to zero
      </button>
    </>
  );
}
```

#### Reducer patterns within Contexts

Just like we were able to pass the `setValue` function from `useState`, we can pass both `state` and `dispatch` using our `context`'s `Provide` and utilize `useContext` to inject those values into our child components. 

```jsx
const HelloMessageContext = createContext();

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'set':
      return { count: action.payload };
    default:
      return state;
  }
}

function Parent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const providedValue = { state, dispatch };
  return (
    <HelloMessageContext.Provider value={providedValue}>
      <Child />
    </HelloMessageContext.Provider>
  );
}

function Child() {
  const { state, dispatch } = useContext(HelloMessageContext);
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Remove one
      </button>
      <button onClick={() => dispatch({ type: 'set', payload: 0 })}>
        Set to zero
      </button>
    </>
  );
}
```

> It's worth mentioning that while this works at a relatively small-scale, you [should not use this pattern for large data sets across huge swaths of your program. Instead, you should likely be using a library like Redux for performance reasons.](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/)

### Angular

// TODO: Write

```typescript
@Injectable()
class InjectedValue {
  message = 'Hello, world';
  changeMessage(val: string) {
    this.message = val;
  }
}

@Component({
  selector: 'app-root',
  providers: [InjectedValue],
  template: `<child></child>`,
})
class ParentComponent {}

@Component({
  selector: 'child',
  template: `
  <div>{{injectedValue.message}}</div>
  <button (click)="changeMessage()">Change message</button>
  `,
})
class ChildComponent {
  constructor(public injectedValue: InjectedValue) {}

  changeMessage() {
    this.injectedValue.changeMessage('TESTING');
  }
}
```



### Vue

// TODO: Write

`ref`

<!-- tabs:end -->





---

---

---

---

---

# Optional Injected Values

When your user first creates their account, they may opt out of inputting their name. When this is the case, let's provide a default value of "Unknown Name" throughout our app. To do this, we'll need some method of providing that default value in our dependency injection system.

<!-- tabs:start -->

## React

// TODO: Add

## Angular


If we remove the `providers` from `ParentComponent`, like so:

```typescript
@Component({
  selector: "app-root",
  template: `<child></child>`
})
class ParentComponent {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    this.injectedValue.message = "Test";
  }
}
```

We get the following error:

> ```
> ERROR NullInjectorError: R3InjectorError(AppModule)[InjectedValue -> InjectedValue -> InjectedValue]: 
>   NullInjectorError: No provider for InjectedValue!
> ```

This is because Angular requires you to provide a value for an injected value by default.

```typescript

import { Injectable, Component, OnInit, Optional} from '@angular/core';

@Injectable()
class InjectedValue {
  message = "Hello, world";
}

@Component({
  selector: "child",
  template: `<div></div>`
})
class ChildComponent implements OnInit {
  constructor(@Optional() private injectedValue: InjectedValue) {}

  ngOnInit() {
    console.log(this.injectedValue);
  }
}

@Component({
  selector: "app-root",
  template: `<child></child>`
})
class ParentComponent {
}
```

## Vue

// TODO: Add

<!-- tabs:end -->


## Default Values for Optional Values









# Application Wide Providers


<!-- tabs:start --> 

## React

// TODO: Add

## Angular


```typescript
@Injectable({providedIn: 'root'})
class InjectedValue {
  message = "Hello, world";
}

@Component({
  selector: "child",
  template: `<div></div>`
})
class ChildComponent implements OnInit {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    console.log(this.injectedValue);
  }
}

@Component({
  selector: "app-root",
  template: `<child></child>`
})
class ParentComponent {
}
```


## Vue

// TODO: Add

<!-- tabs:end -->


# Conclusion

It's worth mentioning that 









# Not going to teach

- Angular
  - `Self` and `SkipSelf` - Too complex, not features in other frameworks
  - `Host` - See above
  - `factory(() => {})`
  - `'platform'` and `'any'` `provideIn`

