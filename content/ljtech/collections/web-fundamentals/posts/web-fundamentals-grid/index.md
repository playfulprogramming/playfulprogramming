---
{
  title: "Web Fundamentals: Grid",
  description: "In the fourth chapter of our series, we're going to be introduced to CSS grid, a well-known feature to display content, and used in almost every website you visit.",
  published: "2024-08-18T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["ljtech","edpratti"],
  order: 4
}
---


The CSS property `display: grid` is commonly referred to as gridbox. Unlike flexbox, it is capable of creating two-dimensional layouts using intersecting columns and rows.

Today we'll learn how to use grid's features to build dynamic layouts that adapt to users' needs.

# Templates

## Areas

To define how many areas a grid will have, `grid-template-areas` takes in any term to specify layout slots. The number of terms defines the number of "slots" a particular layout can take up.

**Here we are creating a 3x3 layout.** The distribution of each layout, however, is as such:

```css
grid-template-areas:
  "a a a"
  "b b c"
  "b b c";
```

To better illustrate it, let's change the terms from letters to our actual content and use real CSS:

```css
.grid-container {
  grid-template-areas:
    "header header header"
    "content content sidebar"
    "content content sidebar";
  gap: 16px;
  height: 376px;
}

```

- A header that takes up the whole top row.
- Content takes 2/3 of the remaining grid space. ***We will come back to this.***

<iframe data-frame-title="Grid: Template areas" src="uu-code:./template-areas?template=node&embed=1&file=src%2Fstylesheet.css"></iframe>

## Customizing areas

Using `grid-template-areas` will define the default distribution, but that does not mean it cannot be customized. Using the `column` and `row` commands, we can tweak how we want to display each template area.

Let's look at each now.

## Columns

By default, columns and rows are distributed evenly. 

```css
grid-template-areas:
  "a a"
  "b c";
```

![A grid with an item on the top spanning two columns and two items on the bottom](./grid-columns.svg)

---

## Rows

```css
grid-template-rows: 1fr 2fr 1fr;
```

![A grid with a single column and three items; the item in the middle is double the height as the other two items above and below it](./grid-rows.svg)

Adding `display: grid` to a container will cause any immediate descendants to become grid items. Similar to **[Flexbox](./web-fundamentals-flexbox)**, we can use placement methods to help align, justify, and space grid items inside the container.

---

**Here is a list of CSS properties used to control gridbox properties:**

> [`grid-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area): Controls a grid item's location

> [`grid-template-areas`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas): Controls cells and assigns names

> [`grid-auto-columns`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns): Controls the track size of grid columns

> [`grid-auto-flow`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow): Controls the auto-placement algorithm

> [`grid-auto-rows`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows): Controls the track size of grid rows

> [`grid-gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/gap): Controls gaps between columns and rows

> [`grid-template-columns`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns): Controls line names and track size of grid columns

> [`grid-template-rows`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows): Controls line names and track size of grid rows

> ⚡ [Live Code Example: Gridbox Layout](https://codesandbox.io/s/gridbox-layout-tnu5b?file=/styles.css)

---

## Using `place-items`

```css
/* Center vertically and horizontally */
place-items: center center;
```

![A grid of items centered vertically and horizontally.](./center-center.svg)

```css
/* Center vertically and align them to the right edge */
place-items: center end;
```

![A grid of items centered vertically, but aligned to the right corner.](./center-end.svg)

```css
/* Align items to the bottom right corner */
place-items: end end;
```

![A grid of items aligned to the bottom right corner.](./end-end.svg)

```css
/* Align items to the top left corner */
place-items: start start;
```

![A grid of items aligned to the top right corner.](./start-start.svg)

```css
/* Center horizontally and align them to the top edge */
place-items: start center;
```

![A grid of items centered horizontally and aligned to the top edge.](./start-center.svg)

> 🤓 `place-items` is super effective if you're using grid!