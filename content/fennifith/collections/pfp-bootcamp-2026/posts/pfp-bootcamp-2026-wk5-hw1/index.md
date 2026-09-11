---
{
  title: "Week 5 - Tier 1 Homework",
  description: "Use JavaScript click events and HTML attributes to toggle a button's state and change its background color.",
  published: "2026-02-04T21:12:03.284Z",
  order: 1,
  noindex: true,
}
---

Given the ability to access an element from a `<script>` tag:

```html
<button>Toggle</button>

<script>
	const element = document.querySelector("button");

	console.log(element);
</script>
```

We can add an event listener to have a function called by the browser on an event:

```html
<button>Toggle</button>

<script>
	const element = document.querySelector("button");

	function alertMe() {
		alert("Toggle pressed");
	}

	element.onclick = alertMe; // <- Event Listener
</script>
```

And even use `getAttribute` to retrieve values from an HTML tag  
and `setAttribute` to bind values to an HTML tag:

```html
<button data-count="1">Toggle</button>

<script>
	const element = document.querySelector("button");

	function toggleLiked() {
		// Attribute values are always strings
		const attributeValue = element.getAttribute("data-count");

		// So we have to convert them to numbers to do math with it
		const count = Number(attributeValue);
		element.setAttribute("data-count", count + 1);
	}

	element.onclick = toggleLiked;
</script>
```

Pause now and try to create a boolean attribute that can be toggled from `"true"` to `"false"`.

To convert a string "false" to a \`false\` boolean, we **can't** simply use `Boolean()` in the same way we used `Number()`. Instead, we need to compare the string value to `"false"`:

```javascript
const stringValue = "false"; // or "true"
const booleanValue = stringValue == "false";
```

# Adding a background toggle

We can even use this trait of changing attributes to change the boolean value of an attribute:

```html
<button data-liked="true">Toggle</button>

<script>
	const element = document.querySelector("button");

	function toggleLiked() {
		const attributeValue = element.getAttribute("data-liked");
		const isLiked = attributeValue == "true";
		element.setAttribute("data-liked", !isLiked);
	}

	element.onclick = toggleLiked;
</script>
```

And once this is done, we can add a style tag to toggle the theme:

```html
<button data-liked="true">Toggle</button>

<style>
	[data-liked="true"] {
		background: red;
	}
</style>

<script>
	const element = document.querySelector("button");

	function toggleLiked() {
		const attributeValue = element.getAttribute("data-liked");
		const isLiked = attributeValue == "true";
		element.setAttribute("data-liked", !isLiked);
	}

	element.onclick = toggleLiked;
</script>
```
