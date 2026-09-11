---
{
  title: "Week 5 - Tier 3 Homework",
  description: "Build a JavaScript to-do list that turns text input into new list items when you press Enter.",
  published: "2026-02-04T21:12:03.284Z",
  order: 1,
  noindex: true,
}
---

Before doing this exercise, read a little bit about the input tag:

<!-- ::start:link-preview -->
[MDN: Input Element Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
<!-- ::end:link-preview -->

Input tags can do a lot of things! We’ll only be using the “text” type in this homework, but it’s useful to know about the other options and attributes that are there.

---

# Task

Build a TODO list app using a `<ul>` list element and an `<input>`

You’ll first need to create the HTML for a list and an input tag

Then, add a `<script>` tag and write JavaScript code:

- When the <kbd>Enter</kbd> key is pressed on the input element, create a new `<li>` element and add it to the list.
- Copy the text that is typed into the `<input>` and place it in the `<li>` elements that you create.

# Step 1: HTML Structure

First, create an empty “unordered list” element and give it an “id”.

```html
<main>
	<h1>My Todo List</h1>
	<ul id="TodoList"></ul>
</main>
```

Then, add an “input” element, with the “id”, “type”, and “placeholder” attributes.

```html
<main>
	<h1>My Todo List</h1>
	<ul id="TodoList"></ul>
	<input id="TodoInput" type="text" placeholder="Add a TODO entry..." />
</main>
```

Finally, add a “script” tag and use `document.querySelector` to find these elements on the page.

```html
<main>
	<h1>My Todo List</h1>
	<ul id="TodoList"></ul>
	<input id="TodoInput" type="text" placeholder="Add a TODO entry..." />
</main>

<script>
	const listEl = document.querySelector("#TodoList");
	const inputEl = document.querySelector("#TodoInput");
</script>
```

# Step 2: Adding a list item

Let’s write some code that creates a new list item and adds it to the page.

1. Use the “document.createElement” function to create a new `<li>`.
2. Set the “innerText” property on your `listItemEl` to give it some text.
3. Finally, the “append” function on `listEl` to add your new `listItemEl` to the page.

```html
<script>
	const listEl = document.querySelector("#TodoList");
	const inputEl = document.querySelector("#TodoInput");

	// Adding a new list item:
	const listItemEl = document.createElement("li"); // 1.
	listItemEl.innerText = "File my taxes"; // 2.
	listEl.append(listItemEl); // 3.
</script>
```

Take a moment to understand how this code works. If you open your webpage, you should see that “File my taxes” is present in your list.

You want to use this code to add a new list item when the “Enter” key is pressed. To do that, let’s move it into a function:

```html
<script>
	const listEl = document.querySelector("#TodoList");
	const inputEl = document.querySelector("#TodoInput");

	function createListItem() {
		// Adding a new list item:
		const listItemEl = document.createElement("li"); // 1.
		listItemEl.innerText = "File my taxes"; // 2.
		listEl.append(listItemEl); // 3.
	}
</script>
```

# Step 3: Listen for the "Enter" Key

Currently, you can type into your input element, but nothing happens!

You want to know when the “Enter” button is pressed. For this, we’ll use the [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) function to listen for the [keydown](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) event.

```javascript
inputEl.addEventListener("keydown", () => {
	alert("A key was pressed!");
});
```

If you run this code, you’ll notice that the input creates an alert every time you press a key! We only care about the “Enter” key, so we need to change that.

You can access the “event” from addEventListener by adding a parameter to your arrow function:

```javascript
inputEl.addEventListener("keydown", (event) => {
	alert("A key was pressed: " + event.key);
});
```

Now, you should see an alert that tells you what key was pressed. Write an **if statement** so that this only creates an alert for the “Enter” key.

```javascript
inputEl.addEventListener("keydown", (event) => {
	if (event.key == "Enter") {
		alert("A key was pressed: " + event.key);
	}
});
```

Finally, instead of the alert, you can use the “createListItem” function that we wrote before.

```html
<script>
	const listEl = document.querySelector("#TodoList");
	const inputEl = document.querySelector("#TodoInput");

	function createListItem() {
		// Adding a new list item:
		const listItemEl = document.createElement("li"); // 1.
		listItemEl.innerText = "File my taxes"; // 2.
		listEl.append(listItemEl); // 3.
	}

	inputEl.addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			createListItem();
		}
	});
</script>
```

# Step 4: Use the input value

Right now, no matter what we type into our input, the list item always says “File my taxes”. Let’s change that!

You can access the input content from `createListItem()` using “inputEl.value”.

```javascript
function createListItem() {
	// Adding a new list item:
	const listItemEl = document.createElement("li");
	listItemEl.innerText = inputEl.value;
	listEl.append(listItemEl);
}
```

Finally, let’s clear the input content once the list item is added:

```javascript
function createListItem() {
	// Adding a new list item:
	const listItemEl = document.createElement("li");
	listItemEl.innerText = inputEl.value;
	listEl.append(listItemEl);
	inputEl.value = "";
}
```

# Final Code

```html
<main>
	<h1>My Todo List</h1>
	<ul id="TodoList"></ul>
	<input id="TodoInput" type="text" placeholder="Add a TODO entry..." />
</main>

<script>
	const listEl = document.querySelector("#TodoList");
	const inputEl = document.querySelector("#TodoInput");

	function createListItem() {
		// Adding a new list item:
		const listItemEl = document.createElement("li");
		listItemEl.innerText = inputEl.value;
		listEl.append(listItemEl);
		inputEl.value = "";
	}

	inputEl.addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			createListItem();
		}
	});
</script>
```

# Above and beyond...

Think about how we could **remove an item from the list** when it is clicked.

Remember the `.addEventListener(“click”, () => {});` function from our lesson? How can we add a click event listener to every `listItemEl` that you create?

Combine that with the “.removeChild” function you used in [the Tier 2 homework](/posts/pfp-bootcamp-2026-wk5-hw2)
