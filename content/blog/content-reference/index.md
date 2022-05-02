---
{
    title: "Content Reference",
    description: "Oftentimes, when passing children to a component, you want a way to programmatically access that passed data. Let's learn how to do that in React, Angular, and Vue.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 9,
    series: "The Framework Field Guide"
}
---

This isn't to say that there are no practical applications of what we'll be learning about in this chapter, just that the things we'll learn about are often applied in niche circumstance, and I can't reasonably think of how to integrate it into what we've built thus far.

The concepts I want to talk about today is the idea of "Content reference". 

In our last chapter, we demonstrated how you're able to provide content as a child of another component. This means that we can make the follow pseudo-syntax something of a reality in each given framework:

```jsx
<FileTableContainer>
	<FileTableHeader/>
	<FileTableBody/>
</FileTableContainer>
```

Now here's a question for you: Can you then access those children from JavaScript and interact with them programmatically?
Answer: Yes.

Let's start by getting a list of each item passed as a child.

<!-- tabs:start -->

# React

React has a built-in helper called `Children` that will help you access data passed as a child to a component. Using this `Children` helper, we can utilize the `toArray` method to create an array from `children` that we can then do anything we might otherwise do with a typical array.

This comes in handy when trying to access the `length` count. 

```jsx
import {Children} from 'react';

const ParentList = ({children}) => {
  const childArr = Children.toArray(children);
  console.log(childArr); // This is an array of ReactNode - more on that in the next sentence
  return <>
    <p>There are {childArr.length} number of items in this array</p>
    <ul>
		{children}
	</ul>
    </>
}

const App = () => {
	return (
		<ParentList>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ParentList>
	)
}
```

Here, `childArr` is an array of type `ReactNode`. A `ReactNode` is created by React's `creacteElement` method.

> Remember that JSX transforms to call React's `createElement` node under-the-hood.
>
> This means that the following JSX:
> ```jsx
> const el = <div/>
> ```
>
>   Becomes the following code after compilation:
>
> ```javascript
> const el = React.createElement('div');
> ```

There also exists a `Children.count` method that we could use as an alternative if we wanted.

```jsx
const ParentList = ({children}) => {
  const childrenLength = Children.count(children);
  return <>
    <p>There are {childrenLength} number of items in this array</p>
    <ul>
		{children}
	</ul>
    </>
}
```



# Angular

// TODO: Mention `ngAfterContentInit`

// TODO: Mention `ContentChildren`

// TODO: Mention template tags, query selector

// TODO: Mention `QueryList` type

```typescript
import {
  NgModule,
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';

@Component({
  selector: 'parent-list',
  template: `
    <p>There are {{children.length}} number of items in this array</p>
    <ul>
      <ng-content></ng-content>
    </ul>
  `,
})
class ParentListComponent implements AfterContentInit {
  @ContentChildren('listItem') children: QueryList<HTMLElement>;

  // This cannot be replaced with an `OnInit`, otherwise `children` is empty.
  ngAfterContentInit() {
    console.log(this.children);
  }
}

@Component({
  selector: 'my-app',
  template: `
  <parent-list>
    <li #listItem>Item 1</li>
    <li #listItem>Item 2</li>
    <li #listItem>Item 3</li>
  </parent-list>
  `,
})
class AppComponent {}
```



# Vue

// TODO: Explain `$slots`

// TODO: Explain why we're using `mounted`, and the pitfalls of doing this (we need to add `updated`)

// TODO: Mention that calling `default()` is triggering a render

// TODO: Mention `VNode`, which isn't quite an `HTMLElement`

```javascript
const ParentList = {
  template: `
  <p>There are {{children.length}} number of items in this array</p>
  <ul>
    <slot></slot>
  </ul>
  `,
  data() {
    return {
      children: [],
    };
  },
  mounted() {
    this.children = this.$slots.default();
  },
};

const App = {
  template: `
    <parent-list>
	  <li>Item 1</li>
	  <li>Item 2</li>
      <li>Item 3</li>
    </parent-list>
  `,
  components: {
    ParentList,
  },
};
```

<!-- tabs:end -->



We can see that this reference to children is dynamic and will update even when using a template-driven loop.

<!-- tabs:start -->

# React

```jsx
import {Children, useState} from 'react';

const ParentList = ({children}) => {
  const childArr = Children.toArray(children);
  console.log(childArr);
  return <>
    <p>There are {childArr.length} number of items in this array</p>
    <ul>
		{children}
	</ul>
    </>
}

const App = () => {
    const [list, setList] = useState([1, 42, 13])
    
    const addOne = () => {
        // `Math` is built into the browser 
        const randomNum = Math.floor(Math.random() * 100)
        setList([...list, randomNum]);
    }
	return (
        <>
		<ParentList>
			{list.map((item, i) => 
                      <li key={i}>{i} {item}</li>
            )}
		</ParentList>
        <button onClick={addOne}>Add</button>
        </>
	)
}
```

# Angular

<!-- Editor's note: `console.log(this.children)` will not occur when `QueryList` is updated -->

```typescript

@Component({
  selector: 'parent-list',
  template: `
    <p>There are {{children.length}} number of items in this array</p>
    <ul>
      <ng-content></ng-content>
    </ul>
  `,
})
class ParentListComponent implements AfterContentInit {
  @ContentChildren('listItem') children: QueryList<HTMLElement>;

  ngAfterContentInit() {
    console.log(this.children);
  }
}

@Component({
  selector: 'my-app',
  template: `
  <parent-list>
    <li *ngFor="let item of list; let i = index" #listItem>{{i}} {{item}}</li>
  </parent-list>
  <button (click)="addOne()">Add</button>
  `,
})
class AppComponent {
  list = [1, 42, 13];

  addOne() {
    const randomNum = Math.floor(Math.random() * 100);
    this.list.push(randomNum);
  }
}
```

It's worth noting that when you run `addOne` (by pressing the "Add" button), it will not re-run `ngAfterContentInit`'s `console.log`. To do this, we need to access the `changes` "Observable" and listen for changes:

```typescript
ngAfterContentInit() {
  console.log(this.children);

  // `subscribe` comes from the `changes` RxJS observable 
  this.children.changes.subscribe((childElements) =>
     console.log(childElements)
  );
}
```

> Wait wait wait, what's an "Observable"?

An Observable is an object type that allows you to listen to a series of events via a push-based listening method. In Angular, these Observables are powered by a library called [RxJS](https://rxjs.dev/) that Angular builds upon.

> RxJS is an incredibly powerful library that's well worth learning in the Angular world. While this book/course won't touch on RxJS much (simply because it's a topic worth it's own book series), a great learning resource for RxJS might be: ["RxJS Fundamentals" by the "This Is Learning" community.](https://this-is-learning.github.io/rxjs-fundamentals-course/)

To quickly synopsis what our `changes` observable does:

- Emits data when `children` is updated with new elements
- `subscribe` then listens to these emitted events, run the containing function with the updated value of `this.children`

# Vue

// TODO: Mention why Vue can't do this with `$slots`

<!-- Editors note: It's because if you add `updated` to listen for changes, then call `this.$slots.default()` it will trigger an infinate render, since it will in turn re-trigger `updated -->

This isn't to say that the lack of the ability to easily count slotted children is a big deal; you wouldn't implement code exactly like this in production for 99.99% of cases. Remember, this chapter started by mentioning "Let's take a break from the immediately practical".

>  However, if you absolutely positively really, no, for sure just needed a way to count `children` on the `ul` element, you could do so using `document.querySelector`and listening for re-renders using [the `updated()` lifecycle method](lifecycle-methods#Lifecycle-Chart).
>
> ```javascript
> const ParentList = {
>   template: `
>   <p>There are {{children.length}} number of items in this array</p>
>   <ul id="parentList">
>     <slot></slot>
>   </ul>
>   `,
>   data() {
>     return {
>       children: [],
>     };
>   },
>   methods: {
>     findChildren() {
>       return document.querySelectorAll('#parentList > li');
>     },
>   },
>   mounted() {
>     this.children = this.findChildren();
>   },
>   updated() {
>     this.children = this.findChildren();
>   },
> };
> ```
>
> This doesn't _quite_ follow the same internal logic pattern as our examples in React or Angular, however, which is why it's a bit of an aside.
>
> <!-- Editor's note: While `$el` might seem like a viable alternative to an ID, it's not due to the fact that we have multiple root HTML nodes. This means that `$el` is a VNode, not an `HTMLElement` and therefore does not have a `id` property -->



<!-- tabs:end -->

Here, we can see that whenever a random number is added to the list, our list item counter still increments properly.

# Passing Values to Projected Content

While counting the number of items in a list is novel, it's not a very practical use of accessing projected content in JavaScript.

Instead, let's see if there's a way that we can pass values to our projected content. For example, let's try to change the background color of each `li` item if the index is even or odd.



<!-- tabs:start -->

## React

As part of React's `Children` utilities, we're able to `cloneElement` on each item in the `children` array in order to pass React properties. We can use this logic to pass properties that include styling when the index is even or odd.

```jsx
import {Children, useState} from 'react';

const ParentList = ({ children }) => {
  const childArr = Children.toArray(children);
  const newChildArr = childArr.map((node, i) =>
    React.cloneElement(node, {
      style: { backgroundColor: i % 2 ? 'grey' : '' },
    })
  );
  return (
    <ul>{newChildArr}</ul>
  );
};
```

## Angular

// TODO

## Vue

// TODO

<!-- tabs:end -->







-------------------





- Content reference
  - Children/React
    - Children.forEach and beyond
    - `Children.toArray().find` for single one
  - `@ContentChildren` / Angular
    - `ContentChild`
  - `slots` / Vue
    - `this.$slots`
  - Passing values to content projection
    - `v-slot` attribute / Vue
    - `React.cloneElement` / React
    - NgTemplate `context` / Angular

File list created by `Children.forEach` or a `ng-template` of `ViewContents` .



Then, we pass relevant data via `v-slot`.



End API looks something like:

```jsx
<FileList component={File}/>
```



