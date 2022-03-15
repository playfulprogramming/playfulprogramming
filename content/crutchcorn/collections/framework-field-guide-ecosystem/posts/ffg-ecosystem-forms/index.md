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

 

// TODO



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



<!-- tabs:end -->



Formik

https://github.com/logaretm/vee-validate



### Arrays

// TODO: Complete this section

- [Formik `<FieldArray>`](https://formik.org/docs/api/fieldarray)
- [Angular FormArray](https://angular.io/guide/reactive-forms#creating-dynamic-forms)
- [Vee-validate FieldArray](https://vee-validate.logaretm.com/v4/examples/array-fields)

### Validation

// TODO: Talk about form validators





-----



Forms

- ngModel/Angular
  - Angular Forms
- One way binding/React
- v-model/Vue
