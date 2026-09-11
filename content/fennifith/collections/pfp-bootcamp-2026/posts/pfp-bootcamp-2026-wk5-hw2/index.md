---
{
  title: "Week 5 - Tier 2 Homework",
  published: "2026-02-04T21:12:03.284Z",
  order: 1,
  noindex: true,
}
---

Before doing this exercise, check out this article:

<!-- ::start:link-preview -->
[Web Fundamentals: DOM Manipulation](/posts/web-fundamentals-dom-manipulation)
<!-- ::end:link-preview -->

This article explains what the DOM is and how JavaScript manipulates it. You are expected to read this before starting.

# Task

Remove a `<li>` from the Page (Using querySelector)
We are going to remove a list item (`<li>`) from the page using JavaScript.
You will do this by adding a `<script>` tag to the page and writing JavaScript inside it.

# HTML Structure

**We are working with this HTML structure:**

```html
<main>
	<ul>
		<li>Ice Cream</li>
	</ul>
</main>
```

---

**Step 1**: Add a `<script>` tag at the bottom of the page, after the HTML.

```html
<main>
	<ul>
		<li>Ice Cream</li>
	</ul>
</main>

<script></script>
```

There are many ways to solve this problem.

This is one way to go about it, using: `querySelector` and `removeChild`

---

**Step 2**: Select the `<main>` element

Inside the `<script>` tag, grab the main container from the page.

```html
<script>
	const main = document.querySelector("main");
</script>
```

---

**Step 3**: Select the `<ul>` inside `<main>`

The `<ul>` lives inside `<main>`, so we select it from there.

```html
<script>
	const main = document.querySelector("main");
	const ul = main.querySelector("ul");
</script>
```

---

**Step 4**: Select the `<li>` to remove

Right now, there is only one `<li>` inside the `<ul>`.

```html
<script>
	const main = document.querySelector("main");
	const ul = main.querySelector("ul");
	const li = ul.querySelector("li");
</script>
```

---

**Step 5**: Remove the `<li>` from the `<ul>`

To remove an element, the parent removes the child.

```html
<script>
	const main = document.querySelector("main");
	const ul = main.querySelector("ul");
	const li = ul.querySelector("li");
	ul.removeChild(li);
</script>
```

---

**Final Code!**

```html
<main>
	<ul>
		<li>Ice Cream</li>
	</ul>
</main>

<script>
	const main = document.querySelector("main");
	const ul = main.querySelector("ul");
	const li = ul.querySelector("li");
	ul.removeChild(li);
</script>
```

# What Just Happened

- We selected the parent element (`ul`)
- We selected the child element (`li`)
- We told the parent to remove the child
- That’s how DOM element removal works!

**Done 🎉**
