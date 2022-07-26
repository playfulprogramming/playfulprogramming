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

----

----

----

---

---



# Changing Values After Injection

While providing values from a parent node down to a child component is useful on its own, it's made even more powerful by the inclusion of data manipulation.

For example, what happens when your user wants to change their name with some kind of rename functionality? You should be able to change how the data is stored in your dependency injection to propagate those changes throughout your whole application immediately.  

<!-- tabs:start -->

## React

// TODO: Add

## Angular

// TODO: Write

````typescript
@Injectable()
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
    setTimeout(() => {
      console.log(this.injectedValue);
    }, 0)
  }
}

@Component({
  selector: "app-root",
  providers: [InjectedValue],
  template: `<child></child>`
})
class ParentComponent {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    this.injectedValue.message = "Test";
  }
}
````

## Vue

Use `ref` in combination with `inject`



<!-- tabs:end -->



## Changing Injected Values from Child


// TODO: Write

<!-- tabs:start -->



### React

1) `useState` and `useContext`

2) `useReducer` and `useContext`

> Warning, [point towards Redux for perf](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/)

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

???

<!-- tabs:end -->





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

