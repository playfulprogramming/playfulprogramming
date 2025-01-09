---
{
    title: "Forms",
    description: "Forms are a core part of any application. Even when a single input, it can be tricky to manage where the state should live. Let's learn how to do so with React, Angular, and Vue.",
    published: '2025-01-01T22:12:03.284Z',
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

We've been working on a files app up to this point in a fairly simplistic manner of getting files listed for the user. However, many modern file apps (such as Dropbox and Google Drive) allow you to share files with others.

Let's create a form that the user can fill out to add a new user to their existing files.

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

## Field Validation

// TODO: Cover manual field validation here

## Async Validation

// TODO: Cover async onChange, debouncing, et al

## Validation Schemas

// TODO: Cover Valibot

# Making your own UI components

// TODO: Talk about wrapping TanStack Form into your own apps
