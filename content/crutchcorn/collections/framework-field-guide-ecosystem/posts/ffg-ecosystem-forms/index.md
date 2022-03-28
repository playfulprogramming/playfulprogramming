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

## One-way Form Bindings







Using props/events

// TODO: Use file sharing form as an example



<!-- tabs:start -->

### React

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
		<input type="text" onChange={onChange} value={inputText}/>
        <button type="submit">Submit</button>
      </form>
	)
}
```



### Angular

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



### Vue

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

## Two-way form bindings

`v-model`, `[(ngModel)]`



<!-- tabs:start -->

### React

React doesn't have a way to do this



### Angular

If you recall from our earlier introduction to components, Angular's syntax to bind to an attribute or property is `[bindName]`. Similarly, the syntax to bind to a DOM event or component output is `(bindName)`.

Well, if we combine them together, we can sync all of an event's values to and from an Angular variable with a handy shorthand:
```typescript
[(bindName)]
```

> Remember to not flip the `[]` and `()` symbols! It's important to make sure that the square brackets go on the outside of the bind.
>
> Luckily, there's a mnemonic device to remember this operator order - This syntax is colloquially known as a ["banana in a box", even in Angular's source code itself](https://github.com/angular/angular/blob/3ecf93020ce06b9b8621f0c83126cb3d584d4181/packages/compiler/src/render3/r3_template_transform.ts#L41)!

For our simple example of binding a `value`, we can use the `bindName` of `ngModel`, which is standard on most input elements.

```typescript
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

```typescript
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

### Vue

```javascript
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





## Reactive Forms



<!-- tabs:start -->

### React

 Because of React's minimalist API philosophy, React does not have anything equivocal to Angular's reactive forms. Instead, it relies on the ecosystem of libraries to support this functionality.

Luckily, there's a similar tool that's both widely used and highly capable: [Formik](https://formik.org/).

Here's what a basic form might look like in Formik:

```jsx
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

#### `<Formik/>` Component 

This isn't the only way to declare a form, however. 

// TODO

```jsx
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
      render={({ values, handleChange, handleSubmit }) => (
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
    />
  );
};
```



### Angular

First, import the `ReactiveFormsModule`

```typescript
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

Then, we can create a new `FormControl` to assign a value:

```typescript
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

We can even manually update the value of the `FormControl` from JavaScript:

```typescript
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

#### Form Groups

However, this doesn't truly demonstrate the full power of reactive forms. Namely, when there are multiple inputs, your `form` can act as the source of truth:

```typescript
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

#### Form Builder

You're also able to utilize a shorthand provided by Angular to remove duplicate calls to `FormControl`

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
    favoriteFood: '',
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(e) {
    e.preventDefault();
    console.log(this.mainForm.value);
  }
}
```

> Under the hood, this uses Angular's [Dependency Injection system, which we'll touch on in a future chapter.](// TODO: Add link)

### Vue

// TODO

While Vue has a large home-grown ecosystem of tools, Vue does not have an official complex form library. Luckily for us, [`vee-validate` aims to be a good fit for any form requirements our Vue apps may have](https://github.com/logaretm/vee-validate). 

Here's a simple form using `vee-validate`:

```javascript
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
  components: {
    VForm: VeeValidate.Form,
    VField: VeeValidate.Field,
    ErrorMessage: VeeValidate.ErrorMessage,
  },
  methods: {
    onSubmit(values) {
      console.log(values);
    }
  }
}
```

<!-- tabs:end -->



We're using Formik v2 and `vee-validate` v4.



### Arrays

// TODO: Complete this section

- [Formik `<FieldArray>`](https://formik.org/docs/api/fieldarray)
- [Angular FormArray](https://angular.io/guide/reactive-forms#creating-dynamic-forms)
- [Vee-validate FieldArray](https://vee-validate.logaretm.com/v4/examples/array-fields)



<!-- tabs:start -->

#### React

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
      render={({ values }) => (
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
    />
  </div>
);
```

A limitation of Formik is that we **must use the `<Formik>` component in order to use `<FieldArray>`**. This is because of underlying implementation details that [rely on React's Dependency Injection (which we'll touch on in a future chapter)](// TODO: Add link).

#### Angular

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



#### Vue

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









### Validation

// TODO: Talk about form validators





<!-- tabs:start -->

#### React

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
          {errors.name && <div>{errors.name}</div>}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
```

#### Angular

// TODO

#### Vue

// TODO

<!-- tabs:end -->





-----



Forms

- ngModel/Angular
  - Angular Forms
- One way binding/React
- v-model/Vue
