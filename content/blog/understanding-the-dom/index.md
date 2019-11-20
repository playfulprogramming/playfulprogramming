---
{
	title: 'Understanding The Dom: How Browsers Show Things on Screen',
	description: 'Learn how the browser internally handles HTML and CSS to show the user things on-screen',
	published: '2019-11-19T22:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['dom', 'browser internals'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Any web application relies on some fundamental technologies: HTML, CSS, and JavaScript. Even advanced front-end JavaScript frameworks such as Angular, React, or Vue will utilize some level of HTML to load the JavaScript. This understood, how the browser handes HTML and CSS under-the-hood can be quite the mystery. With this article, I'm going to explain what the browser does under-the-hood to understand what to show to the user.

# The DOM {#the-dom}

Just as the source code of JavaScript programs are broken down to abractions that are more easily understood by the computer, so too is HTML. HTML, initially being an extension to XML, actually _forms a tree structure in memory_ in order to know [how to lay things out and do various other tasks](#how-the-browser-uses-the-dom). This tree structure in memory is _called the Document Object Model_ (or _DOM_ for short).

For example, when you load a file similar to this:

```html
<!-- index.html -->
<!-- ids are only added for descriptive purposes -->
<main id="a">
	<ul id="b">
		<li id="c">Item 1</li>
		<li id="d">Item 2</li>
	</ul>
	<p id="e">Text here</p>
</main>
```

_The browser takes the items that've been defined in HTML and turns them into a tree that the browser can understand how to layout and draw on the screen_. That tree, internally, might look something like this:

![A chart showing the document object model layout of the above code. It shows that the 'main' tag is the parent to a 'ul' tag, and so on](./dom_tree.svg "Diagram showing the above code as a graph")

Let's see how this is done.

At the root of any HTML file, you have three things: Tags, attributes, and text content.

```html
<!-- A "header" tag -->
<header>
  <!-- An "a" tag with an "href" attribute -->
  <a href="example.com">
    <!-- A text node -->
    Example Site
  </a>
</header>
```

When you type a tag, like `header` or `a`, you're creating an _element node_. These nodes then compose to create _"leaves"_ on the DOM tree. Attributes are then able to manually add information to said nodes. When you have another element node inside of a seperate element node, you add a _"child"_ to said node. This relationship between the nodes allow you to preserve metadata between them, allows CSS to apply, and more.

![A chart showing a parent and child](./dom_tree_parent.svg)

There's also the idea of a _"sibling"_ node. When a node's parent has more than one child, those other nodes are that child node's _"siblings"_.

![A chart showing a parent and child](./dom_tree_sibling.svg)

Altogether, the terminologies used to refer between these node "leaves" are extremely similar to the terminology often used with family trees.

There are some rules to this tree that's created from these "nodes":

- There must be one "root" or "trunk" node, there cannot be more than one root
- There must be a one-to-many relationship with parents and children
	- A node may have many children
	- But may not have many parents
- A non-root node may have many siblings as a result of the parent having many children

!!!!!!! INSERT CHART SHOWING ALLOWED AND DISALLOWED PROPERTIES

### How It's Used By The Browser {#how-the-browser-uses-the-dom}

This tree tells the browser all of the information the browser needs to execute tasks in order to display and handle interaction with the user. For example, when the following CSS is applied to an `index.html` file:

```css
#b li {
	background: red;
}
```

It finds the element with the ID of `b`, then the children of that tag are colored red. They're "children" because the DOM tree keeps that relationship info that's defined by the HTML.

![A chart showing the 'ul' tag highlighted in green with the children 'li' tags marked in red](./dom_tree_with_css.svg "Diagram showing the above code as a graph")

> The `ul` element is marked as green just to showcase that it is the element being marked by the first part of the selector

This tree relationship also enables CSS selectors such as [general sibling selector (`~` )](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator) or the [adjacent sibling selector (`+`)](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator) to find siblings to a given selector

!!!!!!! INSERT CHART SHOWING SELECTORS

> Interestingly, one of the questions that I've often heard asked is a "parent selector". The idea behind this is that the [direct child selector (`>`)](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)  exists, why not have the ability to mark any parent of `.classname` selectors. 
>
> The answer behind that is: Performance. The [W3 organization](https://www.w3.org/Style/CSS/#specs) (the organization who maintains the HTML and CSS standard specification) points to the tree structure of the DOM and the algorithm behind how browsers traverse the DOM (or, "visit" the nodes in order to figure out what CSS to apply)  as not being performant when allowing parent selectors.
>
> The reason behind this is that browsers read from top-down in the DOM: They start at the root node, keep notes on what they've seen, then move to children. Then, they move to siblings, etc. They may have slight deviations on this algorithm, but for the most part they don't allow for upwards vertical movement of nodes within the DOM. 



# Using The Correct Tags {#accessibility}

HTML, as a specification, has tons of tags that are able to be used at one's disposal. These tags contain various metadata internally to the browser to provide information about what you want to render in the DOM. This metadata can then be handled by the browser how it sees fit; it may apply default CSS styling, it may change the default interaction the user has with it, or even what behavior that element has upon clicking on it (in the case of a button in a form). 

Some of these tag defaults are part of the specification while others are left up to the browser vendor to decide. This is why, in many instances, developers may choose to use something like `normalize.css` in order to set all of the element CSS defaults to an explicit set of defaults; Doing so can avoid having the UI of a webpage look different from browser-to-browser thanks to deviations on default CSS styling on specific tags.

This metadata is also why it's so important that your application utilizes the expected HTML tags and not simply default to `div`s with CSS applied to simulate other items. Two of the biggest advantages to responsibly utilizing the metadata system the browser has built into it by using the correct tags are SEO and accessability.

Take the following exampe:

```html
<div>
	<div>Bananas</div>
	<div>Apples</div>
	<div>Oranges</div>
</div>
```

In this example, your browser only knows that you're looking to display text on screen. If a user utilizing a screen reader reaches the site, the browser doesn't know that it should inform the user that there are three items in a list (something that sight-impaired users would greatly value to know, in order to tab through the list effectively) as you've done nothing to inform the user that it is a list of items: Only that it's a set of `div` generic containers. 

Likewise, when Google's robots walk through your site, they won't be able to parse that you're displaying lists to your users. As a result, your search rating for "list of best places" might be impacted, since the site doesn't appear to contain any list at all

What can be done to remediate this? Well, by utilizing the proper tags, of course!

```html
<ol>
	<li>Bananas</li>
	<li>Apples</li>
	<li>Oranges</li>
</ol>
```

In this example, both the browsers as well as Google's scraper bots are able to discern that this is a list with three list items within it.

We're able to even add further metadata to an element by using attributes. For example, let's say that I want to add a title to the list to be read upon a screen reader gaining focus on the element, we could use the `aria-label` attribute:

```html
<ol aria-label="My favorite fruits">
	<li>Bananas</li>
	<li>Apples</li>
	<li>Oranges</li>
</ol>
```

In fact, the default metadata that is defaulted by specific tags can be directly applied manually to an element of a different tag. The metadata that is passed to the browser when using `li` is typically involving that element pertaining to a listitem, using the `role` attribute, we can add that information to a `div` itself

```html
<ol>
	<div role="listitem">Bananas</div>
	<div role="listitem">Apples</div>
	<div role="listitem">Oranges</div>
</ol>
```

> It's worth mentioning that this example is generally considered malpractice. While you may have been able to preserve _some_ of the metadata from an `li` tag in a `div` element, it's extremely difficult to catch all of the defaults a browser might apply to the original tag that may enhanse a sight-impaired user's experience using screen-readers.
> 
> This is all to say: unless you have a **really** good reason for using `role` rather than an approprate tag, stick with the related tag. Just as any other form of engineering, properly employing HTML requires nuance and logic to be deployed at the hand of the implementing developer 

# Element Metadata {#interacting-with-elements-using-js}

If you've ever written a website that had back-and-forth communication between HTML and JavaScript, you're likely aware that you can access DOM elements from JavaScript: modifying, reading, and creating them to your heart's content.



Let's look at some of the built-in utilities at our disposal for doing so:

- [The `document` global object](document-global-object)
- [The `Element` base class](element-class)
- The event system



## Document Global Object {#document-global-object}

[As mentioned before, the DOM tree must contain one root node](#the-dom). This node, for any instance of the DOM, is the document entry point. When in the browser, this entry point is exposed to the developer with [the global object `document`](https://developer.mozilla.org/en-US/docs/Web/API/Document). This object has various methods and properties to assist in a meaningful way. For example, given a standard HTML5 document:

```html
<!DOCTYPE html>
<html>
<head>
	<title>This is a page title</title>
</head>
<body>
	<p id="mainText">
    This is the page body
		<span class="bolded">and it contains</span>
		a lot of various content within
    <span class="bolded">the DOM</span>
	</p>
</body>
</html>
```

The `document` object has the ability to get the `body` node ([`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)), the `head` node ([`document.head`](https://developer.mozilla.org/en-US/docs/Web/API/Document/head)), and even the doctype ([`document.doctype`](https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype)).

!!!!!!! INSERT CHROME IMAGE SHOWING THIS DOCUMENT AND THE THREE PROPERTIES MENTIONED

### Querying Elements

Additional to containing static references to some of the closest nodes to the root (`body` and `head`), there is also a way to query for any element by any of the CSS selectors. For example, if we wanted to get a reference to the single element with the `id` of `mainText`, we could use the CSS selector for an id, combined with [the `querySelector` method on the `document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector):

```javascript
const mainTextElement = document.querySelector('#mainText');
```

!!!!!!! INSERT CHROME IMAGE SHOWING THIS METHOD BEING RAN

This method will return a reference to the element as rendered in the DOM. [While we'll be covering more of what this reference is able to do later](#element-class), we can do a quick bit of code to show that it's the real element we intended to query:

```javascript
console.log(mainTextElement.innerHTML); // This will output the HTML that we used to write this element
```

!!!!!!! INSERT CHROME IMAGE SHOWING THIS METHOD BEING RAN

We also have the ability to gain a reference to many elements at once. GIven the same HTML document as before, let's say we want to see how many elements have the `bolded` class applied to it. We're able to do so using [the `document` `querySelectorAll` method](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll).

```javascript
const boldedElements = document.querySelectorAll('.bolded');
console.log(boldedElements.length); // Will output 2
console.log(boldedElements[0].innerHTML) // Will output the HTML for that element
```

!!!!!!! INSERT CHROME IMAGE SHOWING THIS METHOD BEING RAN


## Element Base Class {#element-class}



## Attributes

[As covered before in this post, elements are able to have _attributes_ that will apply metadata to an element for the browser to utilize.](#accessibility) However, what I may not have mentioned is that you're able to read, write, and modify that metadata using JavaScript



One way to save values to and from the 



While attributes can be of great use to store data about an element, there's a limitation: Values are always stored as strings. This means that objects, arrays, and other non-string primitives must find a way to go to and from strings when being read and written. By default, the primitive's `toString` will be called to store values.

```javascript
element.dataset.userInfo = {name: "Tony"}
console.log(element.dataset.userInfo) // "[object Object]"
/**
 * "[object Object]" is because it's running `Object.prototype.toString()` 
 * to convert the object to a string to store on the attribute
 */
```

> If you're having a difficult time understanding why `toString` is bring ran or what `prototype` is doing here, don't worry: You're in good company. The JavaScript prototype system is complex and can be difficult to follow.
>
> For now, it will suffice to just know that you're only able to store strings in element attribute






