---
{
  title: "Web Fundamentals: CSS - Inheritance & Hierarchy",
  description: "The third chapter of our series talks about the cascade hierarchy in CSS, including inheritance and specificity.",
  published: "2024-11-10T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["edpratti"],
  order: 3
}

---

CSS is a very robust system that must adhere to several different axis of customization. For this, it has many mechanisms that allow developers to reduce code and affect multiple elements at once using inheritance.

Learning about inheritance and the structure of CSS will help you develop more optimized stylesheets and avoid unwanted behaviors with your rules.

---

# Property inheritance

Not all properties in CSS are created equal, and it is particular as to which can be passed down to child elements.

## Inheritable properties

CSS does not natively inherit many properties, which allows us to list them all! Below is a table containing each property that is inheritable by default.

<details>
  <summary>Text & font properties</summary>

| Property           | Details                                                             |
|--------------------|---------------------------------------------------------------------|
| `color`            | The color of the text.                                              |
| `font-family`      | The font type used for the text.                                    |
| `font-size`        | The size of the text.                                               |
| `font-style`       | Whether the text is normal, italic, or oblique.                     |
| `font-variant`     | Controls small-caps styling.                                        |
| `font-weight`      | The boldness of the text.                                           |
| `font-stretch`     | Allows stretching or compressing of the font horizontally.          |
| `letter-spacing`   | Spacing between characters.                                         |
| `line-height`      | The height of the lines in text.                                    |
| `text-align`       | Horizontal alignment of text within its container.                  |
| `text-indent`      | Indentation of the first line of a block of text.                   |
| `text-transform`   | Controls capitalization (e.g., uppercase, lowercase).               |
| `text-shadow`      | Shadow effects applied to the text.                                 |
| `word-spacing`     | Spacing between words.                                              |
| `direction`        | Text direction (left-to-right or right-to-left).                    |
| `unicode-bidi`     | Controls the embedding level of bidirectional text.                 |

</details>

<details>
  <summary>Visibility & cursor properties</summary>

| Property            | Details                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------|
| `visibility`        | Whether the element is visible or hidden.                                               |
| `cursor`            | The type of cursor displayed when hovering over an element.                             |

</details>

<details>
  <summary>List style properties</summary>

| Property            | Details                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------|
| `list-style`        | Shorthand for setting `list-style-type`, `list-style-image`, and `list-style-position` for lists. |
| `list-style-type`   | The marker type for list items (e.g., bullets, numbers).                                |
| `list-style-image`  | The image used as a list marker.                                                        |
| `list-style-position`| Position of the list marker (inside or outside the list).                              |

</details>

## Non-inheritable properties

These include, of course, all other properties besides the ones we just looked at.

This makes sense, because each element should generally control its own box model and layout. For example, if a parent element has a `margin`, it wouldn't make sense for its child elements to automatically inherit that same margin, as that could cause layout issues.

---

## Forcing inheritance

You can force properties to be passed down to child elements by using the `inherit` value on any property.

```html
<body>
    <div>
        <p>Inheriting from body</p>.
    <div>
</body>
```

```css
body {
    padding: 24px;
}

div {
    padding: inherit;
    /* This will force the <div>, which is inside <body>,
    to inherit the padding from its parent. */
}
```

## Blocking inheritance

We can also block child elements from inheriting property values by overriding them with `initial`. **This sets the value of the property to its default value.**

---

## Removing overrides with `unset`

The unset keyword can be used to reset a property to its inherited value if it's inheritable, or to its initial value if it's not inheritable.

```css
body {
        color: blue;
    }

    p {
        color: red;
    }

    span {
        color: unset; 
        /* Unset reverts the color to what was
        being inherited from body, which is blue. */
}
```

```html
<body>
    <p>This is red, yet <span>this is blue</span></p>
</body>
```

---

# The CSS cascade

The CSS cascade is one of the most important aspects of how styles are applied to web pages. **It determines which rules are prioritized when there are multiple that apply to the same element.** 

To understand the cascade, there are four important concepts to keep in mind:

- **Sources:** Where the styles come from.
- **Specificity:** How specific the rule is when targetting an element.
- **Order:** The order in which the styles appear.
- **Importance:** Whether a rule has been marked as `!important`.

In this article, we'll be tackling each in detail, starting with sources.

---

## Sources

CSS can be applied in many ways, and they all have their own usecases. There are 

### User-agent stylesheets

User-agent stylesheets are the default styles provided by the browser. These can differ greatly, and depending on the underlying engine of the browser, can lead to a completely different look and feel.  This is why a lot of developers use things like [**NormalizeCSS**](https://github.com/necolas/normalize.css) to maintain a clean style across browsers.

### Author stylesheets

"Author" stylesheets refer the stylesheet used by websites. These are the stylesheets developers write in order to be used by the browser to display their custom styling.

> Author stylesheets take precedence over user-agent stylesheets, as they are applied on top of the default styling of the browser.

---

## Specificity

When multiple rules apply to the same element, the browser calculates specificity to determine which rule to apply. **The more specific the selector, the higher its priority.**

- **Element selectors:** Selectors that target HTML tags, such as `<p>`, `<div>`, `<aside>`, etc.
- **Class selectors:** Selectors for custom classes, i.e. `.myclass`.
- **ID selectors:** IDs are unique per element, meaning they have the highest priority when defining specificity.
- **Inline styles:** Styles applied directly onto the HTML element will take precedence over everything else.

Let's look at the following example; we will create a `<div>`, and apply a custom class - called `.myDiv`, and an `id` of `custom-div`.

```html
<div class="myDiv" id="custom-div">An example of a custom div</div>
```

```css
div {
    background-color: red;
}

#custom-div {
    background-color: blue;
}

.myDiv {
    background-color: green;
}
```

Knowing what we know, what color will our `div` be?

<details>
  <summary>View answer</summary>

  Following the hierarchy we just specified, our `<div>` **will be blue!**

  Despite coming first, the `#custom-div {}` rule, because it is based on the element's `id`, takes precedence over all the others!
</details>

### Inline styles

In terms of specificity, inline styles will have the highest priority, overriding the CSS inside the author stylesheet.

Let's look at the same example, but this time, we will also apply an inline style to our `<div>`.

```html
<div class="myDiv" id="custom-div" style="background-color: red;">An example of a custom div</div>
```

```css
div {
    background-color: purple;
}

.myDiv {
    background-color: green;
}

#custom-div {
    background-color: blue;
}
```

***In this case, because we have an inline style being applied in the HTML, our CSS is being entirely overriden.*** Therefore, our `<div>` is red!

---

## Order

When choosing between two rules **with the same level of specificity**, the browser will always prioritize the style that is applied last.

```css
.myDiv {
    background-color: red;
}

.myDiv {
    background-color: blue;
}

.myDiv {
    background-color: green;
    /* This is the last style,
    so our <div> will be green! */
}
```

---

## Importance

*This one's real easy.* The importance refers as to whether or not a property contains an `!important` appended at the end.

Essentially, `!important` tells the browser that the property which has it **must** be prioritized, above all else.

```css
.myDiv {
    background-color: blue !important;
    /* This contains the !important suffix,
    so it takes precedence over the rule that comes last. */
}

.myDiv {
    background-color: red;
}
```

The `!important` keyword will ignore - in almost every situation - the hierarchy of specificity, meaning that, even when applied to a level of specifity that is lower than an existing rule, it will still take precedence!

```css
.myDiv {
    background-color: blue !important;
    /* This contains the !important suffix,
    so it takes precedence over the #id rule that comes after it. */
}

#custom-div {
    background-color: red;
    /* If it weren't for the !important suffix,
    this style would override the previous one. */
}
```

When two identical `!important` rules exist, the order will decide which one gets applied.

```css
.myDiv {
    background-color: red !important;
}

.myDiv {
    background-color: blue !important;
    /* This is the last style,
    so our <div> will be blue! */
}
```

### Importance and specificity

There are applications of `!important` where specificity matters. This is when there are multiple `!important` suffixes applied to the same element, at different levels of specificity.

```css
.myDiv {
    background-color: green !important;
}

div {
    background-color: blue !important;
}

#custom-div {
    background-color: red;
}
```

Based on everything we learned, which color will our `<div>` be this time?

<details>
  <summary>View answer</summary>

  Following the hierarchy we just specified, our `<div>` **will be green!**

  - Despite having the most specifity, our `#custom-div` rule does not contain `!important`, so it is immediately disqualified.
  - Despite coming after the first rule, our `<div>` has the lowest level of specificity, so it loses priority to the `.myDiv` rule instead!
  - If we had an inline style with `!important` apprended to it, **that would have become the highest priority rule in our system.**
</details>

---

# What next?

Now that we're all caught up on CSS and its powerful mechanisms, it's time to put it to the test by building some things! In the next chapter, we'll be talking about Flexbox, a toolset that allows us to build responsive components on the web!