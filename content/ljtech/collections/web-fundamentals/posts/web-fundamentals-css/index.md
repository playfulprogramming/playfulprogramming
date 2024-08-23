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

In the previous article, we discussed how HTML is the skeleton of the web. And that's a very apt description, as it provides the necessary structure to our layouts and our elements. Well, CSS is where we get to have control over all the properties that they provide, thus allowing us to build anything we'd like.

CSS defines the styling mechanisms used to theme components and build interfaces. It is a primordial tool in web development. Without further ado, let's dive into what it can do for you.

# Selectors

CSS selectors are used inside `.css` files in order to target HTML elements and allows for CSS rules to be applied.

There are five basic CSS selectors:

| Selector | Usage | Target | Usage example |
| --- | --- | --- | --- |
| **Universal** | `* {}` | All elements | Applying spacing or alpha values to all elements |
| **Class** |  `.example {}` | All with the given class | Applying the same styling to several elements |
| **ID** | `#example {}` | All with the given ID | Applying a style to a specific element |
| **Type** | `h1 {}` or `button {}` | All with the given type | Applying a style to a native HTML element |
| **Attribute** | `[type="submit"] {}` | All with the given attribute | Only applying a style to "Submit"-type buttons |

> 🤓 I recommend using the `.class` selector over the `#id` selector as ID attributes are unique 

## Grouping selectors

You can group selectors under one CSS rule using commas to share properties among multiple selectors:

```css
.foo {
  color: red;
}

#bar {
  color: blue;
}

// The padding will apply to both selectors
.foo, #bar {
  padding: 1rem;
}
```
## Nesting selectors

You can also combine selectors using a variety of syntax to target anything from descendants to siblings:

```css
/* This will target all <h1> that are descendants from
a <section> tag,regardless of how nested they are. */
section h1 {
  color: red;
}


/* This will target all <h2> tags that are
direct children from a <section> tag. Once they are
nested in another tag, it will no longer apply. */
section > h2 {
  color: orange;
}


/* This will only target the next <h3> tag 
that immediately follows a <section> tag. */
section + h3 {
  color: yellow;
}


/* This will target all <h4> tags that have 
the same parent as a <section> tag. */
section ~ h4 {
  color: green;
}
```

Selectors can also be used to target browser pseudo-elements:

```css
/* This targets the placeholder text
inside a standard HTML input field */
input::placeholder {
  color: #ddd;
}
```

Using this variety of combinators and selectors you can easily style any part of a web document.

> ⚡ [Live Code Example: Selectors](https://codesandbox.io/s/selectors-fqw6x?file=/styles.css)

> **Selectors are very extensive:**
> To learn more about what you can achieve with them, click on the link below.
>
> 📚 [**MDN: Selectors →**](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

---

# Unit & value types

CSS contains many units. **For the purposes of the web, however, you will commonly run into the following:**

## Absolute units

While CSS contains multiple absolute units, they are mostly for print. For the web, however, you will only find one:

| Unit | Behavior |
| --- | --- |
| `px` | Most common unit. It is a static value and does not resize on its own. |

> **A word of caution on absolute units:** The web is responsive. Websites and applications must adapt to several form factors and that's why `px` values should not be used in elements that need to resize based on the user's context, meaning their viewport, their zoom level or their font size.

## Relative units

Relative units dominate the web. These are the most common type of units, and for good reason; they allow us to design responsive, dynamic apps and websites. Let's look at them!

#### Parent-size units

| Unit | Behavior |
| --- | --- |
| `%` | Relative to the parent element. Setting an inner element's height to `50%` will make it 50% of the parent's height. |

#### Viewport units

| Unit | Behavior |
| --- | --- |
| `vw` | Relative to the viewport's width. Changing the window's width will cause the element's width to change. |
| `vh` | Relative to the viewport's height. Changing the window's height will cause the element's height to change. |

Now that we've looked at these two types of units, I think it's important to highlight their differences in a practical way. In the demo below, you can switch between them and see how they behave within the `iframe`.

<iframe data-frame-title="Percentage and viewport units" src="uu-code:./input-elements?template=node&embed=1&file=src%2Fstylesheet.css"></iframe>

#### Font-size units

| Unit | Behavior |
| --- | --- |
| `em` | Relative to the parent element's `font-size`. |
| `rem` | Relative to the `:root`'s `font-size`. |


---

## Values

CSS property values will only accept certain syntax and types. Let's use `color` for example:

```css
.foobar_keyword {
  color: red; /* Color will accept certain keywords */	
}

.foobar_hex {
  color: #ff0000; /* It will also take hexadecimal values */
}

.foobar_rgb {
  color: rgba(255, 0, 0, 1); /* As well as functional notations */
}

.foobar_integer {
  color: 12; /* This won't work, as it does not point to a color */
}
```

<TO-DO>ADD MORE EXAMPLES</TO-DO>

> **Learn more:**
> We're just going over the surface of what's available. To learn more, visit the links below.
>
> 📚 [**CSS types →**](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types)<br>
> 📚 [**Units and values →**](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)

---

# Variables

CSS variables allow us to define arbitrary, reusable values.

In the example below, we must only change the `--green` value to automatically propagate those changes to the `.foo` and `.bar` elements.

```css
:root {
  --green: #00ff00;
}

.foo {
  background-color: var(--green);
}

.bar {
  color: var(--green);
}
```

Using variables is a great way to improve the maintainability and consistency of your projects, as it allows you to update values from a single point as opposed to using raw values.

## Nesting

<TO-DO>FINISH THIS SECTION </TO-DO>

> ⚡ [Live Code Example: CSS Variables](https://codesandbox.io/s/css-variables-tx14z?file=/styles.css)
