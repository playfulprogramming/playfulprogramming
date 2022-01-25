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

![A mockup of a file management application. Contains two sidebars on left and right and a file list](./fancy_mockup.jpg)

Here, our app has many parts to it. A sidebar to contain navigation links, a list of files for a user to navigate, and a details pane about the file the user currently has selected.

What's more, each part of the app needs different things.

The sidebar may not require complex programming logic, but we may want to style it with nice colors and highlight effects when the user hovers. Likewise, the file list may contain complex logic to handle a user right clicking or dragging and dropping files.

When you break it down, each part of the app has three primary concerns:

- Logic - What the app does
- Styling - How the app looks visually
- Structure - How the app is laid out

While the mockup above does a good job at displaying things structurally, let's look at what the app looks like structurally:

![The same mockup of the file list but with everything greyed out and showing just blocks](./after_html.png)

Here, each section is laid out without any additional styling. Simply a wireframe of what the page will look like with each section containing blocks that are laid out in fairly simple ways. This is what HTML will help us build.

Now that we understand the structure, let's add some functionality. We'll include a small snippet of text to each section to outline what the goals are. In the future, we'd use these as "acceptance" criteria. This is what our logic will provide to the app.

![The same wireframe mockup but with pointers to each section outlining what logic should be added to each section](after_js.png)

Great! Now let's go back and add in the styling to recreate the mockup we had before!

![The same mockup with styling as before](./fancy_mockup.jpg)

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

![A top-down 3d view of the stylized mockup](./broken_down.png)

Here, we can more distinctly see how each part of the app has it's own structure, styling, and logic.

The files list, for example, contains the structure of each files being its own item, logic about what buttons do which actions, and some CSS to make it look engaging.

While the code for this section might look something like this:

```html
<section>
  <button id="addButton"><span class="icon">plus</span></button>
  <!-- ... -->
</section>
<ul>
  <li>
    <a href="/file/file_one">File one<span>12/03/21</span></a>
  </li>
  <!-- ... -->
  <ul>
    <script>
      var addButton = document.querySelector("#addButton");
      addButton.addEventListener("click", () => {
        // ...
      });
    </script>
  </ul>
</ul>
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
  return (
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  );
};
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
>   href: "/file/file_one"
> }, "File one", spanTag);
> React.createElement("li", null, aTag);
> ```
>
> While the above seems intimidating, it's worth mentioning that you'll likely never need to fall back on using `createElement` in an actual production application. This is simply to demonstrate why you need Babel in React applications.
>
> You also likely do not need to setup Babel yourself from scratch. [Create React App](https://create-react-app.dev) - the tool React team recommends to manage your React apps - handles it out-of-the-box for you invisibly.

## Angular

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "file",
  template: `
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  `,
})
export class FileComponent {}
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

**This process of "drawing" is called "rendering".** A component may render at various times, in particular when it needs to update data shown on-screen, which we'll touch on later.

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


```jsx {0,6}
import { createRoot } from 'react-dom';

const File = () => {
  return <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
}

createRoot(document.getElementById('root')).render(<File />);
```

## Angular

```typescript {2,20}
import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

@Component({
  selector: "file",
  template: `
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  `,
})
export class FileComponent {}

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

```javascript {4,6}
const File = { 
  template: `<li><a href="/file/file_one">File one<span>12/03/21</span></a></li>`
}

import { createApp } from 'vue';

createApp(File).mount("#root");
```

<!-- tabs:end -->

Once a component is rendered, you're able to do a lot more with it!

For example, just like [nodes in the DOM]() have relationships, so too can components.

# Children, siblings, and more oh my!

While our `File` component currently contains HTML elements, components may also contain other components!

<!-- tabs:start -->

## React

```jsx {6-11}
const File = () => {
  return (
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  );
};

const FileList = () => {
  return (
    <ul><File /></ul>
  );
};
```

## Angular

```typescript {7-14}
@Component({
  selector: "file",
  template: `
    <li><a href="/file/file_one">File one<span>12/03/21</span></a></li>
  `,
})
export class FileComponent {}

@Component({
  selector: "file-list",
  template: `
    <ul><file></file></ul>
  `,
})
export class FileListComponent {}
```

## Vue

```javascript {4-13}
const File = {
  template: `<li><a href="/file/file_one">File one<span>12/03/21</span></a></li>`,
};

const FileList = {
  template: `
    <ul>
      <file></file>
    </ul>
  `,
  components: {
    File,
  },
};
```

We need to make sure to register all of the components we'll be using in our component! Otherwise, Vue will throw an error:

> Failed to resolve component: file

<!-- tabs:end -->



Looking through our `File` component, we can also notice that we're rendering multiple elements inside of a single component. Funnily enough, this has the fun side effect that we can also render multiple components inside of a parent component.

<!-- tabs:start -->

## React

```jsx
const FileList = () => {
  return (
    <ul>
      <File />
      <File />
      <File />
    </ul>
  );
};
```

## Angular

```typescript
@Component({
  selector: "file-list",
  template: `
    <ul>
      <file></file>
      <file></file>
      <file></file>
    </ul>
  `,
})
export class FileListComponent {}
```

## Vue

```javascript
const FileList = {
  template: `
    <ul>
      <file></file>
      <file></file>
      <file></file>
    </ul>
  `,
  components: {
    File,
  },
};
```

<!-- tabs:end -->

This is a particularly useful feature of components. It allows you to reuse aspects of your structure (and styling + logic, but I'm getting ahead of myself) without having to repeat yourself. It allows for a very DRY architecture where your code is declared once and reused elswhere.

> That stands for "Don't repeat yourself" and is often heralded as a gold standard of code quality!

It's worth remembering that we're using the term "parent" to refer to our `FileList` component in relation to our `File` component. This is because, like the DOM tree, each framework's set of components reflect a tree.

**// Add in DOM tree representation of `File` and `FileList`**

This means that the related `File` components are "siblings" of one-another, each with a "parent" of `FileList`.

We can extend this hierarchical relationship to have "grandchildren" and beyond as well:

<!-- tabs:start -->

## React

```jsx {0-2,4-6,11}
const FileDate = () => {
  return <span>12/03/21</span>;
};

const File = () => {
  return <li><a href="/file/file_one">File one<FileDate/></a></li>;
};

const FileList = () => {
  return (
    <ul>
      <File />
      <File />
      <File />
    </ul>
  );
};
```

## Angular

```typescript {2-6,9-12,22}
import { Component } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span>12/03/21</span>`,
})
export class FileDateComponent {}

@Component({
  selector: "file",
  template: `
    <li>
      <a href="/file/file_one">File one<file-date></file-date></a>
    </li>
  `,
})
export class FileComponent {}

@Component({
  selector: "file-list",
  template: `
    <ul>
      <file></file>
      <file></file>
      <file></file>
    </ul>
  `,
})
export class FileListComponent {}
```

## Vue

```javascript {0-2,4-5,14}
const FileDate = {
  template: `<span>12/03/21</span>`,
};

const File = {
  template: `<li><a href="/file/file_one">File one<file-date></file-date></a></li>`,
  components: {
    FileDate,
  },
};

const FileList = {
  template: `
    <ul>
      <file></file>
      <file></file>
      <file></file>
    </ul>
  `,
  components: {
    File,
  },
};
```

<!-- tabs:end -->

# Logic

HTML isn't the only thing components are able to store, however! Like we mentioned earlier, apps (and by extension, each part of the respective apps) require three parts:

- Structure (HTML)
- Styling (CSS)
- Logic (JS)

Components can handle all three!

While we'll touch on styling more in the future, let's take a look at how we can declare logic in a component by making `file-date` show the current date instead of a static date.

We'll start by adding in a simple function to display the current date in a human readable form.



<!-- tabs:start -->

## React

```jsx {4}
import {useState} from 'react';

const FileDate = () => {
  // Don't worry what "setDateStr" is yet. We'll touch on it soon
  const [dateStr, setDateStr] = useState(`${(new Date()).getMonth() + 1}/${(new Date()).getDate()}/${(new Date()).getFullYear()}`);
  return <span>12/03/21</span>
}
```

> `useState` is what React uses to store data that is set by the user. It's first argument (that we're passing a string into) is used to set the initial value.
>
> We're then using [array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to convert the returned array into two variables. Another way to write this code is:
>
> ```jsx
> const dateArr = useState(`${(new Date()).getMonth() + 1}/${(new Date()).getDate()}/${(new Date()).getFullYear()}`);
> const dateStr = dateArr[0];
> const setDateStr = dateArr[1];
> ```

## Angular

```typescript {6}
@Component({
  selector: 'file-date',
  template: `<span>12/03/21</span>`
})
export class FileDateComponent {
  dateStr = `${(new Date()).getMonth() + 1}/${(new Date()).getDate()}/${(new Date()).getFullYear()}`;
}
```

## Vue

```javascript {2-6}
const FileDate = { 
  template: `<span>12/03/21</span>`,
  data() {
    return {
      dateStr: `${(new Date()).getMonth() + 1}/${(new Date()).getDate()}/${(new Date()).getFullYear()}`
    }
  }
}
```

<!-- tabs:end -->

While this logic works, it's a bit verbose (and slow, due to recreating the `Date` object thrice) - let's break it out into a method, contained within the component.

```javascript
function formatDate() {
  const today = new Date();
  // Month starts at 0, annoyingly
  const monthNum = today.getMonth() + 1;
  const dateNum = today.getDate();
  const yearNum = today.getFullYear();
  return monthNum + "/" + dateNum + "/" + yearNum;
}
```

<!-- tabs:start -->

## React

```jsx {0-7, 10}
function formatDate() {
  const today = new Date();
  // Month starts at 0, annoyingly
  const monthNum = today.getMonth() + 1;
  const dateNum = today.getDate();
  const yearNum = today.getFullYear();
  return monthNum + "/" + dateNum + "/" + yearNum;
}

const FileDate = () => {
  const dateStr = formatDate();
  return <span>12/03/21</span>;
};
```

> Because React can easily access functions outside of the component declaration, we decided to move it outside of the component scope. This allows us to avoid redeclaring this function in every render, which the other frameworks don't do thanks to different philosophies.

## Angular

```typescript {5-14}
@Component({
  selector: "file-date",
  template: `<span>12/03/21</span>`,
})
export class FileDateComponent {
  dateStr = this.formatDate();

  formatDate() {
    const today = new Date();
    // Month starts at 0, annoyingly
    const monthNum = today.getMonth() + 1;
    const dateNum = today.getDate();
    const yearNum = today.getFullYear();
    return monthNum + "/" + dateNum + "/" + yearNum;
  }
}
```

## Vue

```javascript {2-16}
const FileDate = {
  template: `<span>12/03/21</span>`,
  data() {
    return {
      dateStr: this.formatDate(),
    };
  },
  methods: {
    formatDate() {
      const today = new Date();
      // Month starts at 0, annoyingly
      const monthNum = today.getMonth() + 1;
      const dateNum = today.getDate();
      const yearNum = today.getFullYear();
      return monthNum + "/" + dateNum + "/" + yearNum;
    },
  },
};
```

> This syntax might look a bit off. After all, why are we using `this` when it's not a class we're calling within.
>
> Luckily for us, Vue expects us to declare our methods and data in this way. As a result, it'll automatically bind `this` for us.

<!-- tabs:end -->




# Intro to Lifecycles

While you can rest assured this code works, since I'm the author and I'd probably be a bit embarrassed by it not running...

> Way to temp fate there, author

... It's important to realize that not all of our code will functions will work as intended first try. Moreover: What on earth is that function even outputting - we don't currently have a way to evaluate the output?

Let's fix that by telling our components that "once you're rendered on screen, `console.log` the value of that data".

<!-- tabs:start -->

### React

```jsx {0,14-16}
import {useEffect} from 'react';

function formatDate() {
  const today = new Date();
  // Month starts at 0, annoyingly
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const year = today.getFullYear();
  return month + "/" + date + "/" + year;
}

const FileDate = () => {  
  const [dateStr, setDateStr] = formatDate();

  useEffect(() => {
    console.log(dateStr)
  }, []);
 
  return <span>12/03/21</span>
}
```

> React is a bit different from the rest of the group when it comes to lifecycles. Take a look at the other examples. Instead of an explicit "when this is rendered", we have a mention of a "side effect". We'll touch on why that is in a moment.

### Angular

```typescript {0,6,9-11}
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span>{{ dateStr }}</span>`,
})
export class FileDateComponent implements OnInit {
  dateStr = this.formatDate();

  ngOnInit() {
    console.log(dateStr);
  }

  formatDate() {
    const today = new Date();
    // Month starts at 0, annoyingly
    const monthNum = today.getMonth() + 1;
    const dateNum = today.getDate();
    const yearNum = today.getFullYear();
    return monthNum + "/" + dateNum + "/" + yearNum;
  }
}
```

### Vue

```javascript {7-9}
const FileDate = {
  template: `<span>{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(),
    };
  },
  mounted() {
    console.log(this.dateStr);
  },
  methods: {
    formatDate() {
      const today = new Date();
      // Month starts at 0, annoyingly
      const monthNum = today.getMonth() + 1;
      const dateNum = today.getDate();
      const yearNum = today.getFullYear();
      return monthNum + '/' + dateNum + '/' + yearNum;
    },
  },
};
```

<!-- tabs:end -->

Here, we're telling each respective framework to simply log the value of `dateStr` to the console once the component is rendered for the first time.

> Wait, "for the first time"?

Yup! React, Angular, and Vue all are capable of updating (or, re-rendering) when they need to.

For example, let's say you want to show `dateStr` to a user, but then later in the day the time switches over. While you'd have to handle the code to keep track of the time, **the respective framework would notice that you've modified the values of `dateStr` and re-render the component to display the new value**.

While the method each framework uses to tell _when_ to re-render is different, they all have a highly stable method of doing so.

This feature is arguably the biggest advantage of building an application with one of these frameworks.

**This idea of having a bit of code run at a specific time relative to a component is called a compoent's "Lifecycle"**. Each part of a component's lifecycle has some kind of method behind it. There are many more types of lifecycle methods, including one that updates any time a value on-screen is changed, but we'll dive deeper into them at another time.

Speaking of updating data on screen - let's take a look at how we can dynamically display data on a page.



# Display

While displaying the value in the console works well for debugging, it's not of much help to the user. After all, more than likely your users won't know what a console even is. Let's show `dateStr` on-screen


<!-- tabs:start -->

### React

```jsx {14}
import {useEffect, useState} from 'react';

function formatDate() {
  const today = new Date();
  // Month starts at 0, annoyingly
  const monthNum = today.getMonth() + 1;
  const dateNum = today.getDate();
  const yearNum = today.getFullYear();
  return monthNum + "/" + dateNum + "/" + yearNum;
}

const FileDate = () => {  
  const [dateStr, setDateStr] = useState(formatDate());
  
  return <span>{dateStr}</span>
}
```

### Angular

```typescript {4}
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span>{{ dateStr }}</span>`,
})
export class FileDateComponent {
  dateStr = this.formatDate();

  formatDate() {
    const today = new Date();
    // Month starts at 0, annoyingly
    const monthNum = today.getMonth() + 1;
    const dateNum = today.getDate();
    const yearNum = today.getFullYear();
    return monthNum + "/" + dateNum + "/" + yearNum;
  }
}
```

### Vue

```javascript {1}
const FileDate = {
  template: `<span>{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(),
    };
  },
  methods: {
    formatDate() {
      const today = new Date();
      // Month starts at 0, annoyingly
      const monthNum = today.getMonth() + 1;
      const dateNum = today.getDate();
      const yearNum = today.getFullYear();
      return monthNum + '/' + dateNum + '/' + yearNum;
    },
  },
};
```

<!-- tabs:end -->


Here, we're using each framework's method of injecting state into a component. For React, we'll use the `{}` syntax to interpolate JavaScript into the template, while Vue and Angular both rely on `{{}}` syntax.

## Live Updating

But what happens if we update `dateStr` after the fact? Say we have a `setTimeout` call that updates the date to tomorrow's date after 5 minutes.

<!-- tabs:start -->

### React

```jsx {13-20}
import { useState, useEffect } from "react";

function formatDate(inputDate) {
  // Month starts at 0, annoyingly
  const month = inputDate.getMonth() + 1;
  const date = inputDate.getDate();
  const year = inputDate.getFullYear();
  return month + "/" + date + "/" + year;
}

const FileDate = () => {
  const [dateStr, setDateStr] = useState(formatDate(new Date()));

  useEffect(() => {
    setTimeout(() => {
      // 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const tomorrowDate = this.formatDate(tomorrow);
      setDateStr(tomorrowDate);
    }, 5000);
  }, []);

  return <span>{dateStr}</span>;
};
```

> Remember how we said we'd touch on `setDateStr`?
>
> Here, we're using `setDateStr` to tell React that it should re-render, which will update the value of `dateStr`. This differs from Angular and Vue where you don't have to tell the framework when to re-render.
>
> There are benifits and downsides to this method, which we'll touch on in a future section.

### Angular

```typescript {9-15}
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span>{{ dateStr }}</span>`,
})
export class FileDateComponent implements OnInit {
  dateStr = this.formatDate(new Date());

  ngOnInit() {
    setTimeout(() => {
      // 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      this.date = this.formatDate(tomorrow);
    }, 5000);
  }

  formatDate(inputDate) {
    // Month starts at 0, annoyingly
    const monthNum = inputDate.getMonth() + 1;
    const dateNum = inputDate.getDate();
    const yearNum = inputDate.getFullYear();
    return monthNum + "/" + dateNum + "/" + yearNum;
  }
}
```

### Vue

```javascript {7-13}
const FileDate = {
  template: `<span>{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(new Date()),
    };
  },
  mounted() {
    setTimeout(() => {
      // 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      this.date = this.formatDate(tomorrow);
    }, 5000);
  },
  methods: {
    formatDate(inputDate) {
      // Month starts at 0, annoyingly
      const monthNum = inputDate.getMonth() + 1;
      const dateNum = inputDate.getDate();
      const yearNum = inputDate.getFullYear();
      return monthNum + "/" + dateNum + "/" + yearNum;
    },
  },
};
```

<!-- tabs:end -->

If you sit on these screens for a while, you'll see that they update automatically!

While the frameworks detect changes under-the-hood differently, they all handle updating the DOM for you. This allows you to focus on the logic that's intended to update what's on screen as opposed to the code that updates the DOM itself. 

This is important because in order to update the DOM in an efficient way requires significant hevy-lifting. In fact, many of these frameworks store an entire copy of the DOM in-memory in order to keep that updating as lightweight as possible. We'll explain in the future exactly how this works.



# Attribute Binding

Text isn't the only thing that frameworks are capable of live-updating, however!

Just like each framework has a way to have state rendered into text on-screen, it can also update HTML attributes for an element. 

Currently, our `date` component doesn't read out [particularly kindly to screen-readers](https://unicorn-utterances.com/posts/intro-to-web-accessability), since it would only read out as numbers. Let's change that by adding in an `aria-label`of a human readable date to our `date` component.

<!-- tabs:start -->

### React

```jsx {5}
const FileDate = () => {  
  const [dateStr, setDateStr] = useState(formatDate(new Date()));

  // ...
  
  return <span ariaLabel="January 10th, 2023">{dateStr}</span>
}
```

> You may notice that the attribute is [`ariaLabel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaLabel) in React but `aria-label` in every other framework. This is because React uses the JavaScript names for attributes, similar to the properties you'd set on an [`Element` ](https://developer.mozilla.org/en-US/docs/Web/API/Element) that you'd get from a query like [`document.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).
>
> This also means that instead of `class`, you set [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className), to the confusion of many an early React developer.

### Angular

```typescript {5}
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'file-date',
  template: `
    <span aria-label="January 10th, 2023">{{dateStr}}</span>
  `
})
export class FileDateComponent implements OnInit {
	dateStr = this.formatDate(new Date());

  // ...
}
```

### Vue

```javascript {1}
const FileDate = {
  template: `<span aria-label="January 10th, 2023">{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(new Date()),
    };
  },
  // ...
};
```

<!-- tabs:end -->


Now, when we use a screen reader it'll read out "January 10th" instead of "One dash ten".

However, while this may have worked before `date` was dyanamically formatted, it won't be correct for most of the year. (Luckily for us, a broken clock is correct at least once a day)

Let's correct that by adding in a `formatReadableDate` method and reflect that in the attribute:

<!-- tabs:start -->

### React

```jsx {12,16}
import {useState, useEffect} from 'react';

function formatReadableDate(inputDate) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthStr = months[inputDate.getMonth()];
  const dateSuffixStr = this.dateSuffix(inputDate.getDate());
  const yearNum = inputDate.getFullYear();
  return monthStr + " " + dateSuffixStr + "," + yearNum;
}

const FileDate = () => {  
  const [dateStr, setDateStr] = useState(formatDate(new Date()));
  const [labelText, setLabelText] = useState(formatReadableDate(new Date()));
  
  // ...
  
  return <span ariaLabel={labelText}>{dateStr}</span>
}

function dateSuffix(dayNumber) {
  const lastDigit = dayNumber % 10;
  if (lastDigit == 1 && dayNumber != 11) {
    return dayNumber + "st";
  }
  if (lastDigit == 2 && dayNumber != 12) {
    return dayNumber + "nd";
  }
  if (lastDigit == 3 && dayNumber != 13) {
    return dayNumber + "rd";
  }
  return dayNumber + "th";
}
```

> Notice the `{}` used after the `=` to assign the attribute value. This is pretty similar to the syntax to interpolate text into the DOM!

### Angular

```typescript {5,10}
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'file-date',
  template: `
    <span [attr.aria-label]="labelText">{{dateStr}}</span>
  `
})
export class FileDateComponent implements OnInit {
	dateStr = this.formatDate(new Date());
	labelText = this.formatReadableDate(new Date());

  // ...
    
  dateSuffix(dayNumber) {
    const lastDigit = dayNumber % 10;
    if (lastDigit == 1 && dayNumber != 11) {
      return dayNumber + "st";
    }
    if (lastDigit == 2 && dayNumber != 12) {
      return dayNumber + "nd";
    }
    if (lastDigit == 3 && dayNumber != 13) {
      return dayNumber + "rd";
    }
    return dayNumber + "th";
  },
  formatReadableDate(inputDate) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthStr = months[inputDate.getMonth()];
    const dateSuffixStr = this.dateSuffix(inputDate.getDate());
    const yearNum = inputDate.getFullYear();
    return monthStr + " " + dateSuffixStr + "," + yearNum;
  }
}
```

> Unlike the `{{}}` that you'd use to bind text to the DOM, you use `[]` to bind attributes in Angular.
>
> `attr` stands for `attribute`. We'll see the other usage for the `[]` momentarily.

### Vue

```javascript {1,5}
const FileDate = {
  template: `<span v-bind:aria-label="labelText">{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(new Date()),
      labelText: this.formatReadableDate(new Date())
    };
  },

  methods: {
    dateSuffix(dayNumber) {
   	 const lastDigit = dayNumber % 10;
   	 if (lastDigit == 1 && dayNumber != 11) {
    	    return dayNumber + "st";
  	  }
	    if (lastDigit == 2 && dayNumber != 12) {
    	    return dayNumber + "nd";
  	  }
	    if (lastDigit == 3 && dayNumber != 13) {
     	   return dayNumber + "rd";
    	}
    	return dayNumber + "th";
		},
    formatReadableDate(inputDate) {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthStr = months[inputDate.getMonth()];
      const dateSuffixStr = this.dateSuffix(inputDate.getDate());
      const yearNum = inputDate.getFullYear();
      return monthStr + " " + dateSuffixStr + "," + yearNum;
    }
    // ...
  },
};
```

> In Vue, `v-bind` has a shorter syntax that does the same thing. If you axe the `v-bind` and leave the `:`, it works the same way.
>
> This means that:
>
> ```html
> <span v-bind:aria-label="labelText">{{dateStr}}</span>
> ```
>
> And:
>
> ```html
> <span :aria-label="labelText">{{dateStr}}</span>
> ```
>
> Both work to bind to an attribute in HTML.

<!-- tabs:end -->

> This code isn't exactly what you might expect to see in production. If you're looking to write production code, you may want to look into [derived values](TODO: ADD ME) to base the `labelText` and `date` values off of the same [`Date` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) directly. This would let you avoid calling `new Date` twice, but I'm getting ahead of myself - we'll touch on derived values that in a future section.

Awesome! Now it should read the file's date properly to a screen reader properly!

# Inputs

Our file list is starting to look good! That said, a file list containing the same file repeatedly isn't much of a file list. Ideally, we'd like to pass in the name of the file into our `File` component to add a bit of variance.

Luckily for us, components accept arguments just like functions! These arguments are most often called "inputs" or "props" in the component world.

Let's have the file name be an input to our `File` component: 

<!-- tabs:start -->

## React

```jsx {0-2,7}
const File = (props) => {
  return <li><a href="/file/file_one">{props.fileName}<FileDate/></a></li>;
};

const FileList = () => {
  return (
    <ul>
      <File fileName={"File one"} />
      <File fileName={"File two"} />
      <File fileName={"File three"} />
    </ul>
  );
};
```

> `props` is short for "properties". React uses an object to contain all properties that we want to pass to a component. We can use [parameter destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to get the properties without having to use `props` before the name of the parameter we really want, like so:
>
> ```jsx
> const File = ({ fileName }) => {
>   return <li><a href="/file/file_one">{fileName}<FileDate/></a></li>;
> }
> ```
>
> Since this is extremely common in production React applications, we'll be using this style going forward.
>
> Similarly, while `{}` is required to bind a variable to an input or attribute in React, since we're only passing a string here, we could alterantively write:
>
>  ```jsx
>  <File fileName="File one"/>
>  ```

## Angular

```typescript {7,14}
@Component({
  selector: "file",
  template: `
    <li><a href="/file/file_one">{{ fileName }}<file-date></file-date></a></li>
  `,
})
export class FileComponent {
  @Input() fileName: string;
}

@Component({
  selector: "file-list",
  template: `
    <ul>
      <file [fileName]="File one"></file>
      <file [fileName]="File two"></file>
      <file [fileName]="File three"></file>
    </ul>
  `,
})
export class FileListComponent {}
```

> See? Told you we'd cover what `[]` would be used for. It's the same binding syntax as with attributes!
>
> We're also using the `@Input` dectorator to declare inputs for each component input.

## Vue

```javascript {5,11}
const File = {
  template: `<li><a href="/file/file_one">{{fileName}}<file-date></file-date></a></li>`,
  components: {
    FileDate,
  },
  props: ["fileName"],
};

const FileList = {
  template: `
    <ul>
      <file :fileName="File one"></file>
      <file :fileName="File two"></file>
      <file :fileName="File three"></file>
    </ul>
  `,
  components: {
    File,
  },
};
```

> Here, we need to declare each property using the `props` property on our component, otherwise the input value won't be available to the rest of the component.
>
> Also, when we talked about atttribute binding, we mentioned `:` is shorthand for `v-bind:`. The same applies here too. You could alternatively write:
>
> ```html
> <file v-bind:fileName="File three"></file>
> ```

<!-- tabs:end -->

Here, we can see each `File` being rendered with their own names. 

One way of thinking about passing properties to a component is that we're "pass down" data to our children components. Remember, these components make a parent/child relationship to one-another.

It's exciting what progress we're making! But oh no - the links are still static! Each file has the same `href` property as the last. Let's fix that!

## Multiple Properties

Like functions, components can accept as many properties as you'd like to pass. Let's add another for `href`:

<!-- tabs:start -->

### React

```jsx {0-2,7}
const File = ({ fileName, href }) => {
  return <li><a href={href}>{fileName}<FileDate/></a></li>;
};

const FileList = () => {
  return (
    <ul>
      <File fileName="File one" href="/file/file_one" />
      <File fileName="File two" href="/file/file_two" />
      <File fileName="File three" href="/file/file_three" />
    </ul>
  );
};
```


### Angular

```typescript {7-8,15}
@Component({
  selector: "file",
  template: `
    <li><a [attr.href]="href">{{ fileName }}<file-date></file-date></a></li>
  `,
})
export class FileComponent {
  @Input() fileName: string;
  @Input() href: string;
}

@Component({
  selector: "file-list",
  template: `
    <ul>
      <file fileName="File one" href="/file/file_one"></file>
      <file fileName="File two" href="/file/file_two"></file>
      <file fileName="File three" href="/file/file_three"></file>
    </ul>
  `,
})
export class FileListComponent {}
```

### Vue

```javascript {5,11}
const File = {
  template: `<li><a :href="href">{{fileName}}<file-date></file-date></a></li>`,
  components: {
    FileDate,
  },
  props: ["fileName", "href"],
};

const FileList = {
  template: `
      <ul>
        <file fileName="File one" href="/file/file_one"></file>
        <file fileName="File two" href="/file/file_two"></file>
        <file fileName="File three" href="/file/file_three"></file>
      </ul>
    `,
  components: {
    File,
  },
};
```

<!-- tabs:end -->

## Object Passing

While we've been using strings to pass values to a component as an input, this isn't always the case.

Input properties can be of any JavaScript type. This can include objects, strings, numbers, arrays, class instances, or anything in between!

To showcase this, let's add in the ability to pass a `Date` class instance to our `file-date` component. After all, each file in our files list will likely be created at different times.

<!-- tabs:start -->

### React

```jsx {0-2,14}
const FileDate = ({ inputDate }) => {
  const [dateStr, setDateStr] = useState(formatDate(inputDate));
  const [labelText, setLabelText] = useState(formatReadableDate(inputDate));

  // ...

  return <span ariaLabel={labelText}>{dateStr}</span>;
};

const File = ({ href, fileName }) => {
  return (
    <li>
      <a href={href}>
        {fileName}
        <FileDate inputDate={new Date()} />
      </a>
    </li>
  );
};
```

### Angular

```typescript {7,21,27}
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
export class FileDateComponent implements OnInit {
  @Input() inputDate: Date;

  dateStr = this.formatDate(this.inputDate);
  labelText = this.formatReadableDate(this.inputDate);

  // ...
}

@Component({
  selector: "file",
  template: `
    <li>
      <a [attr.href]="href">
        {{ fileName }}
        <file-date [inputDate]="inputDate"></file-date>
      </a>
    </li>
  `,
})
export class FileComponent {
  inputDate = new Date();

  // ...
}
```

### Vue

```javascript {4-5,8,17,26}
const FileDate = {
  template: `<span :aria-label="labelText">{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(this.inputDate),
      labelText: this.formatReadableDate(this.inputDate)
    };
  },
  props: ['inputDate']
  // ...
};

const File = { 
  template: `
    <li>
      <a :href="href">
        {{fileName}}
        <file-date :inputDate="inputDate"></file-date>
      </a>
    </li>
  `,
  components: {
      FileDate
  },
  date() {
    return {
      inputDate: new Date()
    }
  }
  props: ['fileName', 'href']
}
```

<!-- tabs:end -->

> Once again, I have to add a minor asterisk next to this code sample. Right now, if you update the `inputDate` value after the initial render, it will not show the new date string in `file-date`. This is because we're setting the value of `dateStr` and `labelText` only once and not updating the values. 
>
> Each framework has a way of live-updating this value for us as we might usually expect, by [utilizing a derived value](TODO: ADD ME), but we'll touch on that in a future section.

## Props Rules

While it's true that component properties can be JavaScript object, there's a rule you **must** follow when it comes to object props:

You must not mutate component prop values.

For example, here's some code that **will not work as-expected**:

<!-- tabs:start -->

### React

```jsx
const GenericList = ({inputArray}) => {
    // This is NOT allowed and will break things
    inputArray.push("some value");

    // ...
}
```

### Angular

```typescript
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'generic-list',
  // ...
})
export class GenericListComponent implements OnInit {
	@Input() inputArray: string[];
    
    ngOnInit() {
        // This is NOT allowed and will break things
        this.inputArray.push("some value")
    }
    
    // ...
}
```

### Vue

```javascript
const GenericList = {
	// ...
    mounted() {
        // This is NOT allowed and will break things
        this.inputArray.push("some value");
    },
    props: ['inputArray']
    // ...
};
```

<!-- tabs:end -->


You're not intended to mutate properties because it breaks two concepts which we'll learn about later:

1) What it means to be a "pure" function 
2) Unidirectionality of component flow

# Event Binding

Binding values to an HTML attribute is a powerful way to control your UI, but that's only half the story. Showing information to the user is one thing, but you also need to react to a user's input.

One way you can do this is [binding a DOM event](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events) that are emitted by a user's behavior.

In the mockup we saw before, our files list has a hover state for the file list. However, when the user clicks on a file, it should be highlighted more distinctly.

![Three files listed in a list with the middle one selected](./small_file_list.png)

Let's add in a `isSelected` property to our `file` component to add hover styling conditionally, then update it when the user clicks on it.



<!-- tabs:start -->

### React

```jsx {1,4,9-14}
const File = ({ href, fileName }) => {
  const [isSelected, setSelected] = useState(false);

  const selectFile = () => {
    setSelected(!isSelected);
  };

  return (
    <li
      onClick={selectFile}
      style={
        isSelected
          ? { backgroundColor: "blue", color: "white" }
          : { backgroundColor: "white", color: "blue" }
      }
    >
      <a href={href}>
        {fileName}
        <FileDate inputDate={new Date()} />
      </a>
    </li>
  );
};
```

We mentioned earlier that we'd look into the second value in the return array of `useState` at a later time. Well, that time is now!

The second value of the array returned by `useState` is utilized to update the value assigned to the first variable. So, when `setSelected` is called, it will then update the value of `isSelected` and the component is re-rendered.

We also make sure to prefix the event name with `on` in order to bind a method to a browser event name. However, the first name of the browser event name needs to be capital. This means that `click` turns into `onClick`.

### Angular

```typescript {4-9,19-23}
@Component({
  selector: "file",
  template: `
    <li
      (click)="selectFile()"
      [style]="
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      "
    >
      <a [href]="href">
        {{ fileName }}
        <file-date [inputDate]="inputDate"></file-date>
      </a>
    </li>
  `
})
export class FileComponent {
  isSelected = false;

  selectFile() {
    this.isSelected = !this.isSelected;
  }

  // ...
}
```

Instead of the `[]` symbols to do input binding, we're using the `()` symbols to bind to any built-in browser name.

### Vue

```javascript {3-8,16,21-23}
const File = {
  template: `
  <li
    v-on:click="selectFile()"
    :style="
      isSelected ?
        {backgroundColor: 'blue', color: 'white'} :
        {backgroundColor: 'white', color: 'blue'}
    ">
    <a :href="href">
    	{{fileName}}
    	<file-date [inputDate]="inputDate"></file-date>
    </a>
  </li>`,
  data() {
    return {
      isSelected: false,
      inputDate: new Date(),
    };
  },
  methods: {
    selectFile() {
      this.isSelected = !this.isSelected;
    },
  },
  // ...
};
```

We can use `v-on` bind prefix to bind a method to any event. This supports any built-in browser event name.

There's also a shorthand syntax, just like there is one for attribute bindings. Instead of `v-on:`, we can use the `@` symbol.

This means:

```html
<li v-on:click="selectFile()">
```

Can be rewritten into:

```html
<li @click="selectFile()">
```

<!-- tabs:end -->

Here, we're binding the `style` property using Vue's binding. You may notice that for each framework, when binding via `style`, you use an object notation for styling instead of the usual string.

We're also using a [ternary statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) (`condition ? trueVal : falseVal`) to act as a single-line `if` statement to decide which style to use.

# Outputs

Components aren't simply able to recieve a value from its parent. You're also able to send values back to the parent.

 These values are sent back to the parent component usually via a custom event, much like those emitted by the browser. Just like the event binding that we did earlier, we'll use the same syntax to bind the custom events, alongside some new syntax in order to emit them.

> Something work mentioning is that, like event binding, React typically expects you to pass in a function as opposed emitting an event and listening for it.
>
> This differs slightly from Vue and Angular, but has the same fundamental idea of "sending data to a parent component".

While listening for a `click` event in our `file` component works well enough when we only have one file, it introduces some odd behavior with multiple files. Namely, it allows us to select more than one file at a time simply by clicking. Let's assume this isn't the expected behavior, and instead, emit a `selected` custom event to allow for only one selected file at a time.

<!-- tabs:start -->

### React

```jsx {2,5,19-27,31-36}
import { useState } from 'react';

const File = ({ href, fileName, isSelected, onSelected }) => {
  return (
    <li
      onClick={onSelected}
      style={
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      }
    >
      <a href={href}>{fileName}</a>
      {/* ... */}
    </li>
  );
};

const FileList = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSelected = (idx) => {
    if (selectedIndex === idx) {
      setSelectedIndex(-1);
      return;
    }
    setSelectedIndex(idx);
  };

  return (
    <ul>
      <File
        isSelected={selectedIndex === 0}
        onSelected={() => onSelected(0)}
        fileName="File one"
        href="/file/file_one"
      />
      <File
        isSelected={selectedIndex === 1}
        onSelected={() => onSelected(1)}
        fileName="File two"
        href="/file/file_two"
      />
      <File
        isSelected={selectedIndex === 2}
        onSelected={() => onSelected(2)}
        fileName="File three"
        href="/file/file_three"
      />
    </ul>
  );
};
```

### Angular

```typescript {11,27-28,35-40,57-65}
import {
  Component,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'file',
  template: `
    <li
      (click)="selected.emit()"
      [style]="
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      "
    >
      <a [href]="href">
        {{ fileName }}
      </a>
    </li>
  `,
})
export class FileComponent {
  @Input() fileName: string;
  @Input() href: string;
  @Input() isSelected: boolean;
  @Output() selected = new EventEmitter();
}

@Component({
  selector: 'file-list',
  template: `
    <ul>
      <file
        (selected)="onSelected(0)"
        [isSelected]="selectedIndex === 0"
        fileName="File one" 
        href="/file/file_one"
      ></file>
      <file
        (selected)="onSelected(1)"
        [isSelected]="selectedIndex === 1"
        fileName="File two" 
        href="/file/file_two"
      ></file>
      <file
        (selected)="onSelected(2)"
        [isSelected]="selectedIndex === 2"
        fileName="File three" 
        href="/file/file_three"
      ></file>
    </ul>
  `,
})
export class FileListComponent {
  selectedIndex = -1;

  onSelected(idx) {
    if (this.selectedIndex === idx) {
      this.selectedIndex = -1;
      return;
    }
    this.selectedIndex = idx;
  }
}
```

### Vue

```javascript {3,13-14,20-25,40-53}
const File = {
  template: `
    <li
      v-on:click="$emit('selected')"
      :style="
        isSelected ?
          {backgroundColor: 'blue', color: 'white'} :
          {backgroundColor: 'white', color: 'blue'}
      ">
      <a :href="href">
        {{ fileName }}
      </a>
    </li>`,
  emits: ['selected'],
  props: ['isSelected', 'fileName', 'href'],
};

const FileList = {
  template: `
    <ul>
      <file 
        @selected="onSelected(0)" 
        :isSelected="selectedIndex === 0" 
        fileName="File one" 
        href="/file/file_one"
      ></file>
      <file 
        @selected="onSelected(1)" 
        :isSelected="selectedIndex === 1" 
        fileName="File two" 
        href="/file/file_two"
      ></file>
      <file 
        @selected="onSelected(2)" 
        :isSelected="selectedIndex === 2" 
        fileName="File three" 
        href="/file/file_three"
      ></file>
    </ul>
  `,
  data() {
    return {
      selectedIndex: -1,
    };
  },
  methods: {
    onSelected(idx) {
      if (this.selectedIndex === idx) {
        this.selectedIndex = -1;
        return;
      }
      this.selectedIndex = idx;
    },
  },
  components: {
    File,
  },
};
```

<!-- tabs:end -->

> Keep in mind: This code isn't _quite_ production ready. There are some accessibility concerns with this code, and might require things like [`aria-selected`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected) and more to fix.

Here, we're using a simple number-based index to act as an `id` of sorts for each file. This allows us to keep track of which file is currently selected or not. Likewise, if the user selects an index that's already been selected, we will set the `isSelected` index to a number which no file has associated.

You may notice that we've also removed our `isSelected` state and logic from our `file` component. This is because we're following the practices of ["raising state", which is a best practices concept we'll touch on later.](TODO: Add link to future article)







-------------------------------------------------

Components can output*
