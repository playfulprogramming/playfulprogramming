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

Think of this like a food buffet. Instead of serving food directly to the customer's table, the customer comes to the table with all of the food, takes what it wants, and is satisfied with the results all-the-same. 

We do this method of implicit data passing using a methodology called "dependency injection".



----

---

----

----

---

---



// TODO: Write the rest of the chapter



# Providing Basic Values

String, number, etc

<!-- tabs:start -->

## React



## Angular

````typescript
import { InjectionToken, Component, Inject} from '@angular/core';

const WELCOME_MESSAGE_TOKEN = new InjectionToken('WELCOME_MESSAGE');

@Component({
  selector: 'child',
  template: ``
})
export class ChildComponent {
  constructor(@Inject(WELCOME_MESSAGE_TOKEN) private welcomeMsg: string) {}

  ngOnInit() {
    console.log(this.welcomeMsg);
  }
}

@Component({
  selector: 'app-root',
  template: `<child></child>`,
  providers: [
    {provide: WELCOME_MESSAGE_TOKEN, useValue: 'Hello, world!' },
  ]
})
export class AppComponent {
}
````

### `inject` function

You can also use `inject` function instead.

```typescript
import { InjectionToken, Component, inject} from '@angular/core';

const WELCOME_MESSAGE_TOKEN = new InjectionToken<string>('WELCOME_MESSAGE');

@Component({
  selector: 'child',
  template: ``
})
export class ChildComponent {
  welcomeMsg = inject(WELCOME_MESSAGE_TOKEN);

  ngOnInit() {
    console.log(this.welcomeMsg);
  }
}

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

### Providing Classes

```typescript
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
    console.log(this.injectedValue);
  }
}

@Component({
  selector: "app-root",
  providers: [InjectedValue],
  template: `<child></child>`
})
class ParentComponent {
}
```





## Vue






<!-- tabs:end -->







# Optional Injected Values


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











# .

# .

# .

# .

# .











----------------





# Angular Notes



## Setting values from the provider itself

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





# Outline

- Angular
  - Basic component `providers` with `useValue`
  - Basic component `providers` with classes
  - `@Optional`
  - `@Injectable{provideIn: 'root'}`

## Not going to teach

- Angular
  - `Self` and `SkipSelf` - Too complex, not features in other frameworks
  - `Host` - See above
  - `factory(() => {})`
  - `'platform'` and `'any'` `provideIn`

