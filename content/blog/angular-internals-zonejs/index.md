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
