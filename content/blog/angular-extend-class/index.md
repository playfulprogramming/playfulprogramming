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



Before we go on **please note that this method of extending lifecycle methods is generally frowned upon by Angular experts. Instead, it's suggested to use a per-component dependency injection provided class instance with functions you call manually.**

> I write about this more in my [upcoming free book called "The Framework Field Guide", which teaches React, Angular, and Vue all at once](https://framework.guide).



One downside is that you must add a declaration of the `BaseComponent` into your root `NgModule`. Otherwise, you'll end up with the following error during compilation:

```
BaseComponent is not declared in any Angular module 
```

Luckily, since Angular 10 you can now use `@Injectable` to declare your `BaseComponent` instead. This sidesteps the problem because `Injectable`s do not need to be declared:

```typescript
@Injectable()
class BaseComponent implements OnInit {
  ngOnInit() {
    console.log('I AM BASE COMPONENT');
  }
}
```







---



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
class AppComponent extends BaseComponent {
}
```



----



# Overwriting Lifecycle Methods

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



# Merging with Dependency Injection



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





## Overwriting `constructor`



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