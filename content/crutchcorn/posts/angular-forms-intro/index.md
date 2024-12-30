---
{
    title: "Intro to Angular Forms",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["angular", "javascript", "webdev"]
}
---

// TODO: Write

# One-way Form Bindings

One common and easy way to assign a value to form elements - like a text input - is to simply listen for value changes (using events) on the element and assign those changes back to a bound input value.

```angular-ts
@Component({
	selector: 'form-comp',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    <form (submit)="onSubmit($event)">
	  	<input type="text" (change)="onChange($event)" [value]="usersName"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
	usersName = '';

	onChange(e: Event) {
		const input = e.target as HTMLInputElement;
		this.usersName = input.value;
	}

	onSubmit(e: Event) {
		e.preventDefault();
		console.log(this.usersName);
	}
}
```

// TODO: add iframe for one-way-form-binding-1

While this works as-is, it can get complex when too many inputs are present. For each input, you need:

- A function to listen for changes and bind them to the value
- A variable to assign the data to
- Rebind said data back to the input

Let's try to simplify this by removing the first step.

# Two-way form bindings

One method for removing the input change listener is by using two-way variable bindings. By using this, you don't need to assign a function for change listening. Simply pass a variable and watch the value change as you type!

If you recall from earlier, Angular's syntax to bind to an attribute or property is `[bindName]`. Similarly, the syntax to bind to a DOM event or component output is `(bindName)`.

Well, if we combine them together, we can sync all of an event's values to and from an Angular variable with a handy shorthand:
```typescript
[(bindName)]
```

> Remember to not flip the `[]` and `()` symbols! It's important to make sure that the square brackets go on the outside of the bind.
>
> Luckily, there's a mnemonic device to remember this operator order - This syntax is colloquially known as a ["banana in a box", even in Angular's source code itself](https://github.com/angular/angular/blob/f8d22a9ba4e426f14f9c7fd608e1ad752cd44eb5/packages/compiler/src/render3/r3_template_transform.ts#L50)!

For our simple example of binding a `value`, we can use the `bindName` of `ngModel`, which is standard on most input elements through the `FromsModule`:

```angular-ts {4,10}
import {FormsModule} from "@angular/forms";

@Component({
	selector: 'form-comp',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule],
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

> Don't forget to add `FormsModule` to the `imports` array in your component. If you forget it, you'll see the following error:
>
> ```shell
> ✘ [ERROR] NG8002: Can't bind to 'ngModel' since it isn't a known property of 'input'. [plugin angular-compiler]
> 
>     src/main.ts:15:22:
>       15 │     <input type="text" [(ngModel)]="usersName" name="input"/>
>          ╵                        ~~~~~~~~~~~~~~~~~~~~~~~
> ```

While these methods of two-way binding help mitigate some problems, there's still one big problem: Your data is no longer consolidated. This means that if you submit a form and want to, say, pass the form's data to your server, you'll need to:

- Create a new object
- Make sure you pass all subkeys of the object

While this works for simple examples like ours, it quickly gets unwieldy and easy to introduce bugs within at a larger scale.

There's a better way.

# Reactive Forms

Reactive forms are a way for you to keep all of your form data inside of a single variable when it comes time to submit a form. There are also multiple enhancements to this method, such as data validation and array handling.

As opposed to the other frameworks, which require utilizing an external library for reactive forms, Angular has them baked in as a priority feature of the framework.

To utilize them, we first need to import the `ReactiveFormsModule`, which allows us to have a more fully-featured API as opposed to `FormsModule`'s `[(ngModel)]`.

Now, we can create a new instance of a class called `FormControl` to act as a form item that we can then bind to a `[formControl]` in order to have two-way event and value input sync. 

```angular-ts {0,6,12}
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
	selector: 'form-comp',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule],
	template: `
    <form (submit)="onSubmit($event)">
	  <input type="text" [formControl]="nameControl"/>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class FormComponent {
	nameControl = new FormControl('');

	onSubmit(e: Event) {
		e.preventDefault();
		console.log(this.nameControl.value);
	}
}
```

We aren't simply bound to input events to update this value, however; we can even manually update the value of the `FormControl` from JavaScript-land:

```angular-ts {14}
@Component({
  selector: 'form-comp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
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

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.nameControl.value);
  }
}
```

// TODO: add iframe for reactive-forms-3

### Form Groups

While a basic `FormControl` creation is useful for demonstration purposes, it doesn't truly demonstrate the full power of reactive forms. Namely, when there are multiple inputs, your `form` can act as the source of truth through a new `FormGroup` class instance:

```angular-ts {0,5,9,23-26,30}
import {ReactiveFormsModule,  FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'form-comp',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule],
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

	onSubmit(e: Event) {
		e.preventDefault();
		console.log(this.mainForm.value);
	}
}
```

// TODO: Add iframe for form-groups-4

### Form Builder

You're also able to utilize a shorthand `fb` provided by Angular to remove duplicate calls to `FormControl` and `FormGroup`, respectively.

```angular-ts
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

```angular-ts
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

## Angular

Instead of a dedicated component for rendering lists like with React's Formik, Angular allows you to simply `ngFor` and use `formGroupName` in association with `formArrayName` and `formControlName` to access the specific `FormControl` and `FormGroup` for a user's information.

```angular-ts
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

Because we're now using an array, we need a unique ID for each user. This is why, for each implementation, there's an `id` field. We then use this `id` field to identify which user is which to the framework, [just like we've done before for loops in HTML](/posts/dynamic-html).



# Form Validation {#form-validation}

After adding in form arrays to your share dialog, you sit down, ready to work on the next task. Suddenly, an email slides in from your issues tracker: Dang it - you missed a requirement.

Namely, we need to make sure that the user has actually typed in the user's name before moving forward.

Let's see if we can't mark the name field as "required" and show an error when the user tries to submit a form without inputting a name.

> To focus on form validation, let's temporarily remove the array requirement and limit our scope just to the form validation.

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

```angular-ts
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

```angular-ts
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


## Validation Types

Marking a field as required is far from the only type of form validation. While there are any number of items, there

- Minimum string length
- Maximum string length
- Two inputs match each other
- Match a regex

Here's a playground where we demonstrate a form that validates all of those examples:

```angular-ts
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

# Non-Text Form Fields

Not all fields in a form are going to be text inputs, however. You might want to introduce a checkbox to the user to make sure they've accepted terms and conditions, have a dropdown of time zones, or have a date picker for the user to input a time.

Just like text inputs, you can combine these input types with validation!

While there are many other types of user input elements, let's focus on just one: Checkboxes.

Since Angular uses the `input` element directly, it's trivial to implement a checkbox without much thought. In addition, our specific use-case of creating a terms and conditions toggle is something that [the built-in validator `requiredTrue`](https://angular.io/api/forms/Validators#requiredtrue) can make trivial.

```angular-ts
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
