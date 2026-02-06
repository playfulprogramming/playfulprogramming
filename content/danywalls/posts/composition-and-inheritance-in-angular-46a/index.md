---
{
title: "Composition and inheritance in Angular",
published: "2022-02-20T16:29:00Z",
edited: "2022-09-02T14:13:33Z",
tags: ["angular", "typescript", "javascript", "webdev"],
description: "When we start to build the application and feel the code duplicated are in several places, our first...",
originalLink: "https://www.danywalls.com/composition-and-inheritance-in-angular-1",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

When we start to build the application and feel the code duplicated are in several places, our first idea is `inheritance`, because it solves our problem with repetitive code.

It appears as a solution (and it's) and works. But the problem comes when we feel the over-dependencies in the constructor to the base class, or send values to something not related to our class because the inheritance forces us.

> The example is focused on forms, but the idea shows the problem of being careful with inheritance in components.

## The case

We work for 'this\_is\_angular' and decided to build a page with a newsletter form. Looks easy, We create the `NewsLetterComponent`, inject form builder, and create two methods to show the errors and save.

> The final live example is <https://stackblitz.com/edit/angular-ivy-a4adjr>.

Our newsletter components looks like:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
})
export class NewsletterComponent implements OnInit {
  errors = [];
  newsLetterForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}

  save() {
    if (!this.newsLetterForm.valid) {
      this.showErrors();
    } else {
      this.errors = [];
      console.log('saving data')
    }
  }

  showErrors() {
    const emailError = this.newsLetterForm.get('email').errors;
    console.log(emailError);
    Object.keys(emailError).forEach((value) => {
      this.errors = [...value];
    });
  }
}

```

And the template like:

```html
<form [formGroup]="newsLetterForm" (ngSubmit)="save()">
  <h1>Newsletter</h1>
  <input type="text" formControlName="email" />
  <button>Save</button>
  <span *ngFor="let error of errors">{{error}}</span>
</form>
```

One week later, we require another form. The waiting list component is closely similar to the newsletter form, save the email, show errors, and send the data.

We create another form with the same behavior one form, one validation, and a submit.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
})
export class WaitingListComponent  {
  errors = [];
  waitingListForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}

  save() {
    if (!this.waitingListForm.valid) {
      this.showErrors();
    } else {
      this.errors = [];
      console.log('saving data!');
    }
  }

  showErrors() {
    const emailError = this.waitingListForm.get('email').errors;
    console.log(emailError);
    Object.keys(emailError).forEach((value) => {
      this.errors = [...value];
    });
  }
}

```

```html
<form [formGroup]="waitingListForm" (ngSubmit)="save()">
  <h1>Waiting list</h1>
  <input type="text" formControlName="email" />
  <button>Save</button>
  <span *ngFor="let error of errors">{{ error }}</span>
</form>

```

In the afternoon, @bezael said, maybe we need the same form, for password recovery all these components are close similar looks duplicate code.

My smart solution to avoid duplicate code and make it more predictable is creating BaseForm class with the methods and field declaration and my forms extend from my base form class.

We do small changes to make the form generic, like myform and the methods to share.

```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class BaseForm {
  errors = [];
  myform = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}
  save() {
    if (!this.myform.valid) {
      this.showErrors();
    } else {
      this.errors = [];
      console.log('saving data!');
    }
  }

  showErrors() {
    const emailError = this.myform.get('email').errors;
    console.log(emailError);
    Object.keys(emailError).forEach((value) => {
      this.errors = [...value];
    });
  }
}
```

Next, We refactor our two forms and extend from the base form, calling the superclass and passing the form builder dependency.

We remove the duplicate code and use the myform field provided by baseForm class and all the methods, and everything works by default.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from '../../core/baseForm';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
})
export class NewsletterComponent extends BaseForm {
  constructor(public fb: FormBuilder) {
    super(fb);
  }
}

```

```html
<form [formGroup]="myform" (ngSubmit)="save()">
  <h1>Newsletter</h1>
  <input type="text" formControlName="email" />
  <button>Save</button>
  <span *ngFor="let error of errors">{{ error }}</span>
</form>
```

We do the same refactor for the waiting-list component and create the recovery password fast because I re-use all the fields provided by the inheritance.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseForm } from '../../core/baseForm';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
})
export class RecoveryPasswordComponent extends BaseForm {
  constructor(public fb: FormBuilder) {
    super(fb);
  }
}
```

```html
<form [formGroup]="myform" (ngSubmit)="save()">
  <h1>Recovery password</h1>
  <input type="text" formControlName="email" />
  <button>Save</button>
  <span *ngFor="let error of errors">{{ error }}</span>
</form>
```

I feel powerful and unstoppable, and I can build any form fast :)

## The problem

Like the normal life in developers, the changes came and new requirement appears, business wants for the recovery, and waiting-list component adds a tracking, using analytics.
Because the case is for two components my idea is to add these methods to the superclass and the dependency of the HTTP request.

Update the constructor and create the sendToAnalytics method.

```typescript
constructor(public fb: FormBuilder, public http: HttpClient) {}

  sendToAnalytics() {
    return this.http
      .post<any>('google.analytics.fake', { value: 'tracking' })
      .subscribe(() => {
        console.log('tracking');
      });
  }
```

Because my base class changed, we need to update the recovery and waiting list to pass the new parameters required for the FormBase class.

```typescript
 constructor(public fb: FormBuilder, public http: HttpClient) {
    super(fb, http);
    this.sendToAnalytics();
  }
```

Also, news-letter needs to pass the new parameter because inherits from baseForm .

```typescript
 constructor(public fb: FormBuilder, public http: HttpClient) {
    super(fb, http);
  }
```

Something looks not nice...

- Why does the newsletter component need to inject a dependency not related to him?

- Why does every change in the base class impact my component?

- Why do my components need too many parameters in the constructor, if he doesn't need them.

- What happens if tomorrow the base class needs another stuff only for the waiting list, for example, call another service or show a new console log message?

> Read more about  [Constructor Over-injection code smells](https://fullboarllc.com/reducing-dependency-injection-code-smell/)

```typescript
  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    private log: string
  ) {
    console.log(this.log);
  }
```

```
 super(fb, http, 'HELLO');
```

All components extended from the base form need to provide all these parameters for the superclass, and we start to face these problems in the testing phase where we need or mock dependencies without an actual use in our component.

> The Tests will expose bad design fast @[Michael Karén](@melcor76)

## Why did it happen, and what can I do?

The original idea re-uses the business code using inheritance and extends my class, and it looks like easy maintenance is inheritance.

\## What is inheritance?

Inheritance `is a` relationship between classes, the subclass from the superclass. The common example we found on the internet is `animal -> dog`.

Implementing inheritance is very easy and is part of the core concept of OOP, making it easy to re-use in the subclass. The superclass constructor is visible to the subclass and has coupled relation, so every change in the superclass affects the child class.

It also impacts the test; when we change the base, it changes the component and we need to update the tests.

> Inheritance shouldn't be the first tool in our toolbox, it should be the last. @[Lars Gyrup Brink Nielsen](@LayZee)

## What Composition?

The main difference between inheritance and composition is the object `has an a` relationship, using a reference to one field, but it doesn't know how it is built or required to be ready.

```typescript
class Helper  {
   form: BaseForm
   errors: Error
}
```

An extra option is to use an interface to these fields and use dependency Inversion to separate from the concrete implementation. We can change in runtime and replace it with another object dynamically.

The creation is not visible in composition, only by methods or fields, and we change the implementation without breaking our code.

## What can we do with the current problem?

First, we need to detect what needs our forms.

- A form.
- A list of errors.
- Recovery and waiting-list components need to track with analytics.

We create a service to delegate the creation of the form base and create two fields and methods to save and track with analytics.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseForm } from './baseForm';

@Injectable()
export class FormWrapperService {
  public myform: FormGroup;

  public get errors(): string[] {
    return this._baseForm.errors;
  }
  private _baseForm: BaseForm;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this._baseForm = new BaseForm(this.fb, this.http, 'A');
    this.myform = this._baseForm.myform;
  }
  save(form: FormGroup): boolean {
    this._baseForm.myform = form;
    this._baseForm.save();
    return this._baseForm.errors.length === 0;
  }
}

```

Next, inject the service into the component and connect waiting list component fields with the business logic wrapped in the service.

```typescript
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormWrapperService } from '../../core/form-wrapper.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
})
export class WaitingListComponent {
  myform: FormGroup;
  errors = [];
  constructor(private formWrapper: FormWrapperService) {
    this.myform = formWrapper.myform;
  }
  save() {
    if (!this.formWrapper.save(this.myform)) {
      this.errors = this.formWrapper.errors;
    }
  }
}
```

What do we get?

Our components have not a direct linked with baseForm re-use the business logic behind and also:

- If tomorrow I need extra dependency into the \_baseForm, my components don't care.

- I write the test for the waiting-list component. It expects a form group doesn't care which or who provides it.

- We are only exposing the methods related to my case, not the whole business.

We can re-use the same approach for all my components and clean the constructor only using the service.

## Extra case

My team talks about using the newsletter with Spanish errors and sending the data to another endpoint. :( what can we do? I can create a new method saving for the new provider and send a new parameter to Spanish errors.

Another better idea is to remove the direct implementation to the service and use an abstract class to implement each case. It leaves my components open to future changes.

First, create an abstract class with the contract related to my sensitive fields and methods.

```typescript
import { FormGroup } from '@angular/forms';

export abstract class AbstractFormWrapper {
  abstract myform: FormGroup;
  abstract errors: string[];
  abstract save(form: FormGroup): boolean;
}

```

Because the default FormWrapperService already fits with our abstract class, change the signature.

```typescript
export class FormWrapperService implements AbstractFormWrapper
```

Next, create a new service FormWrapperTrackingService implement the AbstractFormWrapper, and make all changes related to the latest request from the business.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AbstractFormWrapper } from './abstract-form-wrapper';
import { BaseForm } from './baseForm';

@Injectable()
export class FormWrapperTrackingService implements AbstractFormWrapper {
  private _anotherBaseForm: BaseForm;
  myform: FormGroup;
  public get errors(): string[] {
    return this.translationToSpanish();
  }
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this._anotherBaseForm = new BaseForm(this.fb, this.http, 'A');
    this.myform = this._anotherBaseForm.myform;
  }

  save(form: FormGroup): boolean {
    this._anotherBaseForm.myform = form;
    this._anotherBaseForm.save();
    console.log('sending data to another service');
    return this._anotherBaseForm.errors.length === 0;
  }

  private translationToSpanish(): string[] {
    return this._anotherBaseForm.errors.map((a) => {
      return this.translate(a);
    });
  }

  private translate(string) {
    return 'Un error';
  }
}
```

The FormWrapperTrackingService fits with the abstract class contract, so we need to change the signature in the constructor of our components to use the specific version.

We register the provider with a component because we limit a service instance to a component.

```typescript
@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  providers: [
    {
      provide: AbstractFormWrapper,
      useClass: FormWrapperService,
    },
  ],
})
export class WaitingListComponent {
  myform: FormGroup;
  errors = [];
  constructor(private formWrapper: AbstractFormWrapper) {
    this.myform = formWrapper.myform;
  }

```

And update the remaining components to use the original version of our FormWrapper. Because the signature is the same, it works by default and doesn't care about future implementation.

```typescript
@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  providers: [
    {
      provide: AbstractFormWrapper,
      useClass: FormWrapperService,
    },
  ],
})
```

> Read more about https://angular.io/guide/providers

## Final

Sorry for the extended example; inheritance is not a wrong solution. May we still need to use it sometimes, but using composition to make our components flexible to future change may be a good solution.

> Final code [Github Repo](https://github.com/danywalls/how_handle_constructor_dependecies_in_components/tree/master)

Keep in mind the following points:

- Inheritance is good to re-use code and easy to read, but with tightly coupled code and every change impact all related to the superclass.

- Use inheritance in services, try to don't use in components.

- Composition make your code reusable code, flexible, and loosely coupled

- Avoid linking your component to real implementation using an interface or abstract class.

If you are in the same situation refactor is one of the ways to take,  I thoroughly recommend the following videos and articles.

- [The key points of Working Effectively with Legacy Code](https://understandlegacycode.com/blog/key-points-of-working-effectively-with-legacy-code/).

- [How to build a reusable form component](https://dev.to/this-is-angular/lean-angular-components-1abl) by @[Michael Karén](@melcor76)

- [Lean Angular Components](https://dev.to/this-is-angular/lean-angular-components-1abl) @[Lars Gyrup Brink Nielsen](@LayZee)

- [Composition over Inheritance video explain by mpj](https://www.youtube.com/watch?v=wfMtDGfHWpA)

- [Composition vs. Inheritance: How to Choose?](https://www.thoughtworks.com/en-es/insights/blog/composition-vs-inheritance-how-choose)

- [Using composition over inheritance in building Angular Components with Kate Sky](https://www.youtube.com/watch?v=50ALR6JRNrk)
