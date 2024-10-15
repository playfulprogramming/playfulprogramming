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

In the following demo, we're toggling two classes on a card.: `.small` and `.no-image`. We're also performing style changes when both are applied!

```css
/* Causes the card to shrink in size */
.small {
  width: 240px;
}

/* When applied, hides the #illustration */
.no-image > #illustration {
  display: none;
}

/* When the card is small and the illustration is hidden,
change the corner radius to be smaller, so as to not clip the text. */
.pfp-card.small.no-image {
  border-radius: 24px;
}
```

<iframe data-frame-title="Toggling classes" src="pfp-code:./toggling-classes?template=node&embed=1&file=src%2Fscript.js" height="800"></iframe>

---

## Adding and removing events

In all of our demos in this series, we've been attaching events to elements to make them interactive. Now we're going to formally talk about them.

To add an event, we must attach it to an element, using `addEventListener(type, listener)`.

```js
/* Declare our target */
const toggleButton = document.getElementById("myButton");

/* Attach an event */
toggleButton.addEventListener('click', myFunction);

function myFunction() = { ... };
```

In the example above, our `addEventListener()` is detecting an interaction type of `'click'`, and when triggered, executes the `myFunction` function.

### Event types

Not all events are created equal. Not only can specific elements trigger specific events, but so can different interaction sources.


| Common sources | Event type |
| --- | --- |
| Mouse | <ul><li>`click`: A single click.</li><li>`dbclick`: A double click.</li><li>`mousedown`: When pressing down on a mouse's left button.</li><li>`mouseup`: When letting go of a mouse's left button.</li><li>`mouseover`: When hovering on an element.</li><li>`mouseout`: When a mouse cursor leaves the element it was previously hovering on.</li><li>`mousewheel`: A mousewheel click.</li><li>`contextmenu`: Triggered by a right-click.</li></ul> |
| Keyboard | <ul><li>`keypress`: A particular key is pressed.</li><li>`keydown`: A key is currently being pressed.</li><li>`keyup`: A key was released.</li></ul> |
| Touch | <ul><li>`keypress`: A particular key is pressed.</li></ul> |
| Forms | <ul><li>`focus`: When the form is focused.</li><li>`blur`: When focus is taken away from the form.</li><li>`change`: When the form's value is changed.</li><li>`submit`: When the form value is submitted, either through a key or through a `<submit>` button.</li></ul> |
| Window | <ul><li>`resize`: When the viewport is resized.</li><li>`scroll`: When a scroll event is detected.</li><li>`load`: When the current page loads completely.</li><li>`unload`: When the user leaves the current page, unloading it.</li></ul> |

---

# Fetching data

Now let's add data to our layouts! So far, we've been working with static data, where we manually input every piece of content that is being shown to the user. But what if we want to fetch data from an API?

To do so, we use a `fetch` request, or a `GET` request. Let's assume that our API provides two key pairs: A title, and an image URL.

To fetch this data, we would write a `GET` request as such:

```js
fetch("https://example.com/api/random-image")
  .then(response => response.json())  // Parse the response as JSON
  .then(data => {
    const title = data.title;         // Extract the title
    const imageUrl = data.url;        // Extract the image URL
  })
  .catch(error => console.error('Error:', error)); // Catch any errors with the response
```

<iframe data-frame-title="GET Request" src="pfp-code:./get-request?template=node&embed=1&file=src%2Fscript.js" height="640"></iframe>

---

## Populating a layout

Now let's modify our code so that it populates an entire grid of items! 

> In the following demo, we're now iterating several times over our `fetch` function, and creating an array of items.<br>
> After the array is complete, we construct a new card for each item with `appendChild` and then append that card to the grid!

<iframe data-frame-title="Populating grid with data" src="pfp-code:./populating-grid?template=node&embed=1&file=src%2Fscript.js" height="640"></iframe>

---

# Conclusion

**And with that, we've reached the end of Web Fundamentals.**

I would like to thank each and every one that has read through the series, provided feedback, and those who found it helpful!

If you'd like to see more articles on this series, tackling topics that we have missed, **let us know in our Discord!** We're always monitoring blog post requests, and we'd love to help more and more people get started on their webdev journey.

I'll see you on the next one. Take care, and happy development!