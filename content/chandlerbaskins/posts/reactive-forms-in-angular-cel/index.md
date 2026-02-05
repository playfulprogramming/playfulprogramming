---
{
title: "Reactive Forms in Angular",
published: "2021-08-26T13:43:08Z",
edited: "2021-08-27T17:49:29Z",
tags: ["angular"],
description: "Photo by SIMON LEE on Unsplash           Forms can be complicated   Seriously. I feel like the days...",
originalLink: "https://dev.to/this-is-angular/reactive-forms-in-angular-cel",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Photo by <a href="https://unsplash.com/@simonppt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">SIMON LEE</a> on Unsplash*

## Forms can be complicated

Seriously. I feel like the days of wysiwig forms are over. Long gone are the days where we have our HTML form and then do a post back to the server with our form data. These days we need to do real time validation like is this username taken. Or we need to have dynamic forms like a Registration form where we can select how many people to register and the fields populate based on our response. This is powerful stuff. This becomes a form that is driven by the user. Kinda like a RPG, no two users may have the same experience and the form populates according to their responses or actions. But with better UX comes more complications for the developer. Thankfully Angular being the kitchen that it is serves us up something tasty for building these complicated forms. Reactive Forms.

## Reactive Forms

Per the wonderful documentation

> Reactive forms provide a model-driven approach to handling form inputs whose values change over time. Reactive forms are built around observable streams, where form inputs and values are provided as streams of input values, which can be accessed synchronously.

I love these model driven approaches and I love RxJS so I usually feel right at home here. One question I asked was how do I represent that model in my code and how does that translate to the HTML that renders the controls (inputs,radios,selects) on the screen? Well as a basic building block Angular, provides us with Abstract Control <https://angular.io/api/forms/AbstractControl>. This is the Base class that  the Reactive Forms API builds on top of. This  class contains properties and methods for handling the value of your form control as well as validation and form state (dirty, pristine, valid, invalid). A building block built on top of this is the Form Control <https://angular.io/api/forms/FormControl#formcontrol>. This is our basic building block to create a single form control. For example

```tsx
// in your component
const firstNameControl = new FormControl({value: 'any init value or null', disabled: false},[Validators.required],[myCustomAsyncValidator])
```

Now instantiating this class takes three arguments. The first is a seed value which can be a config  object or just an init value, second an array of  or a single synchronous validator(here I'm using a buiilt in validator for requiring), and third an array or single async validator that is a custom validator.  You can also pass in a config object here as well with properties for both kinds of validators.  Now to bind this to a HTML element we need to bridge the gap from the template to the class. We do this with a directive that ReactiveForms provides called `formControl` we'd use it like this

```html
<label for="name">First Name: </label>
<input id="name" type="text" [formControl]="firstNameControl">
```

Now usually we don't just don't have single controls. Usually forms are made up of multiple inputs for a user to fill out. Thankfully Angular provides us a way to group controls with FormGroup. From the docs

> A form group defines a form with a fixed set of controls that you can manage together. Form group basics are discussed in this section. You can also nest form groups to create more complex forms.

An example of a FormGroup would be

```tsx
profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });
```

Here we instantiate the FormGroup class and give it an object whos keys are the names of our formControls and whos value is the FormControl class itself. This makes it easy for us if we need to check for validity as a whole (you have to fill out the whole form before you submit). The AbstractControl class also has  a method that allows us to query for a child control. We can do this like so

```tsx
const firstNameControl = this.profileForm.get('firstName');
```

Honestly AbstractControl could have a whole article written on it, Definitely helps having a good understanding on it and the API Reference is a great place to start.

Now to bind to this form group in our template we will use the formGroup directive.

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="first.invalid"> Name is too short. </div>

      <input formControlName="first" placeholder="First name">
      <input formControlName="last" placeholder="Last name">

      <button type="submit">Submit</button>
   </form>
```

Now here you may notice for our individual controls we are using `formControlName` Because our controls are linked to a FormGroup and are not class members `formControl` would not be able to find them. Remember  the \[] in Angular is for property bindings. formControlName is smart enough to know that it's in a formGroup and will attempt to find the control from that group.  There are  directives that will sync nested Form Types (Array,Control,Group). You can find the API Summary here <https://angular.io/guide/reactive-forms#reactive-forms-api-summary>.

## Dynamic Forms and Form Array

Dynamic forms are one of the coolest user experiences you can have on the web. Selecting this option populates more form fields while selecting this option takes you to the end of the form. It makes things feel like a living  interaction. Angular provides us with FormArray <https://angular.io/api/forms/FormArray>. You can also use  FormGroup and add controls to it dynamically but the benefit that FormArray provides is that the controls are unnamed. This is also useful for pushing in FormGroups and allows for complicated nesting to be easier for us because FormArray comes with methods like push, insert, removeAt etc... that are similar APIs that we are already familar with when working with Javascript Arrays.

If we take a registration form for example we may have setup our form model to look something like this

```tsx
registrationForm = new FormGroup({
    employees: new FormArray([this.newEmployee()])
  });

  addEmployee() {
    this.employees.push(this.newEmployee());
  }

  newEmployee() {
    return new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required)
    });
  }
  get employees() {
    return this.registrationForm.get('employees') as FormArray;
  }
  submit() {
    console.log(this.employees.controls[0].value);
  }
```

Here we have a newEmployee method that is just a factory function returning a FormGroup class. I put this in a method because it's nice having a config in one place instead of having it initialized in the registrationForm declaration and then when we add a new employee. Any time we want to add a new employee we simply call this method. I also initialized our Form Group with a new Form Array that call athis method so we have one group for a new employee. I added a getter for convenient access to the Form Array.

```html
<form (ngSubmit)="submit()" [formGroup]="registrationForm">
  <section class="employees" formArrayName="employees">
    <ng-container *ngFor="let employee of employees.controls; let i = index;">
      <div class="employee" [formGroupName]="i">
        <input class="input"  formControlName="firstname" type="text">
        <input class="input" formControlName="lastname" type="text">
        <input class="input"  formControlName="jobTitle" type="text">
      </div>
    </ng-container>
  </section>
  <button type="submit">SUBMIT</button>
</form>
<button (click)="addEmployee()">Add Employee</button>
```

Here we have our mark up and directives for rendering the form and connecting it with our model. To start we use the `form` element and bind the group to it. Next we access the employees Form Array using the `formArrayName` directive. This directive is smart enough to look into the object and grab us the form array with that name. Next we iterate over the array outputting our form group. Since these controls are unnamed we bind to them using the index of the array we iterated over and use the `formGroupName` directive and compute it's value. Lastly we bind to the controls of the `formGroup` using `formControlName` This setup allows us to add new controls but what if we wanted to remove them? Well FromArray offers us a `removeAt` method  that needs the index of the item we want to remove. You don't want to modify the array that was used to instantiate the form array directly as strange behavior can occur.

## Adding and Removing Controls based on input

This one gets kinda fun because your listening for user input and then doing something with. Fundamentally it's similar to reacting to button clicks to add more controls or remove them. Instead of listening to click events we listen to user inputs and we can do that using the `valueChanges`  property from the Abstract Control class. ` valueChanges` is a multicasting observable that emits an event every time the value of the control changes, in the UI or programmatically. This means calling set or patch value will cause an emission unless you pass `{emitEvent:false}`

So the recipe here would be listening for input and then using that input to add or remove controls based on that input.

```tsx
control.valueChanges.subscribe(value => {
	if(value === 'whatever') {
		this.addNewEmployee()
	}
})
```

Here we are checking if the value meets a condition and then calling a method that ends up pushing more controls into the form array. This is one way to do it and a straightforward one because our template is already iterating over the Form Array so we have nothing left to do on our end. If we were just adding a new control to the whole group there is a `addControl` method that we would use. Then we would need to set up the template to look for a form control with that name and only show the elements if the control exists.
