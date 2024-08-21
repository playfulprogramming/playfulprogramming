---
{
  title: "Web Fundamentals: HTML",
  description: "The first chapter of this series offers an introductory dive into the box model, HTML defaults and semantic elements.",
  published: "2024-08-18T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["ljtech","edpratti"],
  order: 1
}

---

### Welcome to the first installment of Web Fundamentals!

> **What you should know:**
> This series only expects you to know what HTML and CSS are on a **very** basic level. If you need an introduction, check the article below.
>
>[📚 **Introduction to HTML, CSS and JavaScript**](https://unicorn-utterances.com/posts/intro-to-html-css-and-javascript)

This series will guide you through the fundamentals of CSS, HTML & JavaScript in one - or a few - steps at a time.

In our first chapter, we'll talk a little - well, *more than a little* - about HTML's box model and the elements that make up the web as you see today.

---

# The box model

HTML is the skeleton of a page. It defines the structure of how a page will be displayed, but doesn't have any "meat" to it. That being said, every piece of that skeleton follows one universal convention: **They all have a box model**. 

A box model is a representation of a document's element through a set of boxes. They are usually shown inside browser inspecting tools as follows:

![Four boxes, each containing one-another. The boxes, from largest to smallest are: "Margin", "Border", "Padding", and "Content"](./box-model.svg)

- [**`Margin 🡕`**](https://developer.mozilla.org/en-US/docs/Web/CSS/margin): Wraps any border, padding, and content as white space.
- [**`Border 🡕`**](https://developer.mozilla.org/en-US/docs/Web/CSS/border): Wraps any padding and content.
- [**`Padding 🡕`**](https://developer.mozilla.org/en-US/docs/Web/CSS/padding): Wraps any contents, again, as white space.
- **Content**: Contains text, imagery, videos, etc.

To better understand this, let's look at the following example; click on the button to switch modes and watch as the boxes translate into a real-world layout.

<iframe data-frame-title="HTML: Box model card" src="uu-code:./box-model?template=node&embed=1&file=src%2Findex.html"></iframe>

This structure is the foundation of HTML, and is used to build everything you see onscreen. In fact, some components are already built into the web for you to use.

Let's look at them now.

--- 

# Introduction to the `<div>`

A `<div>` is the purest form of a container. It has no default styling or special behavior of its own. It has no assignated function apart from being a simple, blank container. When inspecting any layout, you'll see that almost everything is enclosed within a `<div>`.

However, it's important to understand when to use them. While you can use a `<div>`, HTML has introduced several elements that provide the same function but are more accessible towards developers and users with screen readers by explicitly declaring their use. 

**This is what is commonly known as "semantic elements." Let's dive deeper.**

# Semantic elements & defaults

HTML has a lot of elements out-of-the-box, and every one of them has a place and a purpose. It is important to know about HTML defaults and so you can work with them and not against them when styling a document.

Some HTML elements are strictly used for grouping content and are generally referred to as containers, while other HTML elements are used for text, images and more.

These elements all have some browser styles called HTML defaults. These may change depending on the browsers rendering engine.

## Input elements

Here's an example of a group of **input** elements, which help users interact with a website.

<iframe data-frame-title="HTML: Input elements" src="uu-code:./input-elements?template=node&embed=1&file=src%2Findex.html"></iframe>

These elements contain controls, input fields, date pickers, and generally anything that can assist a user to perform an action or add data to a particular screen.

## Container elements

Now let's look at a small subject of semantic **container elements** that you have access to. Unlike the input elements, these **do not** have any visual representation, and are there to  tell both developers and screen-readers what each container does and their purpose.

```html
<body>
	<!-- There can only be one body. It contains all the document's content -->
</body>

<nav>
	<!-- Contains links for navigating to current or related documents -->
</nav>

<header>
	<!-- Headers represent the first child of a given container -->
</header>

<main>
	<!-- Contains the primary content inside a body container -->
</main>

<section>
	<!-- Contains a standalone piece of content -->
</section>

<aside>
	<!-- Represents anything indirectly related to the documents content -->
</aside>

<footer>
	<!-- Footers represent the last child of a given container -->
</footer>
```

## View all elements

This list is by no means comprehensive. HTML is a complex set of tools, and it's important to take some time to dive into its documentation to learn more about its widgets. You can access a list of all remaining elements below.

> **Learn more about HTML and its elements:**
> To view a full list of all HTML elements, click the link below. 
>
> 📚 [**HTML reference →**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

# HTML attributes

<img src="./html_attributes.svg" style="border-radius: var(--corner-radius_l);" alt="Three HTML elements with their corresponding attributes. It starts with an image, then a video, then a standard div."></img>

## Required attributes

## Optional attributes

# Styling HTML

Now that we've looked over some of the components HTML has, you may be wondering how you can take control of their aesthetics and make it your own.

For that, we're going to use **CSS**, short for *Cascading Style Sheets*. These tie with HTML elements to allow you to change their properties.

CSS is extremely powerful, which means it warrants its own article! We'll be looking at properties, values, variables, selectors and more!

#### Follow me to the next chapter below!