---
{
    title: "Introduction to Components",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 1,
    series: "The Framework Field Guide"
}
---

> Before we can dive into how many front-end frameworks that you may have heard of work, we need to set a baseline of information. If you're already familiar with how the DOM represents a tree and how the browser takes that information and utilizes it, great! You're ready to read ahead! Otherwise, it's strongly suggested that you take a look at [our post introducing the concepts](https://unicorn-utterances.com/posts/understanding-the-dom/) required to understanding some of the baseline to this post

You may have heard about various frameworks and libraries that modern front-end developers utilize to build large-scale applications. Some of these frameworks you may have heard of are Angular, React, and Vue. While each of these libraries bring their own strengths and weaknesses, many of the core concepts are shared between them.

With this course, we're going to be outlining core concepts that are shared between them and how you can implement them in code in all three of the frameworks. This should provide a good reference when trying to learn one of these frameworks without a pre-requisite knowledge or even trying to learn another framework with some pre-requisite of a different one.

Let's first explain why frameworks like Angular, React, or Vue differ from other libraries that may have come before it, like jQuery.

It all comes down to a single core concept at the heart of each of them: **Componentization**.

# What's an app, anyway?

Before we dive into the technical aspects, let's think about what an app consists of at a high level.

Take the following application into consideration.

**// Add screenshot of google-drive-like app, with sidebar and contents**

Here, our app has many parts to it. A sidebar to contain navigation links, a list of files for a user to navigate, and a details pane about the file the user currently has selected.

What's more, each part of the app needs different things.

The sidebar may not require complex programming logic, but we may want to style it with nice colors and highlight effects when the user hovers. Likewise, the file list may contain complex logic to handle a user right clicking or dragging and dropping files.

When you break it down, each part of the app has three primary concerns:

- Logic - What the app does
- Styling - How the app looks visually
- Structure - How the app is laid out

While the mockup above does a good job at displaying things structurally, let's look at what the app looks like structurally:

**// Add screenshot of mockup turned into a skeleton with numbers in order of what the user should be interacting with**

Here, each section is laid out to showcase the order in which a user might typically walk through an app. While some sections may be more important than others, the structure of the page is meant more to represent a user's flow.

Now that we understand the structure, let's add some functionality. We'll include a small snippet of text to each section to outline what the goals are. In the future, we'd use these as "acceptance" criteria. This is what our logic will provide to the app.

**// Add screenshot of mockup turned into a skeleton with numbers in order of what the user should be interacting with**

Great! Now let's go back and add in the styling to recreate the mockup we had before!

**// Add back mockup screenshot**

For each step of the process, we can think of it like we're adding in a new programming language.

- HTML is used for adding in the strucuture of an application. The sidenav might be a `<nav>` tag, for example
- JavaScript adds in the logic of the application on top of the structure.
- CSS is utilized to make all of it look nice, and to potentially add some smaller UX improvements


The way I typically think about these 3 pieces of tech is:

HTML is like the building blueprints. It allows you to see the overarching pictures of what the end result will look like. They define the walls, doors, and flow of a home. 

JavaScript is like the electrical, plumbing, and appliances of the house. They allow you to interact with the building in a meaningful way.

CSS is like the paint and other decor that goes into a home. They're what makes the house feel lived in and inviting. They can't exist without the rest of the home, but rest assured without it it's a miserable experience.

# Parts of the app

Now that we've introduced the idea of what an app looks like, let's go back for a moment. Remember how I said each app is made of parts? Let's explode the app's mockup and take a look at that in more depth.

**// Add screenshot of mockup with each section in a 3d-ish "blown up" kinda view**

Here, we can more distinctly see how each part of the app has it's own structure, styling, and logic.

The files list, for example, contains the structure of each files being its own item, logic about what buttons do which actions, and some CSS to make it look engaging.

While the code for this section might look something like this:

```html
<section>
    <button id="addButton"><span class="icon">plus</span></button>
    <!-- ... -->
</section>
<ul>
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
    <!-- ... -->
<ul>
<script>
var addButton = document.querySelector("#addButton")
addButton.addEventListener('click', () => {
  // ...
})
</script>
```

We might have a mental model to break down each section into smaller ones. If we use psuedo-code to represent our mental model of the actual codebase, it might look something like this:

```html
<files-buttons>
	<add-button></add-button>
</files-buttons>
<files-list>
	<file name="File one"></file>
</files-list>
```

Luckily, by using frameworks, this mental model can be reflect in real code!

Let's look at what `<file>` might look like in each framework:

<!-- tabs:start -->

## React

```jsx
const File = () => {
  return <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
}
```

> Here, we're using a syntax very similar to HTML - but in JavaScript instead. This syntax is called ["JSX"](https://reactjs.org/docs/introducing-jsx.html) and powers the show for every React application.
> 
> While JSX looks closer to HTML than normal JS, it is not supported in the language itself. Instead, it requires a compiler (or transpiler) like [Babel](https://babeljs.io/) to compile down to normal JS. Under-the-hood this JSX compiles down to function calls.
> 
> For example, the above would be turned into:
>
> ```javascript
> var spanTag = React.createElement("span", null, "12/03/21");
> var aTag = React.createElement("a", {
>     href: "/file/file_one"
> }, "File one", spanTag);
> React.createElement("li", null, aTag);
> ```
>
> While the above seems intimidating, it's worth mentioning that you'll likely never need to fall back on using `createElement` in an actual production application. This is simply to demonstrate why you need Babel in React applications.
>
> You also likely do not need to setup Babel yourself from scratch. [Create React App](https://create-react-app.dev) - the tool React team recommends to manage your React apps - handles it out-of-the-box for you invisibly.

## Angular

```typescript
@Component({
  selector: 'file',
  template: `
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  `
})
export class FileComponent {
}
```

> Here, we're using the `@Component` decorator to define a class component in Angular. However, it's important to note that decorators (`@`) are not supported in JavaScript itself. Instead, Angular uses [TypeScript](https://unicorn-utterances.com/posts/introduction-to-typescript/) to add types and other features to the language. From there, TypeScript compiles down to JavaScript.
>
> Luckily for us, the Angular CLI handles all of that for us. You simply need to generate a new project to get started!

## Vue

```javascript
const File = { 
	template: `<li><a href="/file/file_one">File one<span>12/03/21</span></a></li>`
}
```

<!-- tabs:end -->

These are called "components". Components have multiple properties, which we'll touch on shortly. 

We can see that each framework has their own syntax to display these components. While each framework has its pros and cons, many of the fundamental concepts behind them are shared. 

While this is cool - it leads to a good question: how do you _use_ these components in HTML?

# Rendering the app

While these components might look like simple HTML, they're rather capable of further usage. Because of this, each framework actually uses JavaScript under-the-hood to draw these components on-screen.

This process of "drawing" is called "rendering".

Because modern web apps consist of multiple files (that are then often bundled with [Node](https://unicorn-utterances.com/posts/how-to-use-npm/#whats-node) and some CLI tool), all apps with React, Angular, and Vue start with an `index.html` file. 



<!-- tabs:start -->
## React

```html
<!-- index.html -->
<html>
	<body>
		<div id="root"></div>
	</body>
</html>
```


## Angular

```html
<!-- index.html -->
<html>
	<body>
		<!-- This should match the `selector` of the -->
    <!-- component you want here -->
		<file></file>
	</body>
</html>
```

## Vue

```html
<!-- index.html -->
<html>
	<body>
		<div id="root"></div>
	</body>
</html>
```

<!-- tabs:end -->



Then, in JavaScript, you "render" a component into this element.

<!-- tabs:start -->

## React


```jsx
import { createRoot } from 'react-dom';

const File = () => {
  return <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
}

createRoot(document.getElementById('root')).render(<File />);
```

## Angular

```typescript
@Component({
  selector: 'file',
  template: `
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  `
})
export class FileComponent {
}

@NgModule({
  imports: [BrowserModule],
  declarations: [FileComponent],
  bootstrap: [FileComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

> Angular has the concept of ["Modules"](https://angular.io/guide/architecture-modules) that allows you to opimize your application by keeping bundle size small. While it's an important part of Angular, don't worry too much about it for the moment.
>
> What _is_ important to note is that for each component, you need to register components within the `declarations` before usage

## Vue

```javascript
const File = { 
	template: `<li><a href="/file/file_one">File one<span>12/03/21</span></a></li>`
}

import { createApp } from 'vue';

createApp(File).mount("#root");
```

<!-- tabs:end -->









------

Components can have multiple elements

Components can have multiple methods

Components can have multiple classes

------

Components can be re-used

Components can be used for organized. Keeping files logic with files

Components can contain themselves

Components can accept inputs

Components can output*

Components make up tree relationship
