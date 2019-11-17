---
{
	title: 'Understanding The Dom: How Browsers Show Things on Screen',
	description: 'Learn how the browser internally handles HTML and CSS to show the user things on-screen',
	published: '2019-07-11T22:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['dom', 'browser internals'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Any web application relies on some fundamental technologies: HTML, CSS, and JavaScript. Even advanced front-end JavaScript frameworks such as Angular, React, or Vue will utilize some level of HTML to load the JavaScript. This understood, how the browser handes HTML and CSS under-the-hood can be quite the mystery. With this article, I'm going to explain what the browser does under-the-hood to understand what to show to the user.

# Introductions



# Using The Correct Tags {#accessability}

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

## Element Metadata {#interacting-with-elements-using-js}







So, when you build out an HTML file, you're defining the shape the document object model (DOM) takes. When you load a file similar to this:

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



This tree tells the browser where to place items and includes some logic when combined with CSS, even. For example, when the following CSS is applied to the `index.html` file:

```css
#b li {
	background: red;
}
```

It finds the element with the ID of `b`, then the children of that tag are colored red. They're "children" because the DOM tree keeps that relationship info that's defined by the HTML.

![A chart showing the 'ul' tag highlighted in green with the children 'li' tags marked in red](./dom_tree_with_css.svg "Diagram showing the above code as a graph")

> The `ul` element is marked as green just to showcase that it is the element being marked by the first part of the selector