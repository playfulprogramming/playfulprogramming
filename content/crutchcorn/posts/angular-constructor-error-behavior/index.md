---
{
	title: "Discovering Odd Behavior with Angular Error Handling",
	description: "Angular has fairly consistent error handling behavior... Until it doesn't. Here's one place where it's off and why.",
	published: '2023-09-27T13:45:00.284Z',
	tags: ['angular', 'javascript', 'webdev'],
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

When rendering this app, we get the following output in [the DOM](/posts/understanding-the-dom):

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

```typescript
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

<!-- in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of articles like this." button-text="Visit our Open Collective" button-href="https://opencollective.com/unicorn-utterances" -->

# Why we need a fix

If you've been a developer in the Angular space for a while, you'll know about [the Angular `ErrorHandler` API](https://angular.io/api/core/ErrorHandler), which allows you to log and otherwise keep track of the errors thrown in your app.

It's hugely useful if you need a global mechanism for tracking errors to a third-party, like [Sentry](https://sentry.io/).

This might lead us to ask: Why do we need this issue fixed in the first place?

Consider this edgecase: you have a header component that's shown on every page. This header component requires you to call some API to get some of the header information to show to the user. Maybe they have a profile that you want to show metadata on in the header.

But oh no! The API you relied on changed out from under you and now your header throws an error during the constructor!

Because of this error throwing behavior, rather than a single part of your app breaking visually, now every page that has a header will not render properly.

That might include some process critical flow that brings your company money - and a fix is subject to however long your developers need to both fix and deploy the hotpatch.

No matter how unlikely this scenario is; **downtime is money**. Remember, the first best time to prevent errors is at build time, but it's not the only place error handling needs to exist.

## Other ecosystems' fix to this problem

While this might sound like an Angular-specific problem, other frameworks have had to explore the same problem of "error thrown during rendering process leading to broken UI".

[One such example of an in-template error handler lives in React as an `ErrorBoundary`](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// ...

<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

# The short-term fix

Luckily, while `<component-here/>` will not recover from an error, we can manually wrap our internal `createComponent` call in a `try/catch` thanks to [Angular's `ViewContainerRef` API](/posts/angular-templates-start-to-source):

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
    <p>Before</p>
    <error-catcher [comp]="comp"/>
    <p>After</p>
  `,
})
class AppComponent {
  comp = ErrorComponent;
}

bootstrapApplication(AppComponent);
```

We can even expand our `error-catcher` component to handle and accept inputs and outputs:

```typescript
import { ErrorBoundary } from './error-boundary.component';

@Component({
  selector: 'child',
  standalone: true,
  template: `<button (click)="done.emit()">Child: {{name}}, {{age}}</button>`,
})
class ChildComponent {
  @Input() name!: string;
  @Input() age!: number;
  @Output() done = new EventEmitter();
}

@Component({
  selector: 'error',
  standalone: true,
  template: `<p>Error</p>`,
})
class ErrorComponent {
  constructor() {
    throw 'Failed to construct ErrorComponent';
  }
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [ErrorBoundary, ChildComponent, JsonPipe],
  template: `
    <p>Parent</p>

    <hr/>

    <error-boundary [fallback]="fallback" [comp]="errorComponent"/>
    <ng-template #fallback let-error>
      <h1>There was an error in <code>errorComponent</code></h1>
      <pre><code>{{error | json}}</code></pre>
    </ng-template>

    <hr/>

    <error-boundary [comp]="childComponent" (event)="getEvent($event)" [inputs]="{age, name: 'Janie'}"/>
    <button (click)="count()">Count</button>
  `,
})
class AppComponent {
  childComponent = ChildComponent;
  errorComponent = ErrorComponent;

  age = 12;

  count() {
    this.age++;
  }

  getEvent(props: { name: string; value: unknown }) {
    console.log({ props });
  }
}
```

<iframe src="https://stackblitz.com/edit/angular-error-boundary-userland-poc?embed=1&file=src%2Fmain.ts"/>

## The problem with the short-term fix

The problem with the short-term fix is a multi-folded problem:

- The syntax and tooling are not consistent with other Angular components
- Outputs and inputs are very loose typings now, which may lead to _more_ bugs, not less
- Outputs are not bound in the same way, requiring weird `switch/case` style coding and manually typing

If these issues are a deal-breaker for you, like they are for me, let's explore what a longer-term solution (built into Angular) might look like.

# The long-term fix

If you've been following the Angular developer-experience closely, you'll know that [the Angular team is aiming to add New Control Flow primitives into the framework](https://blog.angular.io/meet-angulars-new-control-flow-a02c6eee7843). These new control flow primitives are meant to:

- Make the core of Angular's output smaller
- Make adding new functionality to the core, of Angular easier
- Interop better with [Angular's upcoming signals API](https://angular.io/guide/signals)

They look something like this:

```html
@if (user.isHuman) {
  <human-profile [data]="user" />
} @else if (user.isRobot) {
  <robot-profile [data]="user" />
} @else {
	<p>The profile is unknown!</p>
}
```

This is equivalent to the following:

```html
<human-profile *ngIf="user.isHuman; else elseOne" [data]="user" />
<ng-template #elseOne>
	<robot-profile *ngIf="user.isRobot; else elseTwo" [data]="user" />
	<ng-template #elseTwo>
  <p>The profile is unknown!</p>
  </ng-template>
</ng-template>
```

My proposal for the long-term fix is that we add in a new `@try`/`@catch` syntax into the core of Angular's Control Flow primitives:

```html
@try {
	<error-throwing-component/>
} @catch (e: any) {
	<handle-error [error]="e"/>
}
```

To help make this vision a reality, [I've created a GitHub issue that outlines this long-term solution and volunteers myself to work on it](https://github.com/angular/angular/issues/51941).

> **It would mean a lot to me if you [gave a thumbs up reaction to the GitHub issue](https://github.com/angular/angular/issues/51941)** so that it gains more traction with the Angular team.
