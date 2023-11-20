---
{
  title: "Accessing Children",
  description: "Oftentimes, when passing children to a component, you want a way to programmatically access that passed data. Let's learn how to do that in React, Angular, and Vue.",
  published: "2023-01-01T22:12:03.284Z",
  authors: ["crutchcorn"],
  tags: ["webdev"],
  attached: [],
  order: 15,
  collection: "The Framework Field Guide - Fundamentals",
}
---

In [our "Passing Children" chapter](/posts/ffg-fundamentals-passing-children), we talked about how you can pass components and elements as children to another componet:

```jsx
<FileTableContainer>
	<FileTableHeader />
	<FileTableBody />
</FileTableContainer>
```

We also learned in two different chapters that you can programmatically access:

- [HTML Elements](/posts/ffg-fundamentals-element-reference)
- [Custom Components](/posts/ffg-fundamentals-component-reference)

What if there was a way to combine and contrast both of these concepts and programmatically accessing the children elements one-by-one?

> Well, is there a way to do that?

Yes.

Let's start with a simple example: Counting how many children a component has.

# Counting a Component's Children

Let's count how many elements and components are being passed to our component:

<!-- tabs:start -->

## React

React has a built-in helper called `Children` that will help you access data passed as a child to a component. Using this `Children` helper, we can utilize the `toArray` method to create an array from `children` that we can then do anything we might otherwise do with a typical array.

This comes in handy when trying to access the `length` count.

```jsx
import { Children } from "react";

const ParentList = ({ children }) => {
	const childArr = Children.toArray(children);
	console.log(childArr); // This is an array of ReactNode - more on that in the next sentence
	return (
		<>
			<p>There are {childArr.length} number of items in this array</p>
			<ul>{children}</ul>
		</>
	);
};

const App = () => {
	return (
		<ParentList>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ParentList>
	);
};
```

Here, `childArr` is an array of type `ReactNode`. A `ReactNode` is created by React's `createElement` method.

> Remember that JSX transforms to call React's `createElement` node under-the-hood.
>
> This means that the following JSX:
>
> ```jsx
> const el = <div />;
> ```
>
> Becomes the following code after compilation:
>
> ```javascript
> const el = createElement("div");
> ```

There also exists a `Children.count` method that we could use as an alternative if we wanted.

```jsx
const ParentList = ({ children }) => {
	const childrenLength = Children.count(children);
	return (
		<>
			<p>There are {childrenLength} number of items in this array</p>
			<ul>{children}</ul>
		</>
	);
};
```

## Angular

In [our "Dynamic HTML" chapter, we talked about how you're able to assign a "variable template variable" using a `#` syntax](/posts/ffg-fundamentals-dynamic-html#ng-template):

```html
<div #templVar></div>
```

In our previous example, we used them to conditionally render content using `ngIf`, but these template tags aren't simply useful in `ngIf` usage; We can also use them in a myriad of programmatic queries, such as [`ContentChild`](https://angular.io/api/core/ContentChild).

`ContentChild` is a way to query the projected content within [`ng-content`](/posts/ffg-fundamentals-passing-children) from JavaScript.

```typescript
import {
	NgModule,
	Component,
	AfterContentInit,
	ContentChild,
	ElementRef,
} from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: ` <ng-content></ng-content> `,
})
class ParentListComponent implements AfterContentInit {
	@ContentChild("childItem") child: ElementRef<HTMLElement>;

	// This cannot be replaced with an `OnInit`, otherwise `children` is empty.
	ngAfterContentInit() {
		console.log(this.child.nativeElement); // This is an HTMLElement
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ParentListComponent],
	template: `
		<parent-list>
			<p #childItem>Hello, world!</p>
		</parent-list>
	`,
})
class AppComponent {}
```

Here, we're querying for the template tag `childItem` within the project content by using [the `ContentChild` decorator](https://angular.io/api/core/ContentChild).

`ContentChild` then returns [a TypeScript generic type](https://unicorn-utterances.com/posts/typescript-type-generics) of `ElementRef`.

`ElementRef` is a type that has a single property called `nativeElement` containing the [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) in question.

### `ngAfterContentInit` Detects Child Initialization

If you were looking at the last code sample and wondered:

> "What is `ngAfterContentInit` and why are we using it in place of `ngOnInit`?"

Then you're asking the right questions!

See, if we replace our usage of `ngAfterContentInit` with a `ngOnInit`, then we get `undefined` in place of `this.child`:

```typescript
@Component({
	selector: "parent-list",
	standalone: true,
	template: ` <ng-content></ng-content> `,
})
class ParentListComponent implements OnInit {
	@ContentChild("childItem") child: ElementRef<HTMLElement>;

	ngOnInit() {
		console.log(this.child); // This is `undefined`
	}
}
```

This is because while `ngOnInit` runs after the component has rendered, it has not yet received any values within `ng-content`; This is where `ngAfterContentInit` comes into play. This lifecycle method runs once `ng-content` has received the values, which we can then use as a sign that `ContentChild` has finished it's query.

This can be solved by either:

- Using `ngAfterContentInit` if the content is dynamic
- [Using `{static: true}` on the `ContentChild` decorator if the content is static](/posts/ffg-fundamentals-element-reference#Using-static-true-to-use-ViewChild-immediately)

### Handle Multiple Children with `ContentChildren`

While `ContentChild` is useful for querying against a single item being projected, what if we wanted to query against multiple items being projected?

This is where [`ContentChildren`](https://angular.io/api/core/ContentChildren) comes into play:

```typescript
import {
	NgModule,
	Component,
	AfterContentInit,
	ContentChildren,
	QueryList,
} from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			<ng-content></ng-content>
		</ul>
	`,
})
class ParentListComponent implements AfterContentInit {
	@ContentChildren("listItem") children: QueryList<HTMLElement>;

	ngAfterContentInit() {
		console.log(this.children);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ParentListComponent],
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

`ContentChildren` returns an array-like [`QueryList`](https://angular.io/api/core/QueryList) generic type. You can then access the properties of `children` inside of the template itself, like what we're doing with `children.length`.

## Vue

Unlike React and Angular, Vue's APIs don't allow us to easily count a child's list items. There's a lot of nuance to _why_ this is the case, but we'll do our best when we [rewrite Vue from scratch in the third book of the series](https://framework.guide).

<!-- Editor's note: While yes, we could do a `mounted() {this.$slots.children}` for THIS example, two things: 1) It's bad practice in that it will cause two renders. 2) It breaks in the very next code sample -->

<!-- Editors note: It breaks in the next sample because if you add `updated` to listen for changes, then call `this.$slots.default()` it will trigger an infinate render, since it will in turn re-trigger `updated -->

<!-- Editor's note: While `$el` might seem like a viable alternative to an ID, it's not due to the fact that we have multiple root HTML nodes. This means that `$el` is a VNode, not an `HTMLElement` and therefore does not have a `id` property -->

<!-- Editor's note, $slots.default doesn't work with `v-for` -->

<!-- tabs:end -->

# Rendering Children in a Loop

Now that we're familiar with accessing children, let's use the same APIs introduced before to take the following component template:

```html
<ParentList>
	<span>One</span>
	<span>Two</span>
	<span>Three</span>
</ParentList>
```

To render the following HTML:

```html
<ul>
	<li><span>One</span></li>
	<li><span>Two</span></li>
	<li><span>Three</span></li>
</ul>
```

<!-- tabs:start -->

## React

```jsx
const ParentList = ({ children }) => {
	const childArr = Children.toArray(children);
	console.log(childArr); // This is an array of ReactNode - more on that in the next sentence
	return (
		<>
			<p>There are {childArr.length} number of items in this array</p>
			<ul>
				{children.map((child) => {
					return <li>{child}</li>;
				})}
			</ul>
		</>
	);
};

export const App = () => {
	return (
		<ParentList>
			<span style={{ color: "red" }}>Red</span>
			<span style={{ color: "green" }}>Green</span>
			<span style={{ color: "blue" }}>Blue</span>
		</ParentList>
	);
};
```

## Angular

Since Angular's `ContentChildren` gives us an `HTMLElement` reference when using our template variables on `HTMLElements`, we're not able to wrap those elements easily.

Instead, let's change our elements to `ng-template`s and render them in an `ngFor`, [similarly to what we did in our "Directives" chapter](/posts/ffg-fundamentals-directives#Using-ViewContainer-to-Render-a-Template):

```typescript
@Component({
	selector: "parent-list",
	standalone: true,
	imports: [NgFor, NgTemplateOutlet],
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			<li *ngFor="let child of children">
				<ng-template [ngTemplateOutlet]="child" />
			</li>
		</ul>
	`,
})
class ParentListComponent {
	@ContentChildren("listItem") children: QueryList<TemplateRef<any>>;
}

@Component({
	standalone: true,
	imports: [ParentListComponent],
	selector: "app-root",
	template: `
		<parent-list>
			<ng-template #listItem>
				<span style="color: red">Red</span>
			</ng-template>
			<ng-template #listItem>
				<span style="color: green">Green</span>
			</ng-template>
			<ng-template #listItem>
				<span style="color: blue">Blue</span>
			</ng-template>
		</parent-list>
	`,
})
class AppComponent {}
```

## Vue

Just as before, Vue's APIs have a limitation when accessing direct children. Let's explore the _why_ [in the third book in our book series](https://framework.guide).

<!-- tabs:end -->

## Adding Children Dynamically

Now that we have a list of items being transformed by our component, let's add the functionality to add another item to the list:

<!-- tabs:start -->

### React

```jsx
import { Children, useState } from "react";

const ParentList = ({ children }) => {
	const childArr = Children.toArray(children);
	console.log(childArr);
	return (
		<>
			<p>There are {childArr.length} number of items in this array</p>
			<ul>
				{children.map((child) => {
					return <li>{child}</li>;
				})}
			</ul>
		</>
	);
};

const App = () => {
	const [list, setList] = useState([1, 42, 13]);

	const addOne = () => {
		// `Math` is built into the browser
		const randomNum = Math.floor(Math.random() * 100);
		setList([...list, randomNum]);
	};
	return (
		<>
			<ParentList>
				{list.map((item, i) => (
					<span key={i}>
						{i} {item}
					</span>
				))}
			</ParentList>
			<button onClick={addOne}>Add</button>
		</>
	);
};
```

### Angular

<!-- Editor's note: `console.log(this.children)` will not occur when `QueryList` is updated -->

```typescript
@Component({
	selector: "parent-list",
	standalone: true,
	imports: [NgFor, NgTemplateOutlet],
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			<li *ngFor="let child of children">
				<ng-template [ngTemplateOutlet]="child" />
			</li>
		</ul>
	`,
})
class ParentListComponent {
	@ContentChildren("listItem") children: QueryList<TemplateRef<any>>;
}

@Component({
	standalone: true,
	imports: [ParentListComponent, NgFor],
	selector: "app-root",
	template: `
		<parent-list>
			<ng-template *ngFor="let item of list; let i = index" #listItem>
				<span>{{ i }} {{ item }}</span>
			</ng-template>
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

### Vue

While Vue can't render children in a list, it has many more capabilities to showcase. Read on, dear reader.

<!-- tabs:end -->

Here, we can see that whenever a random number is added to the list, our list item counter still increments properly.

# Passing Values to Projected Content

While counting the number of items in a list is novel, it's not a very practical use of accessing projected content in JavaScript.

Instead, let's see if there's a way that we can pass values to our projected content. For example, let's try to change the background color of each `li` item if the index is even or odd.

<!-- tabs:start -->

## React

By now we should be familiar with the `children` property in React. Now get ready to forget everything you know about it:

```jsx
const AddTwo = ({ children }) => {
	return 2 + children;
};

// This will display "7"
export const App = () => {
	return <AddTwo children={5} />;
};
```

> WHAT?!

Yup - as it turns out, you can pass any JavaScript value to React's `children` prop. It even works when you write it out like this:

```jsx
const AddTwo = ({ children }) => {
	return 2 + children;
};

export const App = () => {
	return <AddTwo>{5}</AddTwo>;
};
```

Knowing this, what happens if we pass a function as `children`?:

```jsx
const AddTwo = ({ children }) => {
	return 2 + children();
};

// This will display "7"
export const App = () => {
	return <AddTwo>{() => 5}</AddTwo>;
	// OR <AddTwo children={() => 5} />
};
```

Sure enough, it works!

Now, let's combine this knowledge with the ability to use JSX wherever a value might go:

```jsx
const ShowMessage = ({ children }) => {
	return children();
};

export const App = () => {
	return <ShowMessage>{() => <p>Hello, world!</p>}</ShowMessage>;
};
```

Finally, we can combine this with the ability to pass values to a function:

```jsx
const ShowMessage = ({ children }) => {
	return children("Hello, world!");
};

export const App = () => {
	return <ShowMessage>{(message) => <p>{message}</p>}</ShowMessage>;
};
```

### Displaying the List in React

Now that we've seen the capabilities of a child function, let's use it to render a list with alternating backgrounds:

```jsx
const ParentList = ({ children, list }) => {
	return (
		<>
			<ul>
				{list.map((item, i) => {
					return (
						<Fragment key={item}>
							{children({
								backgroundColor: i % 2 ? "grey" : "",
								item,
								i,
							})}
						</Fragment>
					);
				})}
			</ul>
		</>
	);
};

export const App = () => {
	const [list, setList] = useState([1, 42, 13]);

	const addOne = () => {
		const randomNum = Math.floor(Math.random() * 100);
		setList([...list, randomNum]);
	};

	return (
		<>
			<ParentList list={list}>
				{({ backgroundColor, i, item }) => (
					<li style={{ backgroundColor: backgroundColor }}>
						{i} {item}
					</li>
				)}
			</ParentList>
			<button onClick={addOne}>Add</button>
		</>
	);
};
```

## Angular

```typescript
@Component({
	selector: "parent-list",
	standalone: true,
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			<ng-template
				*ngFor="let template of children; let i = index"
				[ngTemplateOutlet]="template"
				[ngTemplateOutletContext]="{ backgroundColor: i % 2 ? 'grey' : '' }"
			></ng-template>
		</ul>
	`,
})
class ParentListComponent {
	@ContentChildren("listItem", { read: TemplateRef }) children: QueryList<
		TemplateRef<any>
	>;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ParentListComponent],
	template: `
		<parent-list>
			<ng-template
				#listItem
				*ngFor="let item of list; let i = index"
				let-backgroundColor="backgroundColor"
			>
				<li [style]="{ backgroundColor }">{{ i }} {{ item }}</li>
			</ng-template>
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

## Vue

Vue ca... Wait! Vue _can_ do this one!

Let's start by using code that explicitly passes the list of items to a `ParentList` component:

```vue
<!-- ParentList -->
<script setup>
import { defineProps } from "vue";

const props = defineProps(["list"]);
</script>

<template>
	<p>There are {{ props.list.length }} number of items in this array</p>
	<ul>
		<slot></slot>
	</ul>
</template>
```

```vue
<!-- App.vue -->
<script setup>
import ParentList from "./ParentList.vue";

const list = [1, 2, 3];
</script>

<template>
	<ParentList :list="list">
		<li v-for="i in list">Item {{ i }}</li>
	</ParentList>
</template>
```

While this works, it's obnoxious that we have to reference `list` in more than one component template at a time. Currently, we're using `list` in both our `App` template as well as our `ParentList` template.

Luckily, we can utilize `slot` to pass data to a `template` via a `v-slot` attribute:

```vue
<!-- ParentList -->
<script setup>
const props = defineProps(["list"]);
</script>

<template>
	<p>There are {{ props.list.length }} number of items in this array</p>
	<ul id="parentList">
		<slot v-for="(item, i) in props.list" :item="item" :i="i"></slot>
	</ul>
</template>
```

```vue
<!-- App.vue -->
<script setup>
import { ref } from "vue";
import ParentList from "./ParentList.vue";

const list = ref([1, 2, 3]);

function addOne() {
	const randomNum = Math.floor(Math.random() * 100);
	list.value.push(randomNum);
}
</script>

<template>
	<ParentList :list="list">
		<!-- Think of this as "template is recieving an object
		 we'll call props" from "ParentList" -->
		<template v-slot="props">
			<li>{{ props.i }} {{ props.item }}</li>
		</template>
	</ParentList>
	<button @click="addOne()">Add</button>
</template>
```

This `v-slot` is similar to how you might pass properties to a component, but instead we're passing data directly to a `template` to be rendered by `v-slot`.

> You can [object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the `v-slot` usage to gain access to the property names without having to repeat `props` each time:
>
> ```html
> <template v-slot="{item, i}">
> 	<li>{{i}} {{item}}</li>
> </template>
> ```

<!-- tabs:end -->

# Challenge

// TODO: Write

<!-- tabs:start -->

## React

```jsx
import * as React from "react";

const Table = ({ data, header, children }) => {
	const headerContents = header({ length: data.length });

	const body = data.map((value, rowI) => children({ value, rowI }));

	return (
		<table>
			<thead>{headerContents}</thead>
			<tbody>{body}</tbody>
		</table>
	);
};

const data = [
	{
		name: "Corbin",
		age: 24,
	},
	{
		name: "Joely",
		age: 28,
	},
	{
		name: "Frank",
		age: 33,
	},
];

export default function App() {
	return (
		<Table
			data={data}
			header={({ length }) => (
				<tr>
					<th>{length} items</th>
				</tr>
			)}
		>
			{({ rowI, value }) => (
				<tr>
					<td
						style={
							rowI % 2
								? { background: "lightgrey" }
								: { background: "lightblue" }
						}
					>
						{value.name}
					</td>
				</tr>
			)}
		</Table>
	);
}
```

## Angular

```typescript
@Component({
	selector: "table-comp",
	standalone: true,
	imports: [NgFor, NgTemplateOutlet],
	template: `
		<table>
			<thead>
				<ng-template
					[ngTemplateOutlet]="header"
					[ngTemplateOutletContext]="{ length: data.length }"
				/>
			</thead>

			<tbody>
				<ng-template
					*ngFor="let item of data; let index = index"
					[ngTemplateOutlet]="body"
					[ngTemplateOutletContext]="{ rowI: index, value: item }"
				/>
			</tbody>
		</table>
	`,
})
export class TableComponent {
	@ContentChild("header", { read: TemplateRef }) header: TemplateRef<any>;
	@ContentChild("body", { read: TemplateRef }) body: TemplateRef<any>;

	@Input() data: any[];
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [TableComponent],
	template: `
		<table-comp [data]="data">
			<ng-template #header let-length="length">
				<tr>
					<th>{{ length }} items</th>
				</tr>
			</ng-template>
			<ng-template #body let-rowI="rowI" let-value="value">
				<tr>
					<td
						[style]="
							rowI % 2 ? 'background: lightgrey' : 'background: lightblue'
						"
					>
						{{ value.name }}
					</td>
				</tr>
			</ng-template>
		</table-comp>
	`,
})
class AppComponent {
	data = [
		{
			name: "Corbin",
			age: 24,
		},
		{
			name: "Joely",
			age: 28,
		},
		{
			name: "Frank",
			age: 33,
		},
	];
}
```

## Vue

```vue
<!-- App.vue -->
<script setup>
import Table from "./Table.vue";

const data = [
	{
		name: "Corbin",
		age: 24,
	},
	{
		name: "Joely",
		age: 28,
	},
	{
		name: "Frank",
		age: 33,
	},
];
</script>

<template>
	<Table :data="data">
		<template #header="{ length }">
			<tr>
				<th>{{ length }} items</th>
			</tr>
		</template>
		<template v-slot="{ rowI, value }">
			<tr>
				<td
					:style="rowI % 2 ? 'background: lightgrey' : 'background: lightblue'"
				>
					{{ value.name }}
				</td>
			</tr>
		</template>
	</Table>
</template>
```

```vue
<script setup>
const props = defineProps(["data"]);
</script>

<template>
	<table>
		<thead>
			<slot name="header" :length="props.data.length"></slot>
		</thead>
		<tbody>
			<slot
				v-for="(item, i) in props.data"
				:key="i"
				:rowI="i"
				:value="props.data[i]"
			/>
		</tbody>
	</table>
</template>
```

<!-- tabs:end -->
