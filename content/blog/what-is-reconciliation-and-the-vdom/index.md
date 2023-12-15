---
{
    title: "What is Reconciliation and the Virtual DOM (VDOM)?",
    description: "",
    published: '2023-12-14T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'javascript', 'webdev'],
    attached: [],
    license: 'cc-by-4',
    collection: "React Beyond the Render",
    order: 1
}
---

[In our last post we introduced how a modern frontend framework like React, Angular, or Vue are able to make your JavaScript state easier to sync to the DOM using "Reactivity"](/posts/what-is-reactivity).

Towards the end of that post, I touched on how each of these frameworks' mechanisms for reactivity work under-the-hood through external links.

One of those mechanisms used by frameworks like React and Vue is called the "Virtual DOM" (Also known as the "VDOM") and use a process called "Reconciliation" to reflect the changes made to this "VDOM" to the real DOM.

Let's take a look at how this works in practical terms.

# What is the Virtual DOM (VDOM)?

In a broad stroke, the virtual DOM (VDOM) is a reflection of the code you've written in your framework that eventually gets mirrored to the DOM. This is in order to make sure that updates to your JavaScript state are duplicated into the DOM via reactivity.

Too terminology heavy? No problem, here's an example.

Let's say that you have a bit of HTML:

```
<ul>
	<li><p>One</p></li>
	<li><p>One</p></li>
	<li><p>One</p></li>
</ul>
```

This might create a DOM tree that looks similar to the following:

![// TODO: Write alt](./dom.svg)

> If you need a refresher on how the DOM works, [check out our post on the topic](/posts/understanding-the-dom).



Similarly, if you write the following JSX:

```jsx
const App = () => {
	return (
        <ul>
            <li><p>One</p></li>
            <li><p>One</p></li>
            <li><p>One</p></li>
        </ul>
	)
}
```

You'll end up with a VDOM that mirrors the markup you've written in JSX. This JSX is then reflected to the DOM itself:

![](./vdom-vs-dom.svg)

The process of how these changes are mirrored is called "Reconciliation".

# What is "Reconciliation"?

Reconciliation is the process of reflecting changes from a frameworks' virtual DOM into the DOM via a three-step process:

1) Listening for changes to the state
2) Diffing the changes made to the VDOM
3) Committing the changes from the VDOM to the DOM

![// TODO: Write alt](./diff-commit.svg)

# What is the `key` property?

While this process of reconciliation might seem simple at first, it can get quite complex. For example, consider how a list might be handled:

```jsx
import React, { useState } from 'react';

const fakeNames = [
  'Gulgowski',
  'Johnston',
  'Nader',
  'Flatley',
  'Lemke',
  'Stokes',
  'Simonis',
  'Little',
  'Baumbach',
  'Spinka',
];

let id = 0;

function createPerson() {
  return {
    id: ++id,
    name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
  };
}

export default function App() {
  const [list, setList] = useState([
    createPerson(),
    createPerson(),
    createPerson(),
  ]);

  function addPersonToList() {
    const newList = [...list];
    // Insert new friend at random location
    newList.splice(
      Math.floor(Math.random() * newList.length),
      0,
      createPerson()
    );
    setList(newList);
  }

  return (
    <div>
      <h1>My friends</h1>
      <button onClick={addPersonToList}>Add friend</button>
      <ul>
        {list.map((person) => (
          <li>
            <label>
              <div>{person.name} notes</div>
              <input />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Here, we're storing a list of our friends and allowing the user to add to this list by pressing a button. We even have a little place to store notes about your friends!

But notice what happens to those notes when someone gets added to the start of the list:

<video src="./incorrect-user.mp4" title="// TODO: Write alt"></video>

See how the note about Little is now assigned to the wrong person.

This is because React needs some way to identify which element is which in a list. By default, this is the index of the list item - which is why our note about Little (whom was originally at the top of the list) is still at the top of the list when someone else is added, despite that not being correct.

Without this default behavior, the `input`s inside of the list would all disappear every time the user added to the list, as it wouldn't know to avoid re-rendering the contents of the DOM on existing items:

![// TODO: Write alt](./render_without_keys.svg)



To fix this, we just need to explicitly tell React which user is which in the list using a special `key` property:

```jsx
<ul>
    {list.map((person) => (
      <li key={person.id}>
        <label>
          <div>{person.name} notes</div>
          <input />
        </label>
      </li>
    ))}
</ul>
```

![// TODO: Write alt](./render_with_keys.svg)

# Conclusion

