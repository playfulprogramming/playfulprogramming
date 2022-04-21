---
{
    title: "Content Reference",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 9,
    series: "The Framework Field Guide"
}
---


Let's take a break from the immediately practical to talk about some abstract concepts.

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

React has a built-in helper called `Children` that will help you access data passed as a child to a component.

```jsx
import {Children} from 'react';

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
	return (
		<ParentList>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ParentList>
	)
}
```

# Angular

// TODO

# Vue

// TODO

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

// TODO

# Vue

// TODO

<!-- tabs:end -->

Here, we can see that whenever a random number is added to the list, our list item counter still increments properly.





-------------------





- Content reference
  - Children/React
    - Children.forEach and beyond
  - `@ViewContents` / Angular
  - `slots` / Vue
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



