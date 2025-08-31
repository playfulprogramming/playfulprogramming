---
{
    title: "Forms",
    description: "Forms are a core part of any application. Even when a single input, it can be tricky to manage where the state should live. Let's learn how to do so with React, Angular, and Vue.",
    published: '2026-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 4
}
---

<details>
<summary>What tools are we learning in this chapter?</summary>
Forms, being widely used parts of many apps, have many options available to build with.

Here's a few tools we **won't** be looking at in this chapter:

- Formik
- React Hook Form
- VeeValidate
- FormKit
- Angular's Official Form Package

Instead, we'll be looking at a single library for Forms, regardless of the framework:

[TanStack Form](https://tanstack.com/form)

This is predominantly because it's cross-framework support enables a more apples-to-apples comparison when talking about each framework.

> Disclaimer: I (the author of this book) am the lead maintainer of TanStack Form.
> 
> While I believe that TanStack Form covers most needs a newcomer would need to learn to use other tools, I've written articles about a few of the other form solutions linked above.

</details>

One of the most common types of front-end applications that I've seen in my career can be classified as some form of "Form wrapper". Whether it's a payment form, a user-submitted tracking form, or anything of the like - these pages exist in almost every app I've ever seen.

What's more, even in less obvious "form wrapper" style pages, you'll always need a way to track a user's input for usage in some kind of processing.

To do this, React, Angular, and Vue all have a few tools at their disposal.

# Uncontrolled Bindings

While this book focuses on frontend frameworks, let's begin by covering the basics: What the browser supports by default without any additional tooling.

See, the browser is able to store data inside a DOM node via properties:

```javascript
const soundEl = document.createElement('audio');
// Set the initial time for the audio file to be 100 seconds into the file
soundEl.currentTime = 100;
```

> Properties are not attributes. While attributes are strings stored in the DOM's markup, properties are in-memory values attributed to a given DOM node and can be non-string values.

And like most parts of our UI, a form is a representation of data we want to visualize to our users:

```javascript
const inputEl = document.createElement('input');
inputEl.value = "Hello, world!";
```

<iframe data-frame-title="Uncontrolled Forms" src="pfp-code:./ffg-ecosystem-uncontrolled-16?template=node&embed=1&file=src%2Findex.html" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

We can use this ability to store values inside a DOM node alongside a set of other APIs — namely [the `<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form) — to build out a form without ever duplicating the value in JavaScript:

````html
<form>
  <p>What is your name?</p>
  <label>
    Name:
    <input id="name" />
  </label>
  <div style="margin-top: 1em">
	  <button type="submit">Submit</button>
  </div>
</form>
<script>
  const form = document.querySelector("form");

  const nameInput = document.querySelector("#name");

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert(`Hello, ${nameInput.value}!`);
  });
</script>
````

<iframe data-frame-title="Uncontrolled Form Submit" src="pfp-code:./ffg-ecosystem-uncontrolled-form-submit-17?template=node&embed=1&file=src%2Findex.html" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Uncontrolled Form Validation

But storing the values is only half of the battle: What happens when we want to validate our users' input against a set of rules?

Maybe the user must agree to legal terms to sign up for your service. How can you reject the user when they forget to select the checkbox? 

Well, using [the browser's `setCustomValidity` API ](https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity) and [the `input` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event) we can do just that:

```html
<form>
  <p>Pretend that there is some legalese here.</p>
  <label>
    <span>Agree to the terms?</span>
    <input id="agree" type="checkbox" />
  </label>
  <div style="margin-top: 1em">
    <button type="submit">Submit</button>
  </div>
</form>
<script>
  const form = document.querySelector("form");
  const agreeCheckbox = document.querySelector("#agree");

  // Without this, the user will never be able to submit after a failed submission
  agreeCheckbox.addEventListener('input', () => {
    agreeCheckbox.setCustomValidity("");
  })

  form.addEventListener("submit", (event) => {
    // Prevent the form from resetting the page
    event.preventDefault();
    if (!agreeCheckbox.checked) {
      agreeCheckbox.setCustomValidity("You must agree to the terms.");
      agreeCheckbox.reportValidity();
    } else {
      agreeCheckbox.setCustomValidity("");
      alert("You have successfully signed up for our service, whatever that is")
    }
  });
</script>
```

<iframe data-frame-title="Uncontrolled Form Submit" src="pfp-code:./ffg-ecosystem-uncontrolled-validation-18?template=node&embed=1&file=src%2Findex.html" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Now, when the user tries to submit the form without accepting, they'll be greeted with the following:

![TODO: Write alt](./agree_to_terms.png)

## Uncontrolled Frameworks

These features we've been using are built into the browser. Because of this, we can use these built-in APIs in our frameworks as well:

<!-- ::start:tabs -->

## React

```jsx
function App() {
	const agreeCheckbox = useRef();

	// This must be an `onChange` event, which differs from vanilla JS and other frameworks
	const onAgreeChange = () => {
		agreeCheckbox.current.setCustomValidity("");
	}

	const submit = (event) => {
		event.preventDefault();
		if (!agreeCheckbox.current.checked) {
			agreeCheckbox.current.setCustomValidity("You must agree to the terms.");
			agreeCheckbox.current.reportValidity();
		} else {
			agreeCheckbox.current.setCustomValidity("");
			alert("You have successfully signed up for our service, whatever that is");
		}
	}

	return (
		<form onSubmit={submit}>
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input ref={agreeCheckbox} onChange={onAgreeChange} type="checkbox" />
			</label>
			<div style={{ marginTop: "1em" }}>
				<button type="submit">Submit</button>
			</div>
		</form>
	)
}
```

## Angular

```angular-ts
@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form (submit)="submit($event)">
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input #agreeCheckbox (input)="onAgreeChange()" type="checkbox" />
			</label>
			<div style="margin-top: 1em;">
				<button type="submit">Submit</button>
			</div>
		</form>
	`,
})
export class App {
	agreeCheckbox = viewChild("agreeCheckbox", {read: ElementRef<HTMLInputElement>});

	onAgreeChange() {
		this.agreeCheckbox()?.nativeElement.setCustomValidity("");
	}

	submit(event: Event) {
		event.preventDefault();
		const checkbox = this.agreeCheckbox()?.nativeElement;
		if (!checkbox) return;
		if (!checkbox.checked) {
			checkbox.setCustomValidity("You must agree to the terms.");
			checkbox.reportValidity();
		} else {
			checkbox.setCustomValidity("");
			alert("You have successfully signed up for our service, whatever that is");
		}
	}
}
```

## Vue

```vue
<script setup>
import { ref } from 'vue';

const agreeCheckbox = ref(null);

	const onAgreeChange = () => {
		agreeCheckbox.value?.setCustomValidity("");
	}

	const submit = (event) => {
		event.preventDefault();
		const checkbox = agreeCheckbox.value;
		if (!checkbox) return;
		if (!checkbox.checked) {
			checkbox.setCustomValidity("You must agree to the terms.");
			checkbox.reportValidity();
		} else {
			checkbox.setCustomValidity("");
			alert("You have successfully signed up for our service, whatever that is");
		}
	}
</script>

<template>
		<form @submit="submit($event)">
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input ref="agreeCheckbox" @input="onAgreeChange()" type="checkbox" />
			</label>
			<div style="margin-top: 1em;">
				<button type="submit">Submit</button>
			</div>
		</form>
</template>
```

<!-- ::end:tabs -->

You'll notice that all of these components use [an element reference](/posts/ffg-fundamentals-element-reference) to track the element for the `input` event.

## Uncontrolled Downsides

// TODO: Talk about how the DOM has its own state, but leads to a number of downsides

// TODO: Talk about how validation usually has more stringent UX/UI requirements than the browser provides



# One-way Form Bindings

One common and easy way to assign a value to form elements - like a text input - is to simply listen for value changes (using events) on the element and assign those changes back to a bound input value.

<!-- ::start:tabs -->

## React

```jsx
const FormComp = () => {
  const [usersName, setUsersName] = useState("");

  const onChange = (e) => {
    setUsersName(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(usersName);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={onChange} value={usersName} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Angular

```typescript
@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)">
	  	<input type="text" (change)="onChange($event)" [value]="usersName"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  usersName = '';

  onChange(e: { target: HTMLInputElement }) {
    this.usersName = e.target.value;
  }

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.usersName);
  }
}
```

## Vue

```vue
<!-- FormComp.vue -->
<template>
  <form @submit="onSubmit($event)">
    <input type="text" @change="onChange($event)" :value="usersName" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const usersName = ref('')

function onChange(e) {
  this.usersName = e.target.value
}
function onSubmit(e) {
  e.preventDefault()
  console.log(this.usersName)
}
</script>
```

<!-- ::end:tabs -->



While this works as-is, it can get complex when too many inputs are present. For each input, you need:

- A function to listen for changes and bind them to the value
- A variable to assign the data to
- Rebind said data back to the input

Let's try to simplify this by removing the first step.

# Two-way form bindings

One method for removing the input change listener is by using two-way variable bindings. When your framework supports this, you don't need to assign a function for change listening. Simply pass a variable and watch the value change as you type!

<!-- ::start:tabs -->

## React

React doesn't have a way to do this and generally regards it as an anti-pattern even if it were possible. The reason they consider it an anti-pattern is because they strongly encourage utilizing [unidirectional data flow instead, which we'll learn about in a future chapter](// TODO: Add). The React team (and ecosystem) tend to prefer you stick to event bindings instead of a two-way form bind.

However, we'll touch on another method of form binding that should be help address the verbosity of event bindings.

## Angular

If you recall from our earlier introduction to components, Angular's syntax to bind to an attribute or property is `[bindName]`. Similarly, the syntax to bind to a DOM event or component output is `(bindName)`.

Well, if we combine them together, we can sync all of an event's values to and from an Angular variable with a handy shorthand:
```typescript
[(bindName)]
```

> Remember to not flip the `[]` and `()` symbols! It's important to make sure that the square brackets go on the outside of the bind.
>
> Luckily, there's a mnemonic device to remember this operator order - This syntax is colloquially known as a ["banana in a box", even in Angular's source code itself](https://github.com/angular/angular/blob/3ecf93020ce06b9b8621f0c83126cb3d584d4181/packages/compiler/src/render3/r3_template_transform.ts#L41)!

For our simple example of binding a `value`, we can use the `bindName` of `ngModel`, which is standard on most input elements.

```typescript {4,10}
@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)">
	  <input type="text" [(ngModel)]="usersName" name="input"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  usersName = '';

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.usersName);
  }
}
```

However, when you first use this, you may run into an error:

> Type 'Event' is not assignable to type 'string'.

This is because we need to import the `FormsModule` in our closest `NgModule` to use `ngModel` bindings

```typescript {2,6}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, FormComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Vue

While Angular's two-way binding requires a special syntax, Vue instead relies on a custom element attribute called `v-model` to sync the variable to the element's value.

```vue
<!-- FormComp.vue -->
<template>
  <form @submit="onSubmit($event)">
    <input type="text" v-model="usersName" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const usersName = ref('')

function onSubmit(e) {
  e.preventDefault()
  console.log(this.usersName)
}
</script>
```

<!-- ::end:tabs -->

While these methods of two-way binding help mitigate some problems, there's still one big problem: Your data is no longer consolidated. This means that if you submit a form and want to, say, pass the form's data to your server, you'll need to:

- Create a new object
- Make sure you pass all subkeys of the object

While this works for simple examples like ours, it quickly gets unwieldy and easy to introduce bugs within at a larger scale.

There's a better way.

# Introducing Form Libraries

// TODO: Cover initial values

# Form Arrays

// TODO: Talk about arrays and sub-objects, et al

# Form Validation

// TODO: Cover manual form validation here

## Validation Types

// TODO: Talk about onChange vs onBlur vs onMount, et al

// TODO: Talk about onDynamic

## Field Validation

// TODO: Cover manual field validation here

## Async Validation

// TODO: Cover async onChange, debouncing, et al

## Validation Schemas

// TODO: Cover Valibot

# Making your own UI components

// TODO: Talk about wrapping TanStack Form into your own apps
