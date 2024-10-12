---
{
  title: "Web Fundamentals: JavaScript - DOM Manipulation & Interactivity",
  description: "The seventh chapter of this series finally goes over the DOM, how to manipulate it, and how to make our components interactive!",
  published: "2024-10-20T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["obibaratt", "edpratti"],
  order: 7
}

---

The DOM represents the structure of a webpage, enabling developers to modify content, styles, and elements in real time. In this article, we will explore the fundamentals of DOM manipulation, providing you with essential techniques and examples to enhance your web development projects.

# What we'll learn in this article

- **Manipulating DOM elements**
  - Creating elements
  - Selecting elements
  - Adding and removing `styles`, `class`es & content
  - Listening to events
- **Data loading**

---

# The `document`

The `document` is how you interact with the DOM and everything that is loaded within it. We use the `document.` prefix to manipulate all elements that compose the webpage we're looking at.

We have access to many methods that allow us to get, set and modify elements from the HTML document.

# Creating elements

We can create HTML elements using the `createElement('tag')` method. Let's create a new paragraph, specified by the `<p>` tag.

```js
const newParagraph = document.createElement('p');

/* Modify the content with the textContent suffix */
newParagraph.textContent = "This is a new paragraph.";
```

But this simply stores a new element within the `const` we created. For us to display content, we must append an element to the document.

Let's append our new paragraph to the `<body>` tag.

```js
const newParagraph = document.createElement('p');

/* Modify the content with the textContent suffix */
newParagraph.textContent = "This is a new paragraph.";

/* Apply the appendChild method to the document.body. */
document.body.appendChild(newParagraph);
```

If we were to look at our document, we would now see our paragraph as part of the body.

<iframe data-frame-title="Creating elements" src="pfp-code:./creating-elements?template=node&embed=1&file=src%2Fscript.js"></iframe>

We can use `createElement('tag')` to create any tag supported by HTML. In our first chapter - HTML - we go over semantic elements. Make sure to recap!

---

# Selecting elements

In our demo above, we're already making use of the selecting methods of JavaScript do make our demo interactive. But here's a list of the ways we can get elements from the DOM.

| Method | JavaScript | Returns |
| --- | --- | --- |
| Select by `id` | document.getElementById("myElement") | A unique HTMLElement |
| Select by `class` | document.getElementsByClassName("myClass") | HTMLCollection (Live) |
| Select by `<tag>` | document.querySelectAll("p") | NodeList (Static) |

---

# Manipulating elements

Now that we understand how to select elements and bind them to variables, we can start manipulating them in any way we want. 

We're now going to use everything we've learned in Web Fundamentals — variables, styles, classes, inheritance, and apply them all through JavaScript!

## Adding and removing styles

CSS properties are called `styles`, and we can access them through JavaScript.

In CSS, properties are shown as such:

```css
body {
  background-color: lightblue;
}
```

When accessing properties in JavaScript, we use a different syntax, in camel-case.

Using the `document`, we can access and apply any styles we want.

```js
document.body.style.backgroundColor = "lightblue";
```

There are some limitations, however. In JavaScript, unlike CSS, there are no shorthands. Let's take `padding`, for example.

```css
body {
  padding: 24px 48px;
  /* [padding-top & padding-bottom], [padding-left & padding-right] */
}
```

In JavaScript, however, we cannot apply those properties at once. In JavaScript, we would need to do each individually.

```js
document.body.style.paddingTop = "24px";
document.body.style.paddingBottom = "24px";
document.body.style.paddingLeft = "48px";
document.body.style.paddingRight = "48px";
```

---

## Adding and removing classes

In HTML, we can apply as many classes to an element as we'd like.

```html
<button class="btn-emphasized btn-large btn-icon">Button label</button>
```

In CSS, these are declared as separate classes.

```css
.btn-emphasized { };
.btn-large { };
.btn-icon { };
```

In JavaScript, we can access an element's classes with the `.classList` suffix.

We can **add a class** with the following command.

```js
const element = document.getElementById("#element");

element.classList.add("myClass");
```

We can **remove a class** with the following command:

```js
const element = document.getElementById("#element");

element.classList.remove("myClass");
```

We can also **toggle a class** using `.toggle`.

```js
const element = document.getElementById("#element");

element.classList.toggle("myClass");
```

---

## Adding and removing events

---

# Data loading

---

