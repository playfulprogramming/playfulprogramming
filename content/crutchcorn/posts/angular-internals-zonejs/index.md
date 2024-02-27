---
{
	title: "Angular Internals: How Reactivity Works with Zone.js",
	description: "Reactivity is core to JavaScript frameworks; changing data should cause a re-render. How does this work in Angular? Let's dive into the Angular source code to see.",
	published: '2023-01-02T13:45:00.284Z',
	tags: ['angular', 'javascript'],
	license: 'cc-by-nc-sa-4'
}
---

> This article is an advanced look at how Angular works under-the-hood. The contents within may not be clear if you're not already fairly familiar with JavaScript. If you want to learn how to _use_ Angular and haven't before, look at [my book "The Framework Field Guide", which teaches React, Angular, and Vue from scratch](https://framework.guide) instead.

If you've been following the JavaScript framework ecosystem, you may have heard the term "Reactivity" lately; they've been a hot commodity to talk about, from [SolidJS' "fine-grained" reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf) to [Preact adding in a reactive primitive with the name of "Signals"](https://preactjs.com/guide/v10/signals/).

The concept of reactivity, at least at first glance, is a straightforward one: When you change a bit of code _here_, it updates a bit of code _there_ automatically. This is commonplace within front-end frameworks, where it's imperative to re-render updated content when you update the data stored in JavaScript.

During discussions of reactivity and front-end frameworks, one "odd duck" stands out as a vastly different implementation from the others: Angular.

Take the following button counter reactivity example in each framework:

<!-- tabs:start -->

# Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <button (click)="addOne()">{{count}}</button>
  `,
})
export class AppComponent {
  count = 0;

  addOne() {
    this.count++;
  }
}
```

# React

```jsx
const App = () => {
	const [count, setCount] = useState(0);
	
	const addOne = () => setCount(count+1);
	
	return <button onClick={addOne}>{count}</button>;
}
```

# Vue

```vue
<template>
	<button @click="addOne()">{{count}}</button>
</template>

<script setup>
import {ref} from 'vue';

const count = ref(0);

function addOne() {
	count.value += 1;
}
</script>
```

<!-- tabs:end -->



In this example, we can see that React uses explicit update calls (`setX`) to track when the state changes, and Vue uses a proxy and a special property name (`.value`) to seemingly magically track state.

But what about Angular?

Angular just mutates the `count` variable, and the framework seems to count the state changes. How does that work under-the-hood? What mechanism is being used to tell the template to re-render?

The short answer is that Angular uses something called "Zone.js" to track all asynchronous APIs via a series of polyfills, and uses those Zones to re-render "dirty" content in Angular's tree.

> What does any of that mean? That's a lot of words that don't seem to mean very much if you're not already in the know.

I agree; let's answer this better with a longer step-by-step explanation of how Angular does its rendering and reactivity using Zone.js.

This step-by-step explanation will have us explore:

- [How Angular's template compiler outputs functions that render contents](#template-compiler)
- [How Angular's templates are called in order to update contents on-screen](#create-template-function-call)
- [How Angular detects user changes and re-renders screen contents automatically](#refresh-view)
- [What Zone.js is and how to use it with and without Angular](#zone-basics)
- [How Angular has its own internal instance of Zone.js called NgZone](#ng-zone)
- [How Angular's change detection would work without Zone.js (and why it's a DX nightmare)](#disable-ng-zone)
- [How Zone.js Monkey-patches async APIs to call change detection](#zone-patch-intro)

# How Angular's template compiler works {#template-compiler}

Earlier last year, the Angular team published a blog post titled ["How the Angular Compiler Works"](https://blog.angular.io/how-the-angular-compiler-works-42111f9d2549). In it, they demonstrated how the `NGC` compiler takes the following code:

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'app-cmp',
  template: '<span>Your name is {{name}}</span>',
})
export class AppCmp {
  name = 'Alex';
}
```

And outputs something like this:

```javascript
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

While their article goes more in-depth into how the compiler works (it's a great read!), let's keep our focus narrow for the intention of this article.

Namely, let's look at the `template` property function on the `ɵɵdefineComponent` function call.

```javascript
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
}
```

Here, we're receiving two arguments: `rf` (short for "render flags") and `ctx` (short for "context"). This function is called by Angular itself when the template is ready to either:

1) Be rendered for the first time.
2) Have its contents updated afterward.

Depending on how the template needs to be re-run, the "render flag" (`rf`) will be passed differently, allowing Angular more control over how code is updated.

There are [only two flags that are currently defined in Angular 15](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/interfaces/definition.ts#LL50-L56C2):

```typescript
// Source code from @angular/core
// angular/packages/core/src/render3/interfaces/definition.ts

export const enum RenderFlags {
  /* Whether to run the creation block (e.g. create elements and directives) */
  Create = 0b01,

  /* Whether to run the update block (e.g. refresh bindings) */
  Update = 0b10
}
```

The first render flag that will be passed to the `template` function is the `Create` flag, which will call the first `if` statement. Let's strip away everything but the first `if` statement:

```javascript
i0.ɵɵelementStart(0, "span");
i0.ɵɵtext(1);
i0.ɵɵelementEnd();
```

Here, very generally, Angular is saying: "create a `span` element, and mark it such that text should be placed within it".

After this is run, Angular runs the `Update` render flag through the template compiler:

```javascript
i0.ɵɵadvance(1);
i0.ɵɵtextInterpolate1("Your name is ", ctx.name, "");
```

Here, it's saying that we should interpolate the string `"Your name is Alex"` based on the property received from `ctx.name` and place it into the element's text area.

By having our template function contain two distinct render phases - triggered by flags passed into the function - we're able to create the `span` on the first render and update the text values of the `span` on subsequent renders without the need for re-initializing the `span` element each time we change the element's text.

## Exactly how is the template compiler run _by Angular_? {#create-template-function-call}

As mentioned previously, Angular calls this render function with two different render flags: `Create` and `Update`.

But don't take my word for it! Let's take a look at Angular's source code.

[Defined in `@angular/core` is a function called `renderComponent`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#L1663-L1669):

```typescript
// Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts
function renderComponent(hostLView: LView, componentHostIdx: number) {
  ngDevMode && assertEqual(isCreationMode(hostLView), true, 'Should be run in creation mode');
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  const componentTView = componentView[TVIEW];
  syncViewWithBlueprint(componentTView, componentView);
  renderView(componentTView, componentView, componentView[CONTEXT]);
}
```

This function, very generally, accesses a component's `View` ([a concept I've written about before, core to Angular's internal reference to HTML elements](/posts/angular-templates-start-to-source#View-Containers)) and renders it using Angular's `renderView` function.

[Let's look in said `renderView` function](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#LL286-L300C6):

```typescript
// Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts
export function renderView<T>(tView: TView, lView: LView<T>, context: T): void {
  ngDevMode && assertEqual(isCreationMode(lView), true, 'Should be run in creation mode');
  enterView(lView);
  try {
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn<T>(RenderFlags.Create, viewQuery, context);
    }

    // Execute a template associated with this view, if it exists. A template function might not be
    // defined for the root component views.
    const templateFn = tView.template;
    if (templateFn !== null) {
      executeTemplate<T>(tView, lView, templateFn, RenderFlags.Create, context);
    }
    
    // ...
    
}
```

Here, we can see the `executeTemplate` function being called with the `RenderFlags.Create` flag, just like we outlined before.

There's no special magic happening [inside of the `executeTemplate` function](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#L480), either. In fact, this is the whole thing:

```typescript
// Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts

function executeTemplate<T>(
    tView: TView, lView: LView<T>, templateFn: ComponentTemplate<T>, rf: RenderFlags, context: T) {
  const prevSelectedIndex = getSelectedIndex();
  const isUpdatePhase = rf & RenderFlags.Update;
  try {
    setSelectedIndex(-1);
    if (isUpdatePhase && lView.length > HEADER_OFFSET) {
      // When we're updating, inherently select 0 so we don't
      // have to generate that instruction for most update blocks.
      selectIndexInternal(tView, lView, HEADER_OFFSET, !!ngDevMode && isInCheckNoChangesMode());
    }

    const preHookType =
        isUpdatePhase ? ProfilerEvent.TemplateUpdateStart : ProfilerEvent.TemplateCreateStart;
    profiler(preHookType, context as unknown as {});
    templateFn(rf, context);
  } finally {
    setSelectedIndex(prevSelectedIndex);

    const postHookType =
        isUpdatePhase ? ProfilerEvent.TemplateUpdateEnd : ProfilerEvent.TemplateCreateEnd;
    profiler(postHookType, context as unknown as {});
  }
}
```

If we simplify this function a bit to narrow our focus, we're left with:

```typescript
// Simplified Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts

function executeTemplate<T>(
    tView: TView, lView: LView<T>, templateFn: ComponentTemplate<T>, rf: RenderFlags, context: T) {

    // ...
        
        templateFn(rf, context);

    // ...
}
```

Here, in this narrowed focus, we can see that when we execute:

```typescript
// Simplified Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts

const templateFn = tView.template;

// ...

executeTemplate<T>(tView, lView, templateFn, RenderFlags.Create, context);
```

We're simply calling the component's `template` function with a `RenderFlags.Create` argument as well as the function's `context`.

## What about when the component updates? {#update-template-function-call}

Just as there is a clear demonstration of when the component's `template` function is called with `RenderFlags.Create`, there's also a pretty cut-and-dry example of the `template` function being called with `RenderFlags.Update`.

This `Update` flag is passed by [Angular's `refreshView` function](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#L354), which is called by Angular when a component is ready to update.

```typescript
// Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts

export function refreshView<T>(
    tView: TView, lView: LView, templateFn: ComponentTemplate<{}>|null, context: T) {
  ngDevMode && assertEqual(isCreationMode(lView), false, 'Should be run in update mode');
  const flags = lView[FLAGS];
  if ((flags & LViewFlags.Destroyed) === LViewFlags.Destroyed) return;
  enterView(lView);
  // Check no changes mode is a dev only mode used to verify that bindings have not changed
  // since they were assigned. We do not want to execute lifecycle hooks in that mode.
  const isInCheckNoChangesPass = ngDevMode && isInCheckNoChangesMode();
  try {
    resetPreOrderHookFlags(lView);

    setBindingIndex(tView.bindingStartIndex);
    if (templateFn !== null) {
      executeTemplate(tView, lView, templateFn, RenderFlags.Update, context);
    }
    
    // ...
    
}
```

That last line should look pretty familiar; the `executeTemplate` shows up again and is passed `RenderFlags.Update` this time!

While this is pretty neat to see so plainly, it leaves an important question out in the open: How _does_ the component know when it's ready to update?

# Inside Angular's change detection; when `refreshView` is called {#refresh-view}

To answer the question of "how does Angular know when a component is ready to update", let's follow the stack trace of when the `refreshView` function is called.

If we take a step one level up, [we can see that `refreshView` is called within a function called `detectChangesInternal`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#L1770):

```typescript
// Angular 15 source code
// angular/packages/core/src/render3/instructions/shared.ts

export function detectChangesInternal<T>(
    tView: TView, lView: LView, context: T, notifyErrorHandler = true) {
  const rendererFactory = lView[RENDERER_FACTORY];

  // Check no changes mode is a dev only mode used to verify that bindings have not changed
  // since they were assigned. We do not want to invoke renderer factory functions in that mode
  // to avoid any possible side-effects.
  const checkNoChangesMode = !!ngDevMode && isInCheckNoChangesMode();

  if (!checkNoChangesMode && rendererFactory.begin) rendererFactory.begin();
  try { 
      refreshView(tView, lView, tView.template, context);
   } catch (error) {
  	// ...
  }
}
```

Which is called [within the exposed `@angular/core` `detectChanges` function](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/view_ref.ts#L273-L275):

```typescript
// Angular 15 source code
// angular/packages/core/src/render3/view_ref.ts
detectChanges(): void {
	detectChangesInternal(this._lView[TVIEW], this._lView, this.context as unknown as {});
}
```

<!-- in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of articles like this." button-text="Visit our Open Collective" button-href="https://opencollective.com/unicorn-utterances" -->

##  Calling Change Detection Manually {#manual-cd}

Let's use [Angular's `NgZone`'s `runOutsideOfAngular`](https://angular.io/api/core/NgZone#runOutsideAngular) to run some code outside of Angular's typical change detection:

```typescript
import { ApplicationRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  constructor(private ngZone: NgZone) {}

  name = '';
  changeName() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.name = 'Angular';
      });
    });
  }
}
```

> Don't worry if you're not already familiar with `NgZone`, we'll explain how it works fully in this article. 😄

Here, you'll notice that when you press the `<button>` for the first time, it does not show `Hello Angular` as you might expect. It's only on the subsequent button presses that the proper greeting shows up.

This is intentional behavior - after all, we've told our code to execute outside of Angular's typical change detection. To solve this, we can manually run `detectChanges` ourselves:

```typescript
import {
  ChangeDetectorRef,
  Component,
  NgZone,
} from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}

  name = '';
  changeName() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.name = 'Angular';
        this.cd.detectChanges();
      });
    });
  }
}	
```

This `detectChanges` then calls the `refreshView` call that we saw earlier. That, in turn, calls `executeTemplate` with `RenderFlags.Update`, which gets passed to the component's `template` function, which was output by `NGC`.

## How does _Angular_ know to call `detectChanges`? {#intro-to-tick}

> Assuming you've done your research and `detectChanges` _really_ is what calls our component to `Update`, what within Angular calls `detectChanges` itself?

Well, Angular has a global instance of your application that's spun up during your application's initialization (either via [`bootstrapModule`](https://angular.io/api/core/PlatformRef#bootstrapModule) or [`bootstrapApplication`](https://angular.io/api/platform-browser/bootstrapApplication)) called [`ApplicationRef`](https://angular.io/api/core/ApplicationRef). This `ApplicationRef` contains methods and metadata Angular needs to keep about your application as a whole in order to operate.

Within this `ApplicationRef` is [a method called `tick`](https://angular.io/api/core/ApplicationRef#tick). This method is, more or less (more on this soon), called after the application has detected the user has made an interaction with the app; when everything has calmed down.

Angular calls this `tick` method because, since the user has interacted with some part of the webpage, the application _might_ need to re-render to show updated information from said interaction.

> What does this have to do with `detectChanges`?

Well, dear reader, [`ApplicationRef.tick` _calls_ `detectChanges`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/application_ref.ts#L1001-L1012):

```typescript
// Angular 15 source code
// angular/packages/core/src/application_ref.ts
tick(): void {
  NG_DEV_MODE && this.warnIfDestroyed();
  if (this._runningTick) {
    throw new RuntimeError(
        RuntimeErrorCode.RECURSIVE_APPLICATION_REF_TICK,
        ngDevMode && 'ApplicationRef.tick is called recursively');
  }

  try {
    this._runningTick = true;
    for (let view of this._views) {
      view.detectChanges();
    }
  // ...
  }
}
```

This means that we're able to replace our previous `detectChanges` with `ApplicationRef.tick` and it will accomplish the same fix we were able to see before:

```typescript
import { ApplicationRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  constructor(private ngZone: NgZone, private appRef: ApplicationRef) {}

  name = '';
  changeName() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.name = 'Angular';
        this.appRef.tick();
      });
    });
  }
}
```

# A quick detour into Zone.js land: Zone.js basics {#zone-basics}

Before we continue diving deeper into Angular's internals, I need to introduce a magical library that was developed by Google for usage within Angular: Zone.js.

The very basic idea behind Zone.js is that you're able to create a "context" to run your code inside. This "context" can then be used to keep track of what's currently running, run custom error handling code, and more.

Let's look at a minimal example of what Zone.js is capable of:

```typescript
import "zone.js";

const newZone = Zone.current.fork({
  name: 'error',
  onHandleError: function (_, __, ___, error) {
    console.log(error.message);
  },
});

newZone.run(() => {
  setTimeout(() => {
    throw new Error('This is an error thrown in a setTimeout');
  });
});
```

Here, `Zone.current` is a global that's defined when you import `zone.js` for the first time.

We then "fork" the current "zone" in order to create our own "execution context" or "zone".

This zone is defined with an error handler (`onHandleError`) that, in our example, simply logs the error message using a `console.log` rather than displaying a `console.error`, as is the default for the browser.

We then `run` a "task" by passing a function to `newZone`. Even though our `Error` is thrown inside of a `setTimeout`, it is caught by our `onHandleError`.

# Angular uses Zone.js {#ng-zone}

OK, now that we understand the fundamentals of Zone.js, let's see how Angular uses `Zone.js`.

See, Angular has a "Zone" called "NgZone" as part of `ApplicationRef` to keep a context of the application's code.

While the code to set up "NgZone" is a bit too complex to showcase in this article cleanly, you can _roughly_ think of "NgZone" as:

```typescript
// This is not how ngZone is really defined,
// it's just a really rough approximation

const ngZone = Zone.current.fork({
	// ... Setup the ngZone here
})
```

[This "NgZone" is then passed to the `ApplicationRef`'s `constructor`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/application_ref.ts#L766-L772), like so:

```typescript
// Angular 15 source code
// angular/packages/core/src/application_ref.ts

constructor(
    private _zone: NgZone,
    private _injector: EnvironmentInjector,
    private _exceptionHandler: ErrorHandler,
) {
  this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
    next: () => {
      this._zone.run(() => {
        this.tick();
      });
    }
  });
  
  // ...
  
}
```

You may notice that this `_zone` is then subscribed such that, when the microtask queue is empty, it runs `this.tick()` (aka `ApplicationRef.tick()`).

_This_, my dear reader, is what triggers Angular's `detectChanges` seemingly invisibly. Don't believe me? Let's disable Zone.js from our Angular app and see if change detection works as we'd typically expect.

# Disabling Zone.js from Angular {#disable-ng-zone}

To disable Zone.js from our Angular application, we simply need to pass `{ngZone: 'noop'}` to our application's bootstrapping:

```typescript
// main.ts
platformBrowserDynamic()
   .bootstrapModule(
       AppModule, { ngZone: 'noop' })
   .catch(err => console.log(err));
```

Now, with Zone.js disabled, we can see that no matter how many times we press our button in the following example, the change detection is never run:

```typescript
// This does not work with a "noop" NgZone
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  name = '';
  changeName() {
    setTimeout(() => {
      this.name = 'Angular';
    });
  }
}
```

We can either fix this by manually calling change detection (either via `appRef.tick()` or `cd.detectChanges`):

```typescript
// This works with a "noop" NgZone
import { ApplicationRef, Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  constructor(private appRef: ApplicationRef) {}
  name = '';
  changeName() {
    setTimeout(() => {
      this.name = 'Angular';
      // Developer experience suffers since we MUST call this every time we change state
      this.appRef.tick();
    });
  }
}
```

Or by re-enabling Zone.js:

```typescript
// main.ts
// Re-enable NgZone
platformBrowserDynamic()
   .bootstrapModule(
       AppModule)
   .catch(err => console.log(err));
```

```typescript
// This works again now that we re-enabled Zone.js
@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  name = '';
  changeName() {
    setTimeout(() => {
      this.name = 'Angular';
    });
  }
}
```

> Huh, so you can use Angular without Zone.js, but the developer experience suffers; interesting.
>
> But wait, we're not explicitly calling `ngZone.run` inside of our `changeName` method; how does it call Zone.js to trigger Angular's `tick`?

Our `changeName` method is able to trigger Angular's `tick` thanks to something called a "monkey-patch".

# Zone.js Patches APIs for Angular {#zone-patch-intro}

A zone within Zone.js is only able to see code that is executed within its context. Take the following minimal Zone.js example from earlier:

```typescript
newZone.run(() => {
  setTimeout(() => {
    throw new Error('This is an error thrown in a setTimeout');
  });
});
```

Let's pause and think about this code for a moment from a theoretical level:

`setTimeout` sets a timer internally using the JavaScript engine of the code's execution. This code then has a callback which is called after the timer has passed. How does Zone.js know that it should treat the `throw new Error` as part of its execution context if the callback is called "externally" by the JavaScript engine?

The answer is... Well, it doesn't by default. If Zone.js is implemented in a trivial manner, it does not handle `setTimeout` or any other asynchronous API properly.

Unfortunately for us, our apps regularly make use of asynchronous operations to function. Luckily, Zone.js is not implemented trivially and does its best to patch all of the async APIs your application might use to redirect the execution of tasks back into its "context".

While the specifics of how this is done are a bit complex, the gist of it is that Zone.js calls a bit of code after the async code finishes to notify Zone.js to pick up the execution from where it left off.

This might look something like this:

```javascript
// This is not how Zone.js really works,
// this is a trivial implementation to demonstrate how Zone.js patches async APIs
const originalSetTimeout = setTimeout;

setTimeout = (callback, delay, ...args) => {
    const context = this;

    return originalSetTimeout(() => {
    	callback.apply(context, args);
        Zone.current.run();
    }, delay);
};
```

Here, we can see that we're overwriting the global `setTimeout` with our custom one but calling `Zone.current.run();` once the async operation is finished.

This, conceptually, isn't too far from how Zone.js patches global async APIs. For example, [this is the bit of code that tells Zone.js to patch `setTimeout`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/zone.js/lib/browser/browser.ts#L37-L43):

```typescript
// Zone.js source code
// angular/packages/zone.js/lib/browser/browser.ts
Zone.__load_patch('timers', (global: any) => {
  const set = 'set';
  const clear = 'clear';
  patchTimer(global, set, clear, 'Timeout');
  patchTimer(global, set, clear, 'Interval');
  patchTimer(global, set, clear, 'Immediate');
});
```

Notice how it patches `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`, `setImmediate`, and `clearImmediate` all at once.

This means that when we run our Angular component with `setTimeout`:

```typescript
// This does not work with a "noop" NgZone
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  name = '';
  changeName() {
    setTimeout(() => {
      this.name = 'Angular';
    });
  }
}
```

- The `changeName` function calls `Zone.js`'s patched `setTimeout`
  - This patched `setTimeout` adds a task to the forked NgZone's queue
-  [Once the queue is empty, it will trigger `onMicrotaskEmpty`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/zone/ng_zone.ts#LL341C12-L341C28)
- This then triggers [the `.tick` function in `ApplicationRef`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/application_ref.ts#L766-L772)
- Which then calls [`detectChanges`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/view_ref.ts#L273-L275)
- This, in turn, [calls `refreshView` on the component](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#L354)
- [`refreshView` is a wrapper around calling the component's `template` function with `RenderFlags.Update`](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/core/src/render3/instructions/shared.ts#L368)
- Which provides the correct flag for the template function, built by the NGC compiler, to update the DOM's contents.

## Zone.js patches more APIs than you might think {#zone-patching-apis}

> Hang on a moment... If Zone.js is what triggers `ApplicationRef.tick`, why does it seem to run change detection even when there is seemingly no asynchronous API involved?

That's a good point! After all, the following Angular component doesn't use `setTimeout`, and yet it still triggers `ApplicationRef.tick` (so long as you have NgZone enabled):

```typescript
import { ApplicationRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  name = '';
  changeName() {
    this.name = 'Angular';
  }
}
```

Why is that?

Well, the answer lies within the word "asynchronous" and its literal definition. See, it doesn't just mean "a timer"; it means any kind of operation that's non-blocking. That's not just output; that includes user input.

You might have an inkling that this means that Zone.js patches the `(click)` listener, and you'd be right!

If we think about how an HTML element is created in JavaScript without a framework, it might look something like this:

```typescript
const el = document.createElement('button');
el.addEventListener('click', () => console.log("I have been pressed"));
```

Well, under-the-hood, the NGC compiler does this same thing with our `(click)` template syntax!

Knowing that the component's `template` function utilizes `addEventListener`, let's see how Zone.js patches this API.

The first step to understanding how Zone.js patches `addEventListener`, it's important to know where the browser implements that specific function. You might assume it's a method on [the browser's `HTMLElement` built-in type](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), but it actually exists on [the browser's built-in `EventTarget` type](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) instead. `HTMLElement` just inherits this function from `EventTarget`.

This is why, [in Zone.js' source code, it patches `EventTarget` directly](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/zone.js/lib/browser/browser.ts#L63-L65):

```typescript
// Zone.js source code
// angular/packages/zone.js/lib/browser/browser.ts

Zone.__load_patch('EventTarget', (global: any, Zone: ZoneType, api: _ZonePrivate) => {
  patchEvent(global, api);
  eventTargetPatch(global, api);
  // ...
});
```

If we look into `eventTargetPatch`, [we can even see where it patches `ADD_EVENT_LISTENER` specifically](https://github.com/angular/angular/blob/a6849f27af129588091f635c6ae7a326241344fc/packages/zone.js/lib/common/events.ts#L93-L94):

```typescript
export function patchEventTarget(
    _global: any, api: _ZonePrivate, apis: any[], patchOptions?: PatchEventTargetOptions) {
  const ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
  const REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;

   // ...
}
```

This all means that when the user presses the button in the following example:

```typescript
import { ApplicationRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>Hello {{name}}</h1>
  <button (click)="changeName()">Change Name</button>
  `,
})
export class AppComponent {
  name = '';
  changeName() {
    this.name = 'Angular';
  }
}
```

It will:

- Run the `click` `changeName` function
- Run `Zone.js`'s patched `addEventListener` function
- Trigger the `onMicrotaskEmpty` subscription
- `tick` the `ApplicationRef`

> This is why even in our `runOutsideOfAngular` example, pressing the button more than once will show the live data. The event is being bound, and, as a result, the component is being re-rendered with `App.tick` once the bound event is triggered.

### Demonstration of Event Patching {#empty-function-zone-js}

As a fun aside, it's worth mentioning that even an empty function will trigger change detection (although it will not cause a re-render because no data has changed). We can verify this assumption by simply subscribing to `onMicrotaskEmpty` ourselves:

```typescript
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <button (click)="test()">Test</button>
  `,
})
export class AppComponent {
  constructor(private zone: NgZone) {
    zone.onMicrotaskEmpty.subscribe({
      next: () => {
        console.log('EMPTY MICROTASK, RUN TICK');
      },
    });
  }

  // This is empty but will still cause an `ApplicationRef.tick` if NgZone is enabled
  test() {}
}
```

# Conclusion {#conclusion}

Hopefully, this has been a helpful insight into how Angular's change detection works under-the-hood, both with and without Zone.js. With this knowledge, you should be able to optimize your applications by discovering the patterns where your code may be causing too many re-renders at once.

If you found this article useful, you should check out [my upcoming book series, The Framework Field Guide](https://framework.guide), where I teach React, Angular, and Vue from the basics all the way to super advanced deep-dives such as this. (psst, all three books are free!) 
