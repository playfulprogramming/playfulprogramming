---
{
    title: "Forms",
    description: "Forms are a core part of any application. Even when a single input, it can be tricky to manage where the state should live. Let's learn how to do so with React, Angular, and Vue.",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 1
}
---

One of the most common types of front-end applications that I've seen in my career can be classified as some form of "Form wrapper". Whether it's a payment form, a user submitted tracking form, or anything of the like - these pages exist in almost every app I've ever seen.

What's more, even in less obvious "form wrapper" style pages, you'll always need a way to track a user's input for usage in some kind of processing.

To do this, React, Angular, and Vue have a few tools at their disposal.

We've been working on a files app up to this point in a fairly simplistic manner of getting files listed for the user. However, many modern file apps (such as Dropbox and Google Drive) allow you to share files with others.

Let's create a form that the user can fill out to add a new user to their existing files.

# One-way Form Bindings

One common and easy way to assign a value to form elements - like a text input - is to simply listen for value changes (using events) on the element and assign those changes back to a bound input value.

<!-- tabs:start -->

## React

```jsx
const FormComp = () => {
  const [inputText, setInputText] = React.useState("");

  const onChange = (e) => {
    setInputText(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(inputText);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={onChange} value={inputText} />
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
	  	<input type="text" (change)="onChange($event)" [value]="inputText"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  inputText = '';

  onChange(e: { target: HTMLInputElement }) {
    this.inputText = e.target.value;
  }

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.inputText);
  }
}
```

## Vue

```javascript
const FormComp = {
  template: `
  <form @submit="onSubmit($event)">
    <input type="text" @change="onChange($event)" :value="inputText"/>
    <button type="submit">Submit</button>
  </form>
  `,
  data() {
    return {
      inputText: '',
    };
  },
  methods: {
    onChange(e) {
      this.inputText = e.target.value;
    },
    onSubmit(e) {
      e.preventDefault();
      console.log(this.inputText);
    },
  },
};
```

<!-- tabs:end -->



While this works as-is, it can get complex when too many inputs are present. For each input you need:

- A function to listen for changes and bind them to the value
- A variable to assign the data to
- Rebind said data back to the input

Let's try to simplify this by removing the first step.

# Two-way form bindings

One method for removing the function to listen for changes is by using the given framework's input variable two-way bindings. When the framework supports this, you don't need to assign a function for change listening. Simply pass a variable and watch the value change as you type!

<!-- tabs:start -->

## React

React doesn't have a way to do this and generally regard it as an anti-pattern even if it were possible. The reason they consider it an anti-pattern is because they strongly encourage utilizing [unidirectional data-flow instead, which we'll learn about in a future chapter](// TODO: Add). The React team (and ecosystem) tend to prefer you stick to event bindings instead of a two-way form bind.

However, we'll touch on another method of form binding that should be helpful to address the verbosity of that method soon.

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
	  <input type="text" [(ngModel)]="inputText" name="input"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  inputText = '';

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.inputText);
  }
}
```

However, when you first use this, you may run into an error:

> Type 'Event' is not assignable to type 'string'.

This is because we need to import the `FormsModule` in our closest `NgModel` to use `ngModel` bindings

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

```javascript {3,9}
const FormComp = {
  template: `
  <form @submit="onSubmit($event)">
    <input type="text" v-model="inputText"/>
    <button type="submit">Submit</button>
  </form>
  `,
  data() {
    return {
      inputText: '',
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log(this.inputText);
    },
  },
};
```

<!-- tabs:end -->

While these methods of two-way binding help mitigate some problems, there's still one big problem: Your data is no longer consolidated. This means that if you submit a form and want to, say, pass the form's data to your server, you'll need to:

- Create a new object
- Make sure you pass all subkeys of the object

While this works for simple examples like ours, it quickly gets unweildy and easy to introduce bugs within at a larger scale.

There's a better way.

# Reactive Forms

Reactive forms are a way for you to keep all of your form data inside of a single variable when it comes time to submit a form. There are also multiple enhancements to this method, such as data validation and array handling.

Let's take a look at how we can use reactive forms in our framworks, then touch on the additional features afterwards.

<!-- tabs:start -->

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
      favoriteFood: "",
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
          Favorite food
          <input
            type="text"
            name="favoriteFood"
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
        favoriteFood: "",
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
              Favorite food
              <input
                type="text"
                name="favoriteFood"
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

This component isn't just useful as an alternative API, however - it also enabled us to use functionality like Formik's built in `Form` and `Field` components, which allows us to remove the `onSubmit` and `onChange` method passing for a more terse API.

```jsx {12,16,22,26}
const FormComponent = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        favoriteFood: '',
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
              Favorite food
              <Field type="text" name="favoriteFood" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

> Keep in mind, the `Field` and `Form` components will not work when using `useFormik`. Instead, you'd have to pass `onChange` and `onSubmit` respectively to `input` and `form` HTML elements as we demonstrated before.

> We are currently using version 2 of Formik. Inevitably, its API will change and this section will be out-of-date, but the core concepts at play likely will not change very much.

## Angular

As opposed to the other two frameworks, which require utilizing an external library for reactive forms, Angular has them baked in as a priority feature of the framework.

To utilize them, we first need to import the `ReactiveFormsModule`, which allows us to have a more fully featured API as opposed to `FormsModule`'s `[(ngModel)]`.

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

Now, we can create a new instance of a class called `FormControl` to act as an form item that we can then bind to a `[formControl]` in order to have two-way event and value input sync. 

```typescript {0,6,12}
import { FormControl } from '@angular/forms';

@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)">
	  <input type="text" [formControl]="inputControl"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  inputControl = new FormControl('');

  onSubmit(e) {
    e.preventDefault();
    console.log(this.inputControl.value);
  }
}
```

We aren't simply bound to input events to update this value, however; we can even manually update the value of the `FormControl` from JavaScript-land:

```typescript {14}
@Component({
  selector: 'form-comp',
  template: `
    <form (submit)="onSubmit($event)">
      <input type="text" [formControl]="inputControl"/>
      <button type="button" (click)="setControlToMessage()">Set to "Hello"</button>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  inputControl = new FormControl('');

  setControlToMessage() {
    this.inputControl.patchValue('Hello, world');
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.inputControl.value);
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
        Favorite food
        <input type="text" formControlName="favoriteFood"/>
      </label>
    </div>
    <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
  mainForm = new FormGroup({
    name: new FormControl(''),
    favoriteFood: new FormControl(''),
  });

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

### Form Builder

You're also able to utilize a shorthand `fb` provided by Angular to remove duplicate calls to `FormControl` and `FormGroup` respectively.

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
        Favorite food
        <input type="text" formControlName="favoriteFood"/>
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
    favoriteFood: [''],
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

```javascript
import {Form, Field, ErrorMessage} from 'vee-validate';

const FormComponent = {
  template: `
    <v-form @submit="onSubmit">
      <div>
        <label>
          Name
          <v-field name="name" value=""></v-field> 
        </label>
      </div>

      <div>
        <label>
          Favorite food
          <v-field name="favoriteFood" value=""></v-field> 
        </label>
      </div>
      <button type="submit">Submit</button>
    </v-form>
`,
  // We're importing these forms under a different name due to conflicts
  // with the browser's built in `form` and `field` elements
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    onSubmit(values) {
      console.log(values);
    }
  }
}
```

> We are currently using version 4 of `vee-validate`. Inevitably, its API will change and this section will be out-of-date, but the core concepts at play likely will not change very much.

<!-- tabs:end -->

## Input States {#input-states}

As we mentioned earlier, reactive forms have more features than the simple two-way (or even one-way) input binding!

One of the features that's added with reactive forms is the concept of an input's state. An input can have many different states:

- "Touched" - When the user has interacted with a given field, even if they haven't input anything
  - Clicking on input
  - Tabbing through an input
  - Typing data into input
- "Pristine" - User has not yet input data into the field
  - Comes before "touching" said field if the user has not interacted with it any way
  - Comes between "touched" and "dirty" when the user has "touched" the field but has not put data in
- "Dirty"  - When the user has input data into the field
  - Comes after "touching" said field
  - Opposite of "pristine"
- "Disabled" - Inputs that the user should not be able to add values into

While some of these states are mutually exclusive, an input may have more than one of these states active at a time. For example, a field that the user has typed into has both "dirty" and "touched" states applied at the same time.

These states can then be used to apply different styling or logic on each of the input's associated elements. For example, a field that is `required && touched && pristine`, meaning that the user has clicked on the field, not input data into the field, but the field requires a user's input. In this instance, an implementation might show a `"This field is required"` error message.

> The method of displaying this error message is part of a much larger discussion of [field validation, which we'll touch on in a different section in this chapter](#form-validation).

In addition to the form's fields having these possible states applied, many of them apply to the `form` itself.

For example, when the user "touches" a field for the first time, they're also "touching" the form itself. You can use this information to do something like:

```javascript
// This is psuedocode and likely won't work with any framework unconfigured
if (!form.touched) {
	alert("You must put data into the form first!")
    return;
}
```

In addition to the existing field states, a form may also contain the following states:

- "Submitted" - When the user has submitted a form
- "Pending" - When a user has submitted a form while the form is currently doing something
  - Comes after "submitted"
  - Submitting data to the server

Here's an interactive playground that you can use to play around with each of the different input states.



<!-- tabs:start -->

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
        favoriteFood: '',
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
              <Field type="text" name="other" disabled />
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
        <input type="text" [disabled]="true" formControlName="disabled"/>
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
    disabled: [{ value: '', disabled: true }],
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

`vee-validate` exposes the `touched` and `dirty` fields via a `v-slot` associated with each `v-field` as well as each `v-form`. A side effect of this exposing method, however, is that you now must `v-bind` an `input` inside of the `v-field` where we did not have to do so earlier.

```javascript
const FormComponent = {
  template: `
    <v-form @submit="onSubmit" v-slot="{ meta }">
      <div>
        <label>
          Name
          <v-field name="name" value=""  v-slot="{ field, meta }">
            <input v-bind="field" />
            <p v-if="meta.dirty">Field is dirty</p>
            <p v-if="meta.touched">Field has been touched</p>
            <p v-if="!meta.dirty">Field is pristine</p>
          </v-field> 
        </label>
      </div>

      <div>
        <label>
          Disabled field
          <v-field disabled name="disabled" value=""></v-field> 
        </label>
      </div>
      <p v-if="meta.dirty">Form is dirty</p>
      <p v-if="!meta.dirty">Form is pristine</p>
      <p v-if="meta.touched">Form has been touched</p>
      <p v-if="submitted">Form submitted</p>
      <p v-if="pending">Form is pending</p>
      <button type="submit">Submit</button>
    </v-form>
`,
  components: {
    VForm: Form,
    VField: Field,
  },
  data() {
    return {
      pending: false,
      submitted: false,
    };
  },
  methods: {
    onSubmit(values) {
      this.submitted = true;
      this.pending = true;
      this.sendToServer(values).then(() => {
        this.pending = false;
      });
    },
    // Pretend this is calling to a server
    sendToServer(formData) {
      // Wait 4 seconds, then resolve promise
      return new Promise((resolve) => setTimeout(() => resolve(0), 4000));
    },
  },
};
```

> You may notice that `vee-validate`'s `dirty` only seems to be `true` when the form actively has data inside of it. This differs in behavior from the other frameworks and is worth noting.

<!-- tabs:end -->

### 





Additional to form states, a reactive form also adds in the following features into a form: 

- Form groups - A collection of fields (or sub-fields) that create a grouping
- [Form arrays](#form-arrays) - A collection of fields in a list
- [Validation - making sure an input's value aligns to a set of rules.](#form-validation)
	- "Is input a valid email"
	- Required fits into this category



































# Form Arrays {#form-arrays}

// TODO: Complete this section



<!-- tabs:start -->

## React

// TODO

```jsx
import { Formik, Form, Field, FieldArray } from "formik";

let id = 0;

export const FriendList = () => (
  <div>
    <h1>Friend List</h1>
    <Formik
      initialValues={{ users: [] }}
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

A limitation of Formik is that we **must use the `<Formik>` component in order to use `<FieldArray>`**. This is because of underlying implementation details that [rely on React's Dependency Injection (which we'll touch on in a future chapter)](// TODO: Add link).

## Angular

// TODO

```typescript
@Component({
  selector: 'my-app',
  template: `
  <div>
    <h1>Friend List</h1>
    <form (submit)="onSubmit($event)" [formGroup]="mainForm">
    <ng-container formArrayName="users">
    <div *ngFor="let item of arr.controls; let i = index;" [formGroupName]="i">
        <label>
          Name
          <input type="text" formControlName="name"/>
        </label>
        <button type="button" (click)="removeUser(i)">Remove User</button>
    </div>
    </ng-container>
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
    users: this.fb.array([this.fb.group({ id: ++this.id, name: '' })]),
  });

  addUser() {
    this.arr.push(
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

// TODO

```javascript
const FormComponent = {
  template: `
  <div>
    <h1>Friend List</h1>
    <v-form @submit="onSubmit" :initial-values="initialValues">
      <field-array name="users" key-path="id" v-slot="{fields, push, remove }">
      <div v-for="(field, idx) in fields" :key="field.key">
        <label>
          Name
          <v-field :name="'users[' + idx + '].name'"></v-field> 
        </label>
        <button type="button" @click="remove(idx)">Remove User</button>
      </div>
      <button type="button" @click="push({name: '', id: ++id})">Add User</button>
      </field-array>
      <button type="submit">Submit</button>
    </v-form>
  </div>
`,
  components: {
    VForm: VeeValidate.Form,
    VField: VeeValidate.Field,
    FieldArray: VeeValidate.FieldArray,
    ErrorMessage: VeeValidate.ErrorMessage,
  },
  methods: {
    onSubmit(values) {
      console.log(values);
    }
  },
  data: {
      return {
    	id: 1,
      	initialValues: {users: [{name: "Test", id: 0}]}
	  }
  }
}
```

You may notice the `v-slot`. It's a bit confusing, but think of this as properties being passed to `field-array` from `v-form`. 

[We'll touch on `v-slot` usage in the near future.](// TODO: Add link)

Notice our usage of `key-path` // TODO:

<!-- tabs:end -->









# Form Validation {#form-validation}

// TODO: Talk about form validators





<!-- tabs:start -->

## React

// TODO

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



// TODO Usage with `yup`



## Angular

// TODO

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

// TODO

```typescript
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

// TODO

<!-- tabs:end -->


# Non-Text Form Fields

Not all fields in a form are going to be text inputs, however. While there are many other types of user input elements, let's focus on just two:

1) User Select Dropdowns
2) User Radio Buttons

// TODO:

-----



Forms

- ngModel/Angular
  - Angular Forms
- One way binding/React
- v-model/Vue
