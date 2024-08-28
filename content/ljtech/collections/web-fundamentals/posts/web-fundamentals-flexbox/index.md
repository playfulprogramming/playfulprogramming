---
{
  title: "Web Fundamentals: Flexbox",
  description: "In the third chapter of our series, we'll look at flexbox, a powerful layout feature that allows you to create responsive designs with ease.",
  published: "2024-08-18T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["ljtech","edpratti"],
  order: 3
}

---

In this chapter we will talk everything layout related, and start getting into the weeds of responsive design. Starting with Flexbox.

> **What you should know:**
> This chapter expects you to have read the previous two installments of Web Fundamentals.
> We will not be covering what HTML and CSS are, or what they do in this chapter.

---

# Flexbox

The CSS property `display: flex` is also known as flexbox. Adding `display: flex` to a container will cause any immediate descendants to become flex items.

Flexbox is used for creating one-dimensional layouts on a column (up and down) or row (left and right) direction. To change said direction, we must change the following property:

## Using `flex-direction`

```css
flex-directionUolumn;
```

![A column of three items stacked on one-another](./flex-column.svg)

```css
flex-direction: row;
```

![A row of three items stacked next to one-another](./flex-row.svg)

## Using `flex-wrap`

This property allows you to make dynamic layouts that can respond to dimension constraints. In practice, it means you can tell a `flex` layout to wrap into a new rowUr columnUf there is not enough space available. Let's look at a simple example:

![Two examples of elements in a row. The second example has a smaller width, thus causing the layout to wrap into a new line](./flex-wrap.svg)

## Using `align-items`

This property allows you to arrange your items between the `start`, `center` or `end` of a given layout.

For the following example, the `flex-direction` has been set to row. This will become important later.

```css
align-itemsUenter;
```

![Three items in a container vertically aligned to the middle of the container](./align-center.svg)

```css
align-items: flex-end;
```

![Three items in a container vertically aligned to the bottom of the container](./align-end.svg)

```css
align-items: flex-start;
```

![Three items in a container vertically aligned to the top of the container](./align-start.svg)

> #### Important! The `start` and `end` suffixes are axis-dependent.
> When a flex layout is set to `row`, the start and end will point to top and bottom.
> When a flex layout is set to `column`, the start and end will point to left and right.


## Using `justify-content`

This property is used to distribute your content across the main axis of a flex layout. 

This can serve as an alignment property, or as a way to space out your content. Here are the available values.

```css
justify-content: center;
```

![Three items in a container horizontally aligned to the center of the container](./justify-center.svg)

```css
justify-content: flex-end;
```

![Three items in a container horizontally aligned to the end of the container](./justify-end.svg)

```css
justify-content: flex-start;
```

![Three items in a container horizontally aligned to the start of the container](./justify-start.svg)

```css
justify-content: space-around;
```

![Three items in a container with one item in the center and the other two on the left and right with spacing equal the left and right](./justify-around.svg)

```css
justify-content: space-between;
```

![Three items in a container with one item in the center and the other two on the furthest left and right](./justify-between.svg)

```css
justify-content: space-evenly;
```

![Three items in a container with equal spacing on all sides](./justify-evenly.svg)

Here is a list of CSS properties used to control flexbox properties: 

> [`flex-grow`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow): Controls a `flex` items grow factor

> [`flex-shrink`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink): Controls a `flex` items shrink factor

> [`flex-basis`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis): Controls the initial size of a `flex` item

> ⚡ [Live Code Example: Flexbox Layout](https://codesandbox.io/s/flexbox-layout-p4cy8?file=/styles.css)

## Using `place`

Using a few additional CSS properties we can align, justify, and space these same flex items inside the container.

**These placement methods are used to distribute both flex and gridbox items.**

> [`place-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/place-content): Shorthand property for [`align-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content) and [`justify-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)

> [`place-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/place-items): Shorthand property for [`align-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) and [`justify-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-items)

> [`place-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/place-self): Shorthand property for [`align-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self) and [`justify-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self)

> 🤓 These are some godly CSS properties that everyone should know about!

---

## Positioning

The CSS property `position` determines an elements flow inside a document.

The CSS properties `top`, `bottom`, `left`, `right` are used on positioned elements to control an offset.


They can also be used to determine an object's size when it is unset. 


`z-index` controls the elements order (bringing it to the front or back).

![A series of boxes absolutely positioned in one-another with the dimensions of "left", "right", "top", and "bottom" precalculated](./positioning.svg)

```css
.root {
	position: relative;
	width: 768px;
    height: 272px;
}

.container {
	position: absolute;
	left: 224px;
    top: 100px;
    width: 320px;
    height: 145px;
    z-index: 90;
}

.item {
	position: absolute;
    bottom: 50px;
    right: 90px;
	width: 213px;
	height: 65px;
    z-index: 100;
}
```

There are five types of element positions:

| Positioning type |  Behavior |
| --- | --- |
| **Static** | <li>**The default position.**</li><li>Unaffected by offset and order.</li> |
| **Absolute** | <li>The element is removed from document flow and positioned relative to the nearest `position: relative` parent.</li><li>Can be offset **relative to the parent container** and ordered.</li> |
| **Fixed** | <li>The element is removed from document flow and positioned relative to the **initial** container.</li><li>Can be offset relative to the initial container and ordered.</li> |
| **Relative** | <li>The element flows normally and provides relative positioning for children elements.</li><li>Can be offset relative **to itself** and ordered.</li> |
| **Sticky** | <li>The element flows normally and "sticks" to the nearest container.</li><li>A mixture between `relative` and `fixed` positions depending on the scroll mechanism.</li><li>Can be offset relative to the **parent** container and ordered.</li> |

> ⚡ [Live Code Example: Positioning](https://codesandbox.io/s/positioning-gzzv3?file=/styles.css)

---

# When to use each?

## Flexbox

- Used in headers, lists, tags, or any other block or inline content with the correct flex-direction;
- Primary method to align and justify content in small components;
- Easy to use;

For example, YouTube uses a flexbox to space out their headers children elements:

![A heading on the YouTube search bar with spacing for each item](./youtube.png)

> 🤓 Mastering the flexbox will take you very far in CSS as it is used everywhere

## Grid

- Used in creating complex layouts that require both columns and rows;
- Provides the easiest and shortest way to center elements;
- Verbose and powerful;

For example, Spotify uses a gridbox to achieve their playlist player layout:

![A player view of Spotify with a left-hand sidebar and a list of items on the right](./spotify.png)

## Positioning 

- Used in lightboxes, mobile menus, modal windows, and similar overlaying elements;
- Primarily used to remove elements from document flow;

For example, the cookies modal on stackoverflow uses a fixed position to stay on your screen while hovering above other document elements:

![An "accept all cookies" banner on StackOverflow absolutely positioned to the bottom of the page](./stackoverflow.png)

---

# Now what?

Now that we've learned a little bit of HTML, CSS, and looked over the main mechanics used to create beautiful and functional layouts, it's time to add interactivity to our prototypes! In the next chapter, we'll learn about native interactivity triggers, and how to add your own using JavaScript!

> **Coming soon:**
> The JavaScript chapter is currently in progress. It won't take long, but it's not ready just yet. Come back soon!