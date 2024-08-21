---
{
  title: "Web Fundamentals: CSS",
  description: "The second chapter in our front-end series. Let's delve right into the world of CSS, variables and selectors.",
  published: "2024-08-18T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["ljtech","edpratti"],
  order: 2
}

---

### Welcome to the second installment of Web Fundamentals!

> **What you should know:**
> This chapter expects you to have read the previous installment of Web Fundamentals.

This article will go over Cascading Style Sheets, detailing what they are, what they allow, and how they are used to bend and style HTML to make up beautiful and responsive designs in an efficient manner. 

Let's waste no time, and get right into it.

# Introduction to CSS

In the previous article, we discussed how HTML is the skeleton of the web. And that's a very apt description.

## CSS Selectors

CSS selectors are used inside `.css` files in order to target HTML elements and allows for CSS rules to be applied.

There are five basic CSS selectors:

- **Universal ( `*` )** - Targets all elements
- **Class (`.class`)** - Targets all with the given class
- **ID (`#id`)** -Targets all with the given ID
- **Type (`h1`)** - Targets all with the given type
- **Attribute (`[type="submit"]`)** Targets all with the given attribute

> 🤓 I recommend using the `.class` selector over the `#id` selector as ID attributes are unique 

You can group selectors under one CSS rule using commas to share properties among multiple selectors:

```css
.foo {
  color: red;
}

#bar {
  color: blue;
}

.foo, #bar {
  padding: 1rem;
}
```

You can also combine selectors using a variety of syntax to target anything from descendants to siblings:

```css
section h1 {
  color: red;
}

section > h2 {
  color: orange;
}

section + h3 {
  color: yellow;
}

section ~ h4 {
  color: green;
}
```

Selectors can also be used to target browser pseudo-elements:

```css
input::placeholder {
  color: #dddddd;
}
```

Using this variety of combinators and selectors you can easily style any part of a web document.

> ⚡ [Live Code Example: Selectors](https://codesandbox.io/s/selectors-fqw6x?file=/styles.css)

> 📚 [Learn More About Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

---

## Units & Value Types

In CSS there are seven absolute and eight relative length unit types. Here are the popular ones:

- **px** - Pixels, absolute length unit
- **em** - Relative to the parent size
- **rem** - Relative to the root element size
- **vw** - View-width, relative to the current device
- **vh** - View-height, relative to the current device

These CSS units are used to determine the size of a property value.

> 🤓 I recommend using the units `px` and `rem` units

CSS property values will only accept certain syntax and types. Let's use `color` for example:

```css
.foobar__keyword {
  color: red; /* Color will accept certain keywords */	
}

.foobar__hex {
  color: #ff0000; /* It will also take hexadecimal values */
}

.foobar__rgb {
  color: rgb(255, 0, 0); /* As well as functional notations */
}
```

> [📚 Learn More About CSS Types](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types)

> 📚 [Learn More About Units & Values](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)

---

## CSS Variables

CSS variables allow us to define arbitrary values for reuse across a stylesheet. For example:

```css
:root {
  --red: #ff0000;
}

.foo {
  background-color: var(--red);
}

.bar {
  color: var(--red);
}
```

It is common to use CSS variables for repeated values such as colors, font-size, padding, etc.

> ⚡ [Live Code Example: CSS Variables](https://codesandbox.io/s/css-variables-tx14z?file=/styles.css)
