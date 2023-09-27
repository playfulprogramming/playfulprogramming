---
{
	title: "Discovering Odd Behavior with Angular Error Handling",
	description: "Angular has fairly constistent error handling behavior... Until it doesn't. Here's one place where it's off and why.",
	published: '2023-10-09T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['angular', 'javascript', 'webdev'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Let's build out a small Angular application:

```typescript
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

const users: Record<string, () => string> = {
  corbin: () => 'Hello, world!',
};

@Component({
  selector: 'welcome-msg',
  standalone: true,
  template: `
    <p>Corbin says: {{welcomeMessage}}</p>
  `,
})
export class WelcomeComponent {
  // 🤫
  welcomeMessage = users.crutchcorn();
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [WelcomeComponent],
  template: `
    <h1>The welcome app!</h1>
    <welcome-msg/>
    <p>That's all!</p>
  `,
})
export class App {}

bootstrapApplication(App);
```

When rendering this app, we get the following output in [the DOM](https://unicorn-utterances.com/posts/understanding-the-dom):

```html
<my-app>
	<h1>The welcome app!</h1>
	<welcome-msg></welcome-msg>
</my-app>
```

> Wait, where did our `p` tag go? Where did _either_ of the `p` tags go?!

Believe it or not, this is expected behavior in Angular. It's caused from an error in our code that's subtle yet important.

In this article, we'll explore:

- What's happening to cause this behavior
- Why this behavior is happening
- How to fix it in our code
- What a long-term fix in Angular itself might look like



# What's happening?

In the previous code sample the keen eyed amongst you might have noticed that we made a typo on `welcomeMessage`. This typo was such that we ended up calling a method that does not exist:

```typescript
const users: Record<string, () => string> = {
  corbin: () => 'Hello, world!',
};

// ...
welcomeMessage = users.crutchcorn();
```

While this error may have been caught by changing our `users` type like so:

```typescript
const users = {
  corbin: () => 'Hello, world!',
} satisfies Record<string, () => string>;
```

It's not a guarantee that errors like this won't ever happen again.

> Typos and other errors exist in codebases of all scales, and while there are steps you can take, preventing them entirely is impossible.

This error in particular is [a `TypeError` of `crutchcorn is not a function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_a_function).

--------

Let's replace this with a `throw` type to see more directly what's happening:

```typescript
import 'zone.js/dist/zone';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'throw-an-error',
  standalone: true,
  template: `<p>🙈</p>`,
})
class ErrorComponent {
  constructor() {
    throw 'This is an error';
  }
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [ErrorComponent],
  template: `
    <p>Before</p>
    <!-- Try hiding and showing this line -->
    <throw-an-error/>
    <!-- This never shows up -->
    <p>After</p>
  `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
```

Here, you'll see that `<p>Before</p>` renders, but neither the `<p>🙈</p>` or `<p>After</p>` do, just like before.

However, if you move the `<p>Before</p>` tag to be after the `<throw-an-error/>` component, like so:

```html
<!-- Try hiding and showing this line -->
<throw-an-error/>
<!-- This never shows up -->
<p>Before</p>
<p>After</p>
```

You'll see that neither `Before` nor `After` renders anymore. Why is that?

# Why does this happen?

If we take a step back for a moment and [look at how Angular's compiler works](https://blog.angular.io/how-the-angular-compiler-works-42111f9d2549), you'll learn that Angular takes a component template like this:

``` typescript
@Component({
  selector: 'app-cmp',
  template: '<span>Your name is {{name}}</span>',
})
export class AppCmp {
  name = 'Alex';
}
```

And compiles it into a template function:

```typescript
import { Component } from '@angular/core';                                      
import * as i0 from "@angular/core";

export class AppCmp {
    constructor() {
        this.name = 'Alex';
    }
}                                                                               
AppCmp.ɵfac = function AppCmp_Factory(t) { return new (t || AppCmp)(); };
AppCmp.ɵcmp = i0.ɵɵdefineComponent({
  type: AppCmp,
  selectors: [["app-cmp"]],
  decls: 2,
  vars: 1,
  template: function AppCmp_Template(rf, ctx) {
    if (rf & 1) {
      i0.ɵɵelementStart(0, "span");
      i0.ɵɵtext(1);
      i0.ɵɵelementEnd();
    }
    if (rf & 2) {
      i0.ɵɵadvance(1);
      i0.ɵɵtextInterpolate1("Your name is ", ctx.name, "");
    }
  },
  encapsulation: 2
});                                                   
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppCmp, [{
        type: Component,
        args: [{
                selector: 'app-cmp',
                template: '<span>Your name is {{name}}</span>',
            }]
    }], null, null); })();
```

> [This code is taken from the Angular Blog on how the Angular compiler works.](https://blog.angular.io/how-the-angular-compiler-works-42111f9d2549)

Let's take this compiler knowledge and apply it to our code. This means that some code like the folllowing:

```html
<p>Render before</p>
<component/>
<p>Render after</p>
```

Will be compiled by Angular to be akin to the following output:

```typescript
renderBefore();
renderComponent()
renderAfter();
```

While this works, there's a problem: Any errors that occur during `renderComponent`'s class constructor instanciation will disrupt the flow of the following lines of code.

> Why?

## JavaScript Error Handling

If we think about how JavaScript's error handling works, we'll find that a thrown error acts as an early `return` for a function:

```javascript
function sayHi() {
  throw "This is an error";
  // This will never execute
  console.log("Hello!");
}
```

This behavior is true and consistent even when nested:

```javascript
function sayHi() {
  throw "This is an error";
  // This will never execute
  console.log("Hello!");
}

function greet(name) {
  sayHi();
  console.log("My name is", name);
}

function greetWithName() {
  greet("Corbin");
}

// Will never `console.log`, instead will throw an error from `sayHi`
greetWithName();
```

This pattern is true within Angular as well, and cannot be prevented or modified - it's part of JavaScript's core identity.

### A note on error catching

It's worth noting, however, that you can prevent these errors from halting future lines of code by using a [`try/catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) to stop the propegation of the error:

```javascript
function sayHi() {
  throw "This is an error";
  // This will still never execute
  console.log("Hello!");
}

function greet(name) {
	try {
	  sayHi();
  } catch (e) {
  	// `e` is the thrown error
  	// Log `e` to your error service, or do whatever you'd like to it
    // ...
  }
  // This code now continues as if nothing ever happened, rather than early returning
  console.log("My name is", name);
}

function greetWithName() {
  greet("Corbin");
}

// This will now log "My name is Corbin", without the "Hello!"
greetWithName();
```

## How JavaScript's Error Handling Impacts Angular

Back to Angular land, let's think about our render pseudo-code from before:

```typescript
renderBefore();
renderComponent()
renderAfter();
```

Let's assume that `renderComponent` throws an error in its constructor, like our `throw-an-error` component from before:

But let's take a step back and evaluate what is happening: When `component` is rendered, it `throw`s an error. We can now think of this code akin to this:

```typescript
renderBefore();
throw new Error();
renderAfter();
```

Because of this, and following JavaScript's early return implementation of thrown errors, the render template can never reach the `renderAfter`.

This is why we can see elements rendered _before_ our `throw-an-error` component, but not elements _after_.

# The short-term fix

To fix it, you have to

```typescript
import 'zone.js/dist/zone';
import { NgIf } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  inject,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'throw-an-error',
  standalone: true,
  template: `<p>🙈</p>`,
})
class ErrorComponent {
  constructor() {
    throw 'This is an error';
  }
}

@Component({
  selector: 'error-catcher',
  standalone: true,
  imports: [NgIf],
  template: `
  <div *ngIf="error">
    <h1>There was an error</h1>
  </div>
  <ng-template #compTemp></ng-template>
  `,
})
class ErrorCatcher implements OnInit {
  @ViewChild('compTemp') compTemp!: TemplateRef<any>;
  @Input({ required: true }) comp!: any;

  containerRef = inject(ViewContainerRef);

  error: any = null;

  ngOnInit() {
    try {
      this.containerRef.createComponent(this.comp);
    } catch (e) {
      this.error = e;
    }
  }
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [ErrorCatcher],
  template: `
    <p>Parent</p>
    <error-catcher [comp]="comp"/>
  `,
})
class AppComponent {
  comp = ErrorComponent;
}

bootstrapApplication(AppComponent);
```

# The Proposed Fix



## Why won't other solutions cut it?