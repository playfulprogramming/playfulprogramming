---
{
    title: "Web Components 101: Lit Framework",
    description: "Google pushed for web components, sure, but they didn't stop there. They also went on to make an amazing framework to help build them: Lit!",
    published: '2021-11-04T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev', 'lit'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/web-components-101-lit-framework/',
    series: "Web Components 101",
    order: 3
}
---

Recently we talked about [what web components are and how you can build a web app utilizing them with only vanilla JavaScript](https://coderpad.io/blog/intro-to-web-components-vanilla-js/).

While web components are absolutely usable with only vanilla JavaScript, more complex usage, especially pertaining to value binding, can easily become unwieldy.

One potential solution might be using a web component framework such as VueJS or React. However, web-standard components can still be a massive boon to development.

As such, there’s a framework called [“Lit”](https://lit.dev/) that is developed specifically to leverage web components. With [Lit 2.0 recently launching as a stable release](https://lit.dev/blog/2021-09-21-announcing-lit-2/), we thought we’d take a look at how we can simplify web component development.

# HTML

One of the greatest strengths of custom elements is the ability to contain multiple other elements. This makes it so that you can have custom elements for every scale: from a button to an entire page.

To do this in a vanilla JavaScript custom element, you can use `innerHTML` to create new child elements.

```html
<script>
class MyComponent extends HTMLElement {
  connectedCallback() {
      this.render();
  }

  render() {
      this.innerHTML = '<p>Hello!</p>';
  }
}

customElements.define('hello-component', MyComponent);
</script>

<hello-component></hello-component>
```

This initial example looks fairly similar to what the Lit counterpart of that code looks like:

```html
<script type="module">
import { html, LitElement } from "https://cdn.skypack.dev/lit";

export class HelloElement extends LitElement {
    render() {
        return html`
              <p>Hello!</p>
        `;
    }
}

window.customElements.define('hello-component', HelloElement);
</script>

<hello-component></hello-component>
```

<iframe src="https://app.coderpad.io/sandbox?question_id=194516" loading="lazy"></iframe>

There are two primary differences from the vanilla JavaScript example. First, we no longer need to use the `connectedCallback` to call `render`. The LitElement’s `render` function is called by Lit itself whenever needed - such as when data changes or for an initial render - avoiding the need to manually re-call the render method.

That said, Lit components fully support the same lifecycle methods as a vanilla custom elements.

The second, easier-to-miss change from the vanilla JavaScript component to the Lit implementation, is that when we set our HTML, we don’t simply use a basic template literal (`<p>test</p>`): we pass the function `html` to the template literal (`html\`<p>test</p>\`\`).

This leverages [a somewhat infrequently used feature of template literals called tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates). Tagged templates allow a template literal to be passed to a function. This function can then transform the output based on the string input and expected interpolated placeholders.

Because tagged templates return a value like any other function, you can assign the return value of `html` to a variable.

```javascript
render {
    const el = html`
            <p>Hello!</p>
      `;
    return el;
}
```

If you were to `console.log` this value, you’d notice that it’s not an [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). Instead, it’s a custom value that Lit utilizes to render to proper DOM nodes.

# Event Binding

“If the syntax is so similar, why would I add a framework to build custom elements?”

Well, while the Vanilla JavaScript and Lit custom element code look similar for a small demo: The story changes dramatically when you look to scale up.

For example, if you wanted to render a button and add a click event to the button with vanilla JavaScript, you’d have to abandon the `innerHTML` element assignment method.

First, we’ll create an element using `document.createElement`, then add events, and finally utilize [an element method like `append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) to add the node to the DOM.

```html
<script>
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  sayHello() {
    alert("Hi there!");
  }

  render() {
    const button = document.createElement('button');
    button.innerText = "Say Hello!";
    button.addEventListener('click', this.sayHello);
    this.append(button);
  }
}

window.customElements.define('hello-component', MyComponent);
</script>

<hello-component></hello-component>
```

While this works for the initial render, it doesn’t handle any of the edgecases that,at scale,can cause long-term damage to your app’s maintainability & performance.

For example, future re-renders of the element will duplicate the button. To solve this, you must iterate through all of the element’s [`children`](https://developer.mozilla.org/en-US/docs/Web/API/Element/children) and [`remove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) them one-by-one.

Further, once the element is removed from the DOM, the click listener is not implicitly removed in the background. Because of this, it’s never released from memory and is considered a memory leak. If this issue continued to occur during long-term usage of your app, it would likely bloat memory usage and eventually crash or hang.

To solve this, you’d need to assign a variable for every `addEventListener` you had present. This may be simple for one or two events, but add too many and it can be difficult to keep track.

And all of this ignores the maintenance standpoint: What does that code do at a glance?

It doesn't look anything like HTML and as a result, requires you to consistently context shift between writing standard HTML in a string and using the DOM APIs to construct elements.

Luckily, Lit doesn’t have these issues. Here’s the same button construction and rendering to a custom element using Lit instead of vanilla JavaScript:

```html
<script type="module">
import { html, LitElement } from "https://cdn.skypack.dev/lit";

export class HelloElement extends LitElement {
    sayHello() {
          alert("Hi there!");
    }

    render() {
        return html`
            <button @click=${this.sayHello}>Say Hello!</button>
        `;
    }
}

window.customElements.define('hello-component', HelloElement);
</script>

<hello-component></hello-component>
```

<iframe src="https://app.coderpad.io/sandbox?question_id=194518" loading="lazy"></iframe>

Yup, that’s all. Lit allows you to bind elements by using the `@` sign and passing the function as a placeholder to the `html` tagged template. Not only does this look much HTML-like, it handles event cleanup, re-rendering, and more.

# Attributes & Properties

As we learned before, there are two ways to pass values between and into components: attributes and values.

Previously, when we were using vanilla JavaScript, we had to define these separately. Moreover, we had to declare which attributes to dynamically listen to value changes of.

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
      this.render();
  }

  static get observedAttributes() {
      return ['message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      this.render();
  }

  render() {
      const message = this.attributes.message.value || 'Hello world';
      this.innerHTML = `<h1>${message}</h1>`;
  }
}
```

In Lit, we declare attributes and properties using a static getter and treat them as normal values in any of our functions.

```javascript
import { html, LitElement } from "https://cdn.skypack.dev/lit";

export class HelloElement extends LitElement {
  static get properties() {
      return {
          message: {type: String},
      };
  }

  constructor() {
      super();
      this.message = 'Hello world';
  }

  render() {
      return html`
    <h1>${this.message}</h1>
  `;
  }
}

window.customElements.define('hello-component', HelloElement);
```

For starters, we no longer have to manually call “render” when a property’s value is changed. Lit will re-render when values are changed.

That’s not all, though: Keen eyed readers will notice that we’re declaring a type associated with the `message` property.

Unlike the [React ecosystem’s PropTypes](https://github.com/facebook/prop-types), the `type` subproperty doesn’t do runtime type validation. Instead, it acts as an automatic type converter.

This can be of great help as the knowledge that attributes can only be strings can be difficult to remember while debugging.

For example, we can tell Lit to convert an attribute to a Number and it will migrate from a string that looks like a number to an actual JavaScript type number.

```html
<script type="module">
import { html, LitElement } from "https://cdn.skypack.dev/lit";

export class HelloElement extends LitElement {
  static get properties() {
      return {
          val: {type: Number},
      };
  }

  render() {
      return html`
    <h1>${this.val} is typeof ${typeof this.val}</h1>
  `;
  }
}

window.customElements.define('hello-component', HelloElement);
</script>

<!-- This will show "123 is typeof number"  -->
<hello-component val="123"></hello-component>
<!-- This will show "NaN is typeof number"  -->
<hello-component val="Test"></hello-component>
```

<iframe src="https://app.coderpad.io/sandbox?question_id=194519" loading="lazy"></iframe>

## Attribute Reactivity

One of the biggest benefits of not having to call `render` manually is that Lit is able to render contents when they need to update.

For example, given this example, the contents will render properly to update with new values.

```javascript
import { html, LitElement } from "lit";

export class ChangeMessageElement extends LitElement {
  static get properties() {
      return {
          message: {type: String},
      };
  }

  changeSelectedMsg() {
      const newMsg = msgs[Math.floor(Math.random() * msgs.length)];
      this.message = newMsg;
  }

  constructor() {
      super();
      this.message = 'Hello world';
  }

  render() {
      return html`
    <button @click="${this.changeSelectedMsg}">Toggle</button>
    <hello-component message=${this.message}></hello-component>
  `;
  }
}
```

<iframe src="https://app.coderpad.io/sandbox?question_id=181069" loading="lazy"></iframe>

# Reactive Data Binding

This reactivity comes with its own set of limitations. While numbers and strings are able to be set fairly trivially, objects (and by extension arrays) are a different story.

This is because, in order for Lit to know what properties to update in render, an object must have a different reference value from one to another. [This is just how React and other frameworks detect changes in state as well.](https://www.coletiv.com/blog/dangers-of-using-objects-in-useState-and-useEffect-ReactJS-hooks/)

```javascript
export class FormElement extends LitElement {
  constructor() { /* ... */ }
  static get properties() {
      return {
          todoList: {type: Array},
          inputVal: {type: String},
      };
  }

  _onSubmit(e) {
      e.preventDefault();       /* This works, because we’re changing the object reference */
      this.todoList = [...this.todoList, this.inputVal];       /* But this would not, because we aren’t */
      // this.todoList.push(this.inputVal);       this.inputVal = '';
  }

  _onChange(e) {
      this.inputVal = e.target.value;
  }
 
  render() {
      return html`
    <form @submit="${this._onSubmit}">
      <input .value="${this.inputVal}" @change="${this._onChange}" type="text" />
      <button type="submit">Add</button>
    </form>
    <todo-component todos=${this.todoList}></todo-component>
  `;
  }
}
```

<iframe src="https://app.coderpad.io/sandbox?question_id=181090" loading="lazy"></iframe>

You may also notice that we’re binding both the user’s input and output to set and reflect the state. [This is exactly how other frameworks like React also expect you to manage user state](https://coderpad.io/blog/master-react-unidirectional-data-flow/).

# Prop Passing with Lit’s Dot Synax

HTML attributes are not the only way to pass data to a web component. Properties on the element class are a way to pass more than just a string to an element.

While the `type` field can help solve this problem as well, you’re still limited by serializability, meaning that things like functions won’t be able to be passed by attributes.

While properties are a more robust method of data passing to web components, they’re seldomly used in vanilla JavaScript due to their complexity in coding.

For example, this is a simple demonstration of passing an array.

```html
<html>
  <head>
    <!-- Render object array as "ul", passing fn to checkbox change event -->
    <script>
      class MyComponent extends HTMLElement {
        property = [];
     
        connectedCallback() {
          this.render();
        }
     
        render() {
          this.innerHTML = `<h1>${this.property.length}</h1>`;
        }
      }
   
      customElements.define('my-component', MyComponent);
    </script>
   
    <script>
      function changeElement() {
        const compEl = document.querySelector('#mycomp');
        compEl.property = [
          'Testing',
          'Second',
          'Another'
        ];      
        compEl.render();
      }
    </script>
   
  </head>
  <body>
    <my-component id="mycomp"></my-component>
    <button onclick="changeElement()">Change to 3</button>
  </body>
</html>
```

First, you have to get a reference to the element using an API like `querySelector`. This means you need to introduce a new reference to the component and make sure the IDs match in both parts of code.

Then, just as is the case with updating attribute values, we need to manually call the “render” function in order to update the UI.

But those complaints aside, there’s still one more: It places your data and component tags in two different areas. Because of this, it can be more difficult to debug or figure out what data is being passed to what component.

Lit takes a different approach. Within a Lit `html` tagged template, add a period before an attribute binding and suddenly it will pass as a property instead.

```html
<script type="module">
import { html, LitElement } from "https://cdn.skypack.dev/lit";

class MyElement extends LitElement {
  static get properties() {
    return {
      property: {type: Array},
    };
  }

  render() {
    return html`
      <h1>${this.property.length}</h1>
    `;
  }
}

window.customElements.define('my-component', MyElement);

class ChangeMessageElement extends LitElement {
    static get properties() {
      return {
        array: {type: Array},
      };
    }

    constructor() {
      super();
      this.array = [];
    }

    changeElement() {
      this.array = [
        'Testing',
        'Second',
        'Another'
      ];      
    }

    render() {
        return html`
      <!-- If "property" didn't have a period, it would pass as attribute -->
      <my-component .property=${this.array}></my-component>
      <button @click=${this.changeElement}>Change to 3</button>
    `;
    }
}

window.customElements.define('change-message-component', ChangeMessageElement);
</script>

<change-message-component></change-message-component>
```

<iframe src="https://app.coderpad.io/sandbox?question_id=194520" loading="lazy"></iframe>

This works because properties and attributes are both created at the same time with Lit.

However, due to the period binding not being HTML standard, it comes with the side effect of having to use a Lit template in order to bind properties. This tends not to be a problem in applications - since many tend to use and compose components throughout their applications.

# Array Rendering

In our article about vanilla JavaScript web components, we built a simple todo list. Let’s take another look at that example, but this time using Lit for our component code. We’ll get started with a parent `FormElement`, which will manage the data and user input.

```javascript
class FormElement extends LitElement {
  static get properties() {
      return {
          todoList: {type: Array},
          inputVal: {type: String},
      };
  }

  _onSubmit(e) {
      e.preventDefault();
      this.todoList = [...this.todoList, {name: this.inputVal, completed: false}];
      this.inputVal = '';
  }

  // ...

  render() {
      return html`
    <button @click=${this.toggleAll}>Toggle all</button>
    <form @submit=${this._onSubmit}>
      <input .value=${this.inputVal} @change=${this._onChange} type="text" />

      <button type="submit">Add</button>
    </form>
    <!-- Notice the period in ".todos" -->
    <todo-component .todos=${this.todoList}></todo-component>
  `;
  }
}
```

Now that we have a form that contains an array, an important question arises: how do we iterate through an array in order to create individual elements for a list?

Well, while \[React has `Array.map](https://reactjs.org/docs/lists-and-keys.html)` and [Vue has `v-for`](https://v3.vuejs.org/guide/list.html#mapping-an-array-to-elements-with-v-for), Lit uses a `repeat` function. Here’s an example:

```javascript
class TodoElement extends LitElement {
  // ...

  render() {
      return html`
    <ul>
      ${repeat(this.todos, (todo) => html`
        <li>
          <input type="checkbox" .checked=${todo.completed}/>
          ${todo.name}
        </li>
      `)}
    </ul>
  `;
  }
}
```

<iframe src="https://app.coderpad.io/sandbox?question_id=181092" loading="lazy"></iframe>

# Passing Functions

Before we step away from code to talk pros and cons about Lit itself (shh, spoilers!); let’s take a look at a code sample that demonstrates many of the benefits over vanilla JavaScript web components we’ve talked about today.

Readers of the previous blog post will remember that when passing an array of objects to a web component, things looked pretty decent.

It wasn’t until we tried binding event listeners to an array of objects that things got complex (and messy). Between needing to manually create elements using `document`, dealing with `querySelector` to pass properties, manually calling “render”, and needing to implement a custom “clear” method - it was a messy experience.

Let’s see how Lit handles the job.

```javascript
class TodoElement extends LitElement {
  // ...
 
  render() {
      const headerText = this.todos
          .filter(todo => todo.completed).length;

      return html`
    <h1>${headerText}</h1>
    <ul>
      ${repeat(this.todos, (todo) => html`
        <li>
          <input type="checkbox" @change=${todo.onChange} .checked=${todo.completed}/>
          ${todo.name}
        </li>
      `)}
    </ul>
  `;
  }
}
```

<iframe src="https://app.coderpad.io/sandbox?question_id=181093" loading="lazy"></iframe>

You will notice that we’re using a `filter` within our `render` method. Because this logic is within the `render` method, it will run on every UI update. This is important to note in case you have expensive operations: you should avoid running those within the render method.

Outside of this, however - that’s all there is! It reads just like HTML would (with the added benefit of cleanup and prop passing), handles dynamic data, and more!

# Conclusion

The ability to leverage Lit in an application makes maintaining and improving a project easier than rolling web components yourself.

Lit demonstrates significant growth in web components from the early days of [Polymer](http://polymer-project.org/). This growth is in no small part due to the Lit team themselves, either!

Before it was a fully fledged framework, the project started from the `lit-html` package, which was an offshoot of Polymer. The Polymer team was instrumental in standardizing the modern variant of web components.

The ability to use Lit can strongly enhance web component development, but there are other options out there. Next time, we’ll talk about what the competitors are doing, what the pros and cons of each are, and how you can make the best choice for your applications.
