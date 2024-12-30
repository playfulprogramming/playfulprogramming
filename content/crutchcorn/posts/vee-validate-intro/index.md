---
{
    title: "Intro to VeeValidate",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["vue", "javascript", "webdev"]
}
---

One of the most common types of front-end applications that I've seen in my career can be classified as some form of "Form wrapper". Whether it's a payment form, a user-submitted tracking form, or anything of the like - these pages exist in almost every app I've ever seen.

What's more, even in less obvious "form wrapper" style pages, you'll always need a way to track a user's input for usage in some kind of processing.

To do this, React, Angular, and Vue all have a few tools at their disposal.

We've been working on a files app up to this point in a fairly simplistic manner of getting files listed for the user. However, many modern file apps (such as Dropbox and Google Drive) allow you to share files with others.

Let's create a form that the user can fill out to add a new user to their existing files.

# One-way Form Bindings

One common and easy way to assign a value to form elements - like a text input - is to simply listen for value changes (using events) on the element and assign those changes back to a bound input value.

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

While this works as-is, it can get complex when too many inputs are present. For each input, you need:

- A function to listen for changes and bind them to the value
- A variable to assign the data to
- Rebind said data back to the input

Let's try to simplify this by removing the first step.

# Two-way form bindings

One method for removing the input change listener is by using two-way variable bindings. When your framework supports this, you don't need to assign a function for change listening. Simply pass a variable and watch the value change as you type!

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

While these methods of two-way binding help mitigate some problems, there's still one big problem: Your data is no longer consolidated. This means that if you submit a form and want to, say, pass the form's data to your server, you'll need to:

- Create a new object
- Make sure you pass all subkeys of the object

While this works for simple examples like ours, it quickly gets unwieldy and easy to introduce bugs within at a larger scale.

There's a better way.

# Reactive Forms

Reactive forms are a way for you to keep all of your form data inside of a single variable when it comes time to submit a form. There are also multiple enhancements to this method, such as data validation and array handling.

Let's take a look at how we can use reactive forms in our frameworks, then touch on the additional features afterward.

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

Because we're now using an array, we need a unique ID for each user. This is why, for each implementation, there's an `id` field. We then use this `id` field to identify which user is which to the framework, [just like we've done before for loops in HTML](/posts/dynamic-html).

# Form Validation {#form-validation}

After adding in form arrays to your share dialog, you sit down, ready to work on the next task. Suddenly, an email slides in from your issues tracker: Dang it - you missed a requirement.

Namely, we need to make sure that the user has actually typed in the user's name before moving forward.

Let's see if we can't mark the name field as "required" and show an error when the user tries to submit a form without inputting a name.

> To focus on form validation, let's temporarily remove the array requirement and limit our scope just to the form validation.

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

# Non-Text Form Fields

Not all fields in a form are going to be text inputs, however. You might want to introduce a checkbox to the user to make sure they've accepted terms and conditions, have a dropdown of time zones, or have a date picker for the user to input a time.

Just like text inputs, you can combine these input types with validation!

While there are many other types of user input elements, let's focus on just one: Checkboxes.

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
