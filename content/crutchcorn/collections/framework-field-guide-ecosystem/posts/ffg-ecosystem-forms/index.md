---
{
    title: "Forms",
    description: "Forms are a core part of any application. Even when a single input, it can be tricky to manage where the state should live. Let's learn how to do so with React, Angular, and Vue.",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 3
}
---

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

# Reactive Forms

Reactive forms are a way for you to keep all of your form data inside of a single variable when it comes time to submit a form. There are also multiple enhancements to this method, such as data validation and array handling.

Let's take a look at how we can use reactive forms in our frameworks, then touch on the additional features afterward.

<!-- ::start:tabs -->

## React

Because of React's minimalist API philosophy, React does not have anything equivocal to Angular's reactive forms. Instead, it relies on the ecosystem of libraries to support this functionality.

Luckily, there's a similar tool that's both widely used and highly capable: [Formik](https://formik.org/).

Here's what a basic form might look like in Formik:

```jsx {10-18,20,24-29}
import React from "react";
import { useFormik } from "formik";

const FormComponent = () => {
  /**
   * Formik provides us a hook called "useFormik" which allows us to
   * define the initial values and submitted behavior
   * 
   * This return value is then used to track form events and more
   */
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>
          Name
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </label>
      </div>
      <div>
        <label>
          Email
          <input
            type="text"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.favoriteFood}
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

### `<Formik/>` Component 

The `useFormik` hook isn't the only way to declare a form, however. Formik also provides a set of components that can then be used in place of a hook.

```jsx {5-14}
import React from "react";
import { Formik } from "formik";

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={values.name}
              />
            </label>
          </div>
          <div>
            <label>
              Email
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={values.favoriteFood}
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
```

This component isn't just useful as an alternative API, however. It also enabled us to use functionality like Formik's built-in `Form` and `Field` components, which allows us to remove the `onSubmit` and `onChange` method passing for a more terse API.

```jsx {12,16,22,26}
const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form>
          <div>
            <label>
              Name
              <Field type="text" name="name" />
            </label>
          </div>
          <div>
            <label>
              Email
              <Field type="text" name="email" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

> Keep in mind that the `Field` and `Form` components will not work when using `useFormik`. This is because of underlying implementation details that [rely on React's Dependency Injection (which we'll touch on in a future chapter)](// TODO: Add link). Instead, you'd have to pass `onChange` and `onSubmit`, respectively, to `input` and `form` HTML elements, as we demonstrated before.

> We are currently using version 2 of Formik. Inevitably, its API will change, and this section will be out-of-date, but the core concepts at play likely will not change very much.

## Angular

As opposed to the other two frameworks, which require utilizing an external library for reactive forms, Angular has them baked in as a priority feature of the framework.

To utilize them, we first need to import the `ReactiveFormsModule`, which allows us to have a more fully-featured API as opposed to `FormsModule`'s `[(ngModel)]`.

```typescript {2,5}
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [AppComponent, FormComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Now, we can create a new instance of a class called `FormControl` to act as a form item that we can then bind to a `[formControl]` in order to have two-way event and value input sync. 

```typescript {0,6,12}
import { FormControl } from '@angular/forms';

@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)">
	  <input type="text" [formControl]="nameControl"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  nameControl = new FormControl('');

  onSubmit(e) {
    e.preventDefault();
    console.log(this.nameControl.value);
  }
}
```

We aren't simply bound to input events to update this value, however; we can even manually update the value of the `FormControl` from JavaScript-land:

```typescript {14}
@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)">
      <input type="text" [formControl]="nameControl"/>
      <button type="button" (click)="setControlToName()">Set to author name</button>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  nameControl = new FormControl('');

  setControlToName() {
    this.nameControl.patchValue('Corbin Crutchley');
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.nameControl.value);
  }
}
```

### Form Groups

While a basic `FormControl` creation is useful for demonstration purposes, it doesn't truly demonstrate the full power of reactive forms. Namely, when there are multiple inputs, your `form` can act as the source of truth through a new `FormGroup` class instance:

```typescript {0,5,9,23-26,30}
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <div>
      <label>
        Name
        <input type="text" formControlName="name"/>
      </label>
    </div>
    <div>
      <label>
        Email
        <input type="text" formControlName="email"/>
      </label>
    </div>
    <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  mainForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

### Form Builder

You're also able to utilize a shorthand `fb` provided by Angular to remove duplicate calls to `FormControl` and `FormGroup`, respectively.

```typescript
import {
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <div>
      <label>
        Name
        <input type="text" formControlName="name"/>
      </label>
    </div>
    <div>
      <label>
        Email
        <input type="text" formControlName="email"/>
      </label>
    </div>
    <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  mainForm = this.fb.group({
    name: '',
    // This doesn't mean to make `favoriteFood` an array
    // It just allows us to add more information about this
    // Input in the future.
    // We'll see it's usage in the next section
    email: [''],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

> Under the hood, this uses Angular's [Dependency Injection system, which we'll touch on in a future chapter.](// TODO: Add link)

## Vue

While Vue has a large home-grown ecosystem of tools, Vue does not have an official complex form library. Luckily for us, [`vee-validate` aims to be a good fit for any form requirements our Vue apps may have](https://github.com/logaretm/vee-validate). 

Here's a simple form using `vee-validate`:

```vue
<!-- FormComp.vue -->
<template>
  <VForm @submit="onSubmit">
    <div>
      <label>
        Name
        <VField name="name" value="" />
      </label>
    </div>

    <div>
      <label>
        Email
        <VField name="email" value="" />
      </label>
    </div>
    <button type="submit">Submit</button>
  </VForm>
</template>

<script setup>
import { Form as VForm, Field as VField } from 'vee-validate'

function onSubmit(values) {
  console.log(values)
}
</script>
```

Here, we'll use the `import {Something as SomethingElse}` syntax in order to avoid namespace collision (where two things are named the same, and the compiler has challenges figuring out which is which) with [HTML's default `form` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

> We are currently using version 4 of `vee-validate`. Inevitably, its API will change, and this section will be out-of-date, but the core concepts at play likely will not change very much.

<!-- ::end:tabs -->

## Input States {#input-states}

As we mentioned earlier, reactive forms have more features than the simple two-way (or even one-way) input binding!

One feature that's added with reactive forms is the concept of an input's state. An input can have many different states:

- "Touched" - When the user has interacted with a given field, even if they haven't input anything
  - Clicking on the input
  - Tabbing through an input
  - Typing data into input
- "Pristine" - The user has not yet input data into the field
  - Comes before "touching" said field if the user has not interacted with it in any way
  - Comes between "touched" and "dirty" when the user has "touched" the field but has not put data in
- "Dirty"  - When the user has input data into the field
  - Comes after "touching" said field
  - Opposite of "pristine"
- "Disabled" - Inputs that the user should not be able to add values into

While some of these states are mutually exclusive, an input may have more than one of these states active at a time. For example, a field that the user has typed into has both "dirty" and "touched" states applied at the same time.

These states can then be used to apply different styling or logic to each of the input's associated elements. For example, a field that is `required && touched && pristine`, meaning that the user has clicked on the field, not input data into the field, but the field requires a user's input. In this instance, an implementation might show a `"This field is required"` error message.

> The method of displaying this error message is part of a much larger discussion of [field validation, which we'll touch on in a different section in this chapter](#form-validation).

In addition to the form's fields having these possible states applied, many of them apply to the `form` itself.

For example, when the user "touches" a field for the first time, they're also "touching" the form itself. You can use this information to do something like:

```javascript
// This is pseudocode and likely won't work with any framework unconfigured
if (!form.touched) {
	alert("You must put data into the form first!")
    return;
}
```

In addition to the existing field states, a form may also contain the following states:

- "Submitted" - When the user has submitted a form
- "Pending" - When a user has submitted a form while the form is currently doing something
  - Comes after the "submitted" state
  - Submitting data to the server

Here's an interactive playground that you can use to play around with each of the different input states.



<!-- ::start:tabs -->

### React

Formik only provides the states for:

- Touched fields
- Dirty forms
- Submitted forms

And allows you to construct the rest from it

```jsx
const FormComponent = () => {
  const [isPending, setIsPending] = useState(false);
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
      }}
      onSubmit={(values) => {
        setIsPending(true);
        sendToServer(values).then(() => setIsPending(false));
      }}
    >
      {({ touched, dirty, isSubmitting }) => (
        <Form>
          <div>
            <label>
              Name
              <Field type="text" name="name" />
            </label>
            {touched.name && <p>This field has been touched</p>}
            {!touched.name && <p>This field has not been touched</p>}
          </div>
          <div>
            <label>
              Disabled Field
              <Field type="text" name="email" disabled />
            </label>
          </div>
          {/* Formik doesn't provide "dirty" on a field-level basis */}
          {dirty && <p>This form is dirty</p>}
          {!dirty && <p>This form is pristine</p>}
          {isSubmitting && <p>Form is submitted</p>}
          {isPending && <p>Form is pending</p>}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

// Pretend this is calling to a server
function sendToServer(formData) {
  // Wait 4 seconds, then resolve promise
  return new Promise((resolve) => setTimeout(() => resolve(), 4000));
}
```

### Angular

```typescript
@Component({
  selector: 'my-app',
  template: `
  <div>
    <h1>Friend List</h1>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <div>
      <label>
        Name
        <input type="text" formControlName="name"/>
      </label>
      <p *ngIf="mainForm.controls.name.untouched">
        Field has not been touched
      </p>
      <p *ngIf="mainForm.controls.name.touched">
        Field has been touched
      </p>
      <p *ngIf="mainForm.controls.name.dirty">
        Field is dirty
      </p>
      <p *ngIf="mainForm.controls.name.pristine">
        Field is pristine
      </p>
    </div>
    <div>
      <label>
        Disabled field
        <input type="text" formControlName="email"/>
      </label>
    </div>
    <button type="submit">Submit</button>
    <p *ngIf="mainForm.untouched">
      Form has not been touched
    </p>
    <p *ngIf="mainForm.touched">
      Form has been touched
    </p>
    <p *ngIf="mainForm.dirty">
      Form is dirty
    </p>
    <p *ngIf="mainForm.pristine">
      Form is pristine
    </p>
    <p *ngIf="mainForm.dirty">
      Form is dirty
    </p>
    <p *ngIf="submitted">
      Form is submitted
    </p>
    <p *ngIf="pending">
      Form is pending
    </p>
    </form>
  </div>
  `,
})
class AppComponent {
  constructor(private fb: FormBuilder) {}

  mainForm = this.fb.group({
    name: [''],
    email: [{ value: '', disabled: true }],
  });

  submitted = false;
  pending = false;

  onSubmit(e) {
    this.submitted = true;
    this.pending = true;
    e.preventDefault();
    this.sendToServer(this.mainForm.value).then(() => {
      this.pending = false;
    });
  }

  // Pretend this is calling to a server
  sendToServer(formData) {
    // Wait 4 seconds, then resolve promise
    return new Promise((resolve) => setTimeout(() => resolve(0), 4000));
  }
}
```

### Vue

`vee-validate` exposes the `touched` and `dirty` fields via a `v-slot` associated with each `VField` as well as each `VForm`.

`v-slot` can be a bit confusing at first, but just think of it as "this component wants to expose a variable to the template that can then be used later". Basically, in this instance, `VForm` and `VField` both have an internal value called `meta` that we can expose via `v-slot` for our usage in reflecting information about the form in the DOM.

> We'll touch on `v-slot` more in-depth (including how to implement support in your components) [in the chapter "Content reference"](/posts/content-reference)

A side effect of this exposing method, however, is that you now must `v-bind` an `input` inside of the `VField` where we did not have to do so earlier.

```vue
<!-- FormComp.vue -->
<template>
  <VForm @submit="onSubmit" v-slot="{ meta }">
    <div>
      <label>
        Name
        <VField name="name" value="" v-slot="{ field, meta }">
          <input v-bind="field" />
          <p v-if="meta.dirty">Field is dirty</p>
          <p v-if="meta.touched">Field has been touched</p>
          <p v-if="!meta.dirty">Field is pristine</p>
        </VField>
      </label>
    </div>

    <div>
      <label>
        Disabled field
        <VField disabled name="email" value="" />
      </label>
    </div>
    <p v-if="meta.dirty">Form is dirty</p>
    <p v-if="!meta.dirty">Form is pristine</p>
    <p v-if="meta.touched">Form has been touched</p>
    <p v-if="submitted">Form submitted</p>
    <p v-if="pending">Form is pending</p>
    <button type="submit">Submit</button>
  </VForm>
</template>

<script setup>
import { ref } from 'vue'
import { Form as VForm, Field as VField } from 'vee-validate'

const pending = ref(false)
const submitted = ref(false)

function onSubmit(values) {
  submitted.value = true
  pending.value = true
  sendToServer(values).then(() => {
    pending.value = false
  })
}

// Pretend this is calling to a server
function sendToServer(formData) {
  // Wait 4 seconds, then resolve promise
  return new Promise((resolve) => setTimeout(() => resolve(0), 4000))
}
</script>
```

> You may notice that `vee-validate`'s `dirty` only seems to be `true` when the form actively has data inside of it. This differs in behavior from the other frameworks and is worth noting.

<!-- ::end:tabs -->

Additional to form states, a reactive form also adds the following features into a form: 

- Form groups - A collection of fields (or sub-fields) that create a grouping
- [Form arrays](#form-arrays) - A collection of fields in a list
- [Validation - making sure an input's value aligns with a set of rules.](#form-validation)
	- "Is input a valid email"
	- Required fits into this category

Let's start by taking a look at form arrays.

# Form Arrays {#form-arrays}

The example we set off to build at the start of the chapter was a method of sharing a file with a selection of users. 

While we've built a primitive version of this that allows us to share a file with a single user, let's expand that behavior to allow us to share a file with any number of users.

To do this, we'll need to rely on the ability to add in an array of a form.

<!-- ::start:tabs -->

## React

Formik provides a `FieldArray` to help make handling arrays easier with Formik fields. Similar to Formik's `Field` and `Form` components, `FieldArray` only works when using the `Formik` component instead of the `useFormik` hook.

```jsx
import { Formik, Form, Field, FieldArray } from "formik";

// We'll explain why we need an id a bit later
let id = 0;

export const FriendList = () => (
  <div>
    <h1>Friend List</h1>
    <Formik
      initialValues={{ users: [{name: "", id: ++id}] }}
      onSubmit={(values) => console.log(values)}
     >
       {({ values }) => (
        <Form>
          <FieldArray
            name="users"
            render={(arrayHelpers) => (
              <div>
                {values.users.map((user, index) => (
                  <div key={index}>
                    <label>
                      Name
                      <Field name={`users.${index}.name`} />
                    </label>
                    <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                    >
                      Remove User
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => arrayHelpers.push({ name: "", id: ++id })}
                >
                  Add user
                </button>
                <button type="submit">Submit</button>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  </div>
);
```

> You may notice that we're using `arrayHelpers.push` and `arrayHelpers.remove` instead of simply doing `values.push`. This is because if we do a `values.push` command, it won't trigger a re-render. We'll learn more about why this is and what the alternatives tend to be [in the chapter exploring React's internals](// TODO: Add link).

## Angular

Instead of a dedicated component for rendering lists like with React's Formik, Angular allows you to simply `ngFor` and use `formGroupName` in association with `formArrayName` and `formControlName` to access the specific `FormControl` and `FormGroup` for a user's information.

```typescript
@Component({
  selector: 'my-app',
  template: `
  <div>
    <h1>Friend List</h1>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <div formArrayName="users">
    <div *ngFor="let item of arr.controls; let i = index;" [formGroupName]="i">
      <label>
        Name
        <input type="text" formControlName="name"/>
      </label>
      <button type="button" (click)="removeUser(i)">Remove User</button>
    </div>
    </div>
    <button type="button" (click)="addUser()">Add user</button>
    <button type="submit">Submit</button>
    </form>
  </div>
  `,
})
class AppComponent {
  constructor(private fb: FormBuilder) {}

  id = 0;

  mainForm = this.fb.group({
    // This could also be written using `new FormArray([`
    users: this.fb.array([this.fb.group({ id: ++this.id, name: '' })]),
  });

  addUser() {
    this.arr.push(
      // This could also be written as `new FormGroup({`
      this.fb.group({
        id: ++this.id,
        name: '',
      })
    );
  }

  removeUser(i) {
    this.arr.removeAt(i);
  }

  // Required cast to FormArray. Otherwise, TypeScript will assume it
  // to be a `FormControl` and won't have `push` or `removeAt` methods.
  get arr(): FormArray {
    return this.mainForm.get('users') as FormArray;
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```



## Vue

Similar to Angular, you're able to use `v-for` to iterate through each user index, then use said index to alias the `name` property of `v-field` to access a user's information.

```vue
<!-- FormComp.vue -->
<template>
  <div>
    <h1>Friend List</h1>
    <VForm @submit="onSubmit" :initial-values="initialValues">
      <FieldArray name="users" key-path="id" v-slot="{ fields, push, remove }">
        <div v-for="(field, idx) in fields" :key="field.key">
          <label>
            Name
            <VField :name="'users[' + idx + '].name'" />
          </label>
          <button type="button" @click="remove(idx)">Remove User</button>
        </div>
        <button type="button" @click="push({ name: '', id: ++id })">Add User</button>
      </FieldArray>
      <button type="submit">Submit</button>
    </VForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Form as VForm, Field as VField, FieldArray } from 'vee-validate'

const initialValues = { users: [{ name: '', id: 0 }] }
const id = ref(1)

function onSubmit(values) {
  console.log(values)
}
</script>
```

Our usage of `key-path` with the `id` to track which user is which is worth highlighting here.

<!-- ::end:tabs -->

Because we're now using an array, we need a unique ID for each user. This is why, for each implementation, there's an `id` field. We then use this `id` field to identify which user is which to the framework, [just like we've done before for loops in HTML](/posts/dynamic-html).



# Form Validation {#form-validation}

After adding in form arrays to your share dialog, you sit down, ready to work on the next task. Suddenly, an email slides in from your issues tracker: Dang it - you missed a requirement.

Namely, we need to make sure that the user has actually typed in the user's name before moving forward.

Let's see if we can't mark the name field as "required" and show an error when the user tries to submit a form without inputting a name.

> To focus on form validation, let's temporarily remove the array requirement and limit our scope just to the form validation.

<!-- ::start:tabs -->

## React

Formik allows you to pass a function to the `Field` component in order to `validate` the data input. Here, we can simply check if `value` is present or not. Then, we can check against the `Formik` component's `errors` field to see if the `name` field has any errors. 

```jsx
import { Formik, Form, Field } from 'formik';

function requiredField(value) {
  let error;
  if (!value) {
    error = 'Required';
  }
  return error;
}

const FormComp = () => {
  return (
    <Formik initialValues={{ name: '' }} onSubmit={(val) => console.log(val)}>
      {({ errors, touched }) => (
        <Form>
          <div>
            <Field name="name" validate={requiredField} />
          </div>
          {errors.name && errors.touched && <div>{errors.name}</div>}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

### Complex Data Schema

Formik's `validate` function passing works quite well for basic usage. That said, let's introduce a better way to do form validation that scales a little better when dealing with more complex data.

There are multiple different libraries that will integrate with Formik to add dedicated complex validation functionality. [`yup` is one such library](https://github.com/jquense/yup).

By using `yup`, you're able to replace our home-grown function with something as simple as `yup.string().required()` to mark the field as required.

Yup works by introducing the concept of a "schema" into form validation. You start by declaring a schema that's then validated against using the `validationSchema` in the `Formik` component.

```jsx
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  name: yup.string().required(),
});

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Name
              <Field type="text" name="name" />
            </label>
            {errors.name && <p>{errors.name}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

While Yup will generate an error message based on the expected and received data types, we're also able to customize the error message ourselves:

```javascript
const FormSchema = yup.object().shape({
  name: yup.string().required("You must input a name of the user to share with."),
});
```

## Angular

You know how earlier we switch our `fb.group` command from:

```typescript
mainForm = this.fb.group({
  name: ''
});
```

To:

```typescript
mainForm = this.fb.group({
  name: [''],
});
```

And promised there was some nebulous benefit for doing so later? Well, now it's time to introduce the "why". When a `FormControl` is passed an array with a second value, that value is treated as a validator function.

Let's write a simple validator function to check when the field is filled or not. If it's not filled, we can return a string to display to the user that "This field is required".

```typescript
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

export function requiredValidator(
  control: AbstractControl
): ValidationErrors | null {
  const noVal = !control.value;
  return noVal ? { required: 'This field is required' } : null;
}

@Component({
  selector: 'my-app',
  template: `
  <div>
    <h1>Friend List</h1>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <label>
      Name
      <input type="text" formControlName="name"/>
    </label>


    <div *ngIf="mainForm.touched && mainForm.controls.name.errors?.['required']">
    Name is required.
    </div>
    <button type="submit">Submit</button>
    </form>
  </div>
  `,
})
class AppComponent {
  constructor(private fb: FormBuilder) {}

  mainForm = this.fb.group({
    name: ['', requiredValidator],
  });

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```



### Built-In Validators

Luckily for us, just like [Angular's Pipes](/posts/derived-values), Angular provides some built-in validators for us to use. For example, we can replace our implementation with Angular's built-in `Validators.required` version.

```typescript
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'my-app',
  template: `
  <div>
    <h1>Friend List</h1>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <label>
      Name
      <input type="text" formControlName="name"/>
    </label>


    <div *ngIf="mainForm.touched && mainForm.controls.name.errors?.['required']">
    Name is required.
    </div>
    <button type="submit">Submit</button>
    </form>
  </div>
  `,
})
class AppComponent {
  constructor(private fb: FormBuilder) {}

  mainForm = this.fb.group({
    name: ['', Validators.required],
  });

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

## Vue

React's Formik isn't alone in its ability to allow you to pass a function to validate a user's input. Similar to Formik, `vee-validate` allows you to pass a `rules` parameter that's a function. If the function returns anything other than `true`, it will display the value as the error in the `ErrorMessage` component.

```vue
<!-- FormComp.vue -->
<template>
  <VForm @submit="onSubmit">
    <div>
      <label>
        Name
        <VField name="name" value="" :rules="required" />
      </label>
    </div>
    <div>
      <ErrorMessage name="name" />
    </div>

    <button type="submit">Submit</button>
  </VForm>
</template>

<script setup>
import { ref } from 'vue'
import { Form as VForm, Field as VField, ErrorMessage } from 'vee-validate'

function onSubmit(values) {
  console.log(values)
}
function required(value) {
  // Validation failed!
  if (!value) return 'This field is required'

  // Validation passed!
  return true
}
</script>
```

### Complex Data Schema

Instead of writing our own functions to validate user input, let's instead use a library that can do that validation for us.

[`yup` is a library that allows us to do "schema" based validation](https://github.com/jquense/yup). A schema is simply another way of saying "a set of rules that should be followed". In this case, we want Yup to make sure that the user's inputs match the rules we set up in Yup's validation.

We can then pass that Yup schema into `vee-validate`'s `VForm` `validationSchema` property.

```vue
<!-- FormComp.vue -->
<template>
  <VForm @submit="onSubmit" :validationSchema="formSchema">
    <div>
      <label>
        Name
        <VField name="name" value="" />
      </label>
    </div>
    <div>
      <ErrorMessage name="name" />
    </div>

    <button type="submit">Submit</button>
  </VForm>
</template>

<script setup>
import { ref } from 'vue'
import { Form as VForm, Field as VField, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const formSchema = yup.object().shape({
  name: yup.string().required(),
})

function onSubmit(values) {
  console.log(values)
}
</script>
```

By default, Yup will attempt to figure out the error message it should show based on the schema and the user's input. However, as we mentioned in our React section, we're able to change the error message displayed by Yup with the following:

```javascript
const formSchema = yup.object().shape({
  name: yup.string().required("You must input a name of the user to share with."),
});
```

<!-- ::end:tabs -->

One concept that's introduced with form validation -- especially forms with groups -- is the idea of an object's "shape". You can think of this as the "type" of information an object might contain. For example:

```javascript
const obj1 = {name: "Corbin", id: 2}
const obj2 = {name: "Kevin", id: 3}
```

Would be considered to have the same "shape" since they contain the same keys, and each of the keys contains the same type of value. However, the following objects would have divergent shapes due to differing keys:


```javascript
const obj3 = {name: "Corbin", favFood: "Ice Cream"}
const obj4 = {name: "Kevin", id: 3}
```

Likewise, another concept that's introduced here is the concept of a "schema". A schema is simply a blueprint for how data should be represented.

A schema defines what an object's shape and input values _should_ look like, as opposed to what the user may input.


## Validation Types

Marking a field as required is far from the only type of form validation. While there are any number of items, there

- Minimum string length
- Maximum string length
- Two inputs match each other
- Match a regex

Here's a playground where we demonstrate a form that validates all of those examples:

<!-- ::start:tabs -->

### React

```jsx
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  minLenStr: yup.string().min(3),
  maxLenStr: yup.string().max(3),
  regex: yup.string().matches(/hello|hi/i),
  pass: yup.string(),
  confirm: yup
    .string()
    .oneOf([yup.ref('pass'), null], 'Must match "password" field value'),
});

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Minimum Length String (3)
              <Field type="text" name="minLenStr" />
            </label>
            {errors.minLenStr && <p>{errors.minLenStr}</p>}
          </div>
          <div>
            <label>
              Maximum Length String (3)
              <Field type="text" name="maxLenStr" />
            </label>
            {errors.maxLenStr && <p>{errors.maxLenStr}</p>}
          </div>
          <div>
            <label>
              Regex
              <Field type="text" name="regex" />
            </label>
            {errors.regex && <p>{errors.regex}</p>}
          </div>
          <div>
            <label>
              Password
              <Field type="password" name="pass" />
            </label>
          </div>
          <div>
            <label>
              Password Confirm
              <Field type="password" name="confirm" />
            </label>
            {errors.confirm && <p>{errors.confirm}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

### Angular

```typescript
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

// Angular does not provide a built-in validator for matching two `FormControl` values,
// so we have to build our own
function matchValues(
  matchTo: string
): (AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    // Get "parent" of control, AKA the "form" itself AKA a "FormGroup"
    return !!control.parent &&
      !!control.parent.value &&
      control.value === control.parent.controls[matchTo].value
      ? null
      : { isNotMatching: true };
  };
}

@Component({
  selector: 'my-app',
  template: `
  <div>
    <h1>Friend List</h1>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <div>
      <label>
        Minimum Length String (3)
        <input type="text" formControlName="minLenStr"/>
      </label>
    </div>
    <div *ngIf="mainForm.controls.minLenStr.errors?.minlength">
      Expected a length of at least 3
    </div>
    <div>
      <label>
        Maximum Length String (3)
        <input type="text" formControlName="maxLenStr"/>
      </label>
    </div>
    <div *ngIf="mainForm.controls.maxLenStr.errors?.maxlength">
      Expected a length of at most 3
    </div>
    <div>
      <label>
        Regex
        <input type="text" formControlName="regex"/>
      </label>
    </div>
    <div *ngIf="mainForm.controls.regex.errors?.pattern">
      Expected the input to match the regex: /hello|hi/i
    </div>
    <div>
      <label>
        Password
        <input type="text" formControlName="pass"/>
      </label>
    </div>
    <div>
      <label>
        Password Confirm
        <input type="text" formControlName="confirm"/>
      </label>
    </div>
    <div *ngIf="mainForm.controls.confirm.errors?.isNotMatching">
      Expected password to match confirm
    </div>
    <button type="submit">Submit</button>
    </form>
  </div>
  `,
})
class AppComponent {
  constructor(private fb: FormBuilder) {}

  mainForm = this.fb.group(
    {
      minLenStr: ['', Validators.minLength(3)],
      maxLenStr: ['', Validators.maxLength(3)],
      regex: ['', Validators.pattern(/hello|hi/i)],
      pass: [''],
      confirm: ['', matchValues('pass')],
    },
    { validators: [] }
  );

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

### Vue

```vue
<!-- FormComp.vue -->
<template>
  <VForm @submit="onSubmit" :validationSchema="formSchema">
    <div>
      <label>
        Minimum Length String (3)
        <VField name="minLenStr" value="" />
      </label>
    </div>
    <div>
      <ErrorMessage name="minLenStr" />
    </div>
    <div>
      <label>
        Maximum Length String (3)
        <VField name="maxLenStr" value="" />
      </label>
    </div>
    <div>
      <ErrorMessage name="maxLenStr" />
    </div>
    <div>
      <label>
        Regex
        <VField name="regex" value="" />
      </label>
    </div>
    <div>
      <ErrorMessage name="regex" />
    </div>
    <div>
      <label>
        Password
        <VField name="pass" type="password" value="" />
      </label>
    </div>
    <div>
      <label>
        Password Confirm
        <VField name="confirm" type="password" value="" />
      </label>
    </div>
    <div>
      <ErrorMessage name="confirm" />
    </div>
    <button type="submit">Submit</button>
  </VForm>
</template>

<script setup>
import { ref } from 'vue'
import { Form as VForm, Field as VField, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const formSchema = yup.object().shape({
  minLenStr: yup.string().min(3),
  maxLenStr: yup.string().max(3),
  regex: yup.string().matches(/hello|hi/i),
  pass: yup.string(),
  confirm: yup.string().oneOf([yup.ref('pass'), null], 'Must match "password" field value'),
})

function onSubmit(values) {
  console.log(values)
}
</script>
```

<!-- ::end:tabs -->

## Caution When Validating & Form Building

While validation is inarguably a useful feature for forms, it's important not to be too enthusiastic in our usage of it.

An initial temptation for some might be to use this form validation in order to enforce a minimum length on a user's name. Likewise, others might try to limit a user's name to only include characters from A-Z [using a regex](https://unicorn-utterances.com/posts/the-complete-guide-to-regular-expressions-regex). 

Let's take the minimum length - you might assume that 3 is a reasonable minimum length for a name. But what about [the surname of "He" or "Ho", a common Chinese family name](https://en.wikipedia.org/wiki/He_(surname))? Likewise, if you require only letters from A-Z, you leave out the ability to have [double barrelled last names](https://en.wikipedia.org/wiki/Double-barrelled_name).

This type of problem extends past validation, to be fair.

You'll notice that instead of asking for first name and last name, we instead simply asked for a single name. This is because [some have no surname](https://en.wikipedia.org/wiki/Mononymous_person) or even [two given names](https://en.wikipedia.org/wiki/Given_name#Compound).

Not only is this a matter of validation, but a question of "what data do you truly need"? When sharing a file, do you **need** a distinction between a user's name or username? Likewise, when someone is creating an account, do you **need** their gender? Asking could be uncomfortable if it's private or they are excluded by the limited options.

If you're stuck in deciding if you need data or not, remember that privacy should often win over not. The less data you ask, the better.

Here's some further reading on the topic:

https://www.w3.org/International/questions/qa-personal-names

https://uxdesign.cc/designing-forms-for-gender-diversity-and-inclusion-d8194cf1f51

// TODO: Find more reading on the topic, vet the above



# Non-Text Form Fields

Not all fields in a form are going to be text inputs, however. You might want to introduce a checkbox to the user to make sure they've accepted terms and conditions, have a dropdown of time zones, or have a date picker for the user to input a time.

Just like text inputs, you can combine these input types with validation!

While there are many other types of user input elements, let's focus on just one: Checkboxes.

<!-- ::start:tabs -->

## React

Formik allows you to easily cast a `Field` component to a different `type` to display a different base input UI. This is the same as how the `input` element works.

```jsx
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  termsAndConditions: yup
    .bool()
    .oneOf([true], 'You need to accept the terms and conditions'),
});

const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        termsAndConditions: false,
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Terms and conditions
              <Field type="checkbox" name="termsAndConditions" />
            </label>
            {errors.termsAndConditions && <p>{errors.termsAndConditions}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

Something worth mentioning in terms of validation is how Formik integrates with Yup; we can't simply mark our `termsAndConditions` field as `required`. Instead, we have to tell `yup` that it has to be `oneOf([true])` to enforce the checkbox to be `true`.

## Angular

Since Angular uses the `input` element directly, it's trivial to implement a checkbox without much thought. In addition, our specific use-case of creating a terms and conditions toggle is something that [the built-in validator `requiredTrue`](https://angular.io/api/forms/Validators#requiredtrue) can make trivial.

```typescript
@Component({
  selector: 'my-app',
  template: `
  <div>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <div>
      <label>
        Terms and Conditions
        <input type="checkbox" formControlName="termsAndConditions"/>
      </label>
    </div>
    <div *ngIf="mainForm.controls.termsAndConditions.errors?.required">
      You must accept the terms and conditions
    </div>
    <button type="submit">Submit</button>
    </form>
  </div>
  `,
})
class AppComponent {
  constructor(private fb: FormBuilder) {}

  mainForm = this.fb.group({
    termsAndConditions: ['', Validators.requiredTrue],
  });

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

## Vue

`vee-validate` supports casting a `VField` to a different `input` `type`, just like React's Formik. Luckily for us, usage with `yup` is for checkboxes as simple as adding the `required` validator to Yup's schema shape.

```vue
<!-- FormComp.vue -->
<template>
  <VForm @submit="onSubmit" :validationSchema="formSchema">
    <div>
      <label>
        Terms and Conditions
        <VField name="termsAndConditions" type="checkbox" :value="true" />
      </label>
    </div>
    <div>
      <ErrorMessage name="termsAndConditions" />
    </div>

    <button type="submit">Submit</button>
  </VForm>
</template>

<script setup>
import { Form as VForm, Field as VField, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const formSchema = yup.object().shape({
  termsAndConditions: yup.bool().required('You need to accept the terms and conditions'),
})

function onSubmit(values) {
  console.log(values)
}
</script>
```

<!-- ::end:tabs -->


# Wrapping Up

We've taken a look at various methods of creating forms for React, Angular, and Vue. Each method has its pros and cons, complete with complexity tradeoffs as well.

While our React and Vue code samples have utilized Formik and `vee-validate` respectively, they're far from the only options on the table. I selected them in part due to their similarity and popularity, but some other alternatives might include [FormKit for Vue](https://formkit.com/)  or [React Hook Form](https://react-hook-form.com/).

Similarly, despite using `yup` for both our React and Vue code samples, there exist other libraries that can integrate with Formik and `vee-validate`. [One popular alternative is `zod`](https://github.com/colinhacks/zod), which claims to have better TypeScript usage when compared to `yup`.

Going further, despite our lack of integration with Angular, `yup` (and `zod`) supports Angular as well! There's no reason you couldn't use `yup` to build a custom Angular validator that integrates seamlessly with `@angular/forms`'s `ReactiveForms` module.

In our next chapter, we'll take a look at [Partial DOM Application](/posts/partial-dom-application) using `Fragment`s, `template`s, and `ng-template`s to solve some problems with dynamic HTML.
