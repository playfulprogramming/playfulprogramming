---
{
	title: "Angular Internals: How Reactivity Works with Zone.js",
	description: "",
	published: '2023-03-01T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['angular', 'javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

> This article is an advanced look at how Angular works under-the-hood. This may be confusing if you're not already fairly familiar with JavaScript. If you're wanting to learn how to _use_ Angular, and haven't before, take a look at [my book "The Framework Field Guide", which teaches React, Angular, and Vue from scratch](https://framework.guide) instead.

If you've been following the JavaScript framework ecosystem, you may have heard the term "Reactivity" lately; they've been a hot commodity to talk about from [SolidJS' fine-grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf) to [Preact adding in a reactive primitive with the name of "Signals"](https://preactjs.com/guide/v10/signals/).

The concept of reactivity, at least at first glance, is a straightforward one: When you change a bit of code _here_, it updates a bit of code _there_ automatically. This is commonplace within frontend frameworks, where it's imperative to re-render updated content when you update the data stored in JavaScript.

During discussions of reactivity and frontend frameworks, there's one "odd duck" that stands out as a vastly different implementation from the others: Angular.

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



In this example, we can see that React uses explicit update calls (`setX`) to track when the state changes and Vue uses a proxy and a special property name (`.value`) to seemingly magically track state.

But what about Angular?

Angular just mutates the `count` variable and the framework seems to count the state changes. How does that work under-the-hood? What mechanism is being used to tell the template to re-render?

The short answer is that Angular uses something called "Zone.js" to track all asynchronous APIs via a series of polyfills, and uses those Zones to re-render "dirty" content in Angular's tree.

> What does any of that mean? That's a lot of works that doesn't seem to mean very much if you're not already in the know.

I agree; so let's answer this better with a longer step-by-step explanation of how Angular does its rendering and reactivity using Zone.js.

This step-by-step explanation will have us explore:

<!-- // TODO: ADD LINKS --> 

- How Angular's template compiler outputs functions that render contents
- How Angular's templates are called in order to update contents on-screen
- How Angular's change detection would work without Zone.js (and why it's a DX nightmare)
- How Zone.js Monkey-patches async APIs to call change detection
- How Angular has it's own internal instance of Zone.js called NgZone
- Writing our own minimal version of Angular from scratch



# How Angular's template compiler works

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

Here, we're receiving two arguments: `rf` (short for "render flags") and `ctx` (short for "context"). This function is called by Angular itself when the template is ready to either be rendered for the first time or updated afterwards.

Depending on how the template needs to be re-ran, the "render flag" (`rf`) will be passed differently, which allows Angular more control over how code is updated or not.

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

After this is ran, Angular runs the `Update` render flag through the template compiler:

```javascript
i0.ɵɵadvance(1);
i0.ɵɵtextInterpolate1("Your name is ", ctx.name, "");
```

Here, it's saying that we should interpolate the string `"Your name is Alex"` based on the property received from `ctx.name` and place it into the element's text area.

By having our template function have two distinct render phases, triggered by flags passed into the function, we're able to create the `span` on the first render and update the text values of the `span` on subsequent renders, without the need for re-initializing the `span` element each time we change the element's text.
