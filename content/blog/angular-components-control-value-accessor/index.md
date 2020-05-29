---
{
	title: "Make Better Angular Form Components using ControlValueAccessor",
	description: "You may have ran into elements or components that allow you to use formControl or ngModel. They make your life as a consumer much easier. Let's build one!",
	published: '2020-05-05T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['angular', 'javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

One of Angular's greatest strengths over its contemporaries like React or Vue is that it's a framework. What does this mean in the practical sense? Well, because you're providing the defaults for everything right out-of-the-box, you have a set of guard rails to follow when architecting new things. A set of baseline rules for things to follow, so to speak.

One such guard rail comes in the form of the `@angular/forms` package. If you've used Angular for long, you're doubtlessly familiar with [the `[(ngModel)]` method of two-way data binding in the UI](https://angular.io/guide/forms#two-way-data-binding-with-ngmodel). Seemingly all native elements have support for this feature (so long as you have `FormsModule` imported in your module).

More than that, if you want more powerful functionality, such as disabling an entire form of fields, tracking a collection of fields in a form, and doing basic data validation, [you can utilize Angular Reactive Forms' `[formControl]`](https://angular.io/guide/reactive-forms#adding-a-basic-form-control) and do all of that and more.

These features are hugely helpful when dealing with complex form logic throughout your application. Luckily for us, they're not just exclusive to native elements - we can implement this functionality into our own form!

# Example {#code-demo}

It's hard for us to talk about the potential advantages to a component without having actually taken a look at it. Let's start with this component, just for fun.

It'll allow you to type in data, have a header label (as opposed to a floating label, [which is notoriously bad for A11Y](https://www.matsuko.ca/blog/stop-using-material-design-text-fields/)), and even present a fun message when "Unicorns" is typed in.

Here's the code:

```typescript
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-example-input",
  template: `
    <label class="inputContainer">
      <span class="inputLabel">{{ placeholder }}</span>
      <input
        placeholder=""
        class="inputInput"
        [(ngModel)]="value"
      />
    </label>
    <p
      class="hiddenMessage"
      [class.hideTheMessage]="!isSecretValue"
      aria-hidden="true"
    >
      You unlocked the secret unicorn rave!<span>🦄🦄🦄</span>
    </p>
    <!-- This is for screen-readers, since the animation doesn't work with the 'aria-live' toggle -->
    <p aria-live="assertive" class="visually-hidden">
      {{
        isSecretValue
          ? "You discovered the secret unicorn rave! They're all having a party now that you summoned them by typing their name"
          : ""
      }}
    </p>
  `,
  styleUrls: ["./example-input.component.css"]
})
export class ExampleInputComponent {
  @Input() placeholder: string;
  value: any = "";

  get isSecretValue() {
    return /unicorns/.exec(this.value.toLowerCase());
  }
}
```

With only a bit of CSS, we have a visually appealing, A11Y friendly, and quirky input component. Look, it even wiggles the unicorns!

<iframe src="https://stackblitz.com/edit/angular-unicorns-text-input?ctl=1&embed=1&file=src/app/app.component.ts" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Now, this component is far from feature complete. There's no way to `disable` the input, there's no way to extract data out from the typed input, there's not a lot of functionality you'd typically expect to see from an input component. Let's change that.

# ControlValueAccessor {#intro-concept}

Most of the expected form functionality will come as a complement of [the `ControlValueAccessor` interface](https://angular.io/api/forms/ControlValueAccessor). Much like you implement `ngOnInit` by implementing class methods, you do the same with ControlValueAccessor to gain functionality for form components.

The methods you need to implement are the following:

- `writeValue`
- `registerOnChange`
- `registerOnTouched`
- `setDisabledState`

Let's go through these one-by-one and see how we can introduce change to our component to support each one.

## Setup {#forwardRef}

In order to use these four methods, you'll first need to `provide` them somehow. To do this, we use a combination of the component's `providers` array, `NG_VALUE_ACCESSOR`, and `forwardRef`.

```typescript
import { forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * Provider Expression that allows your component to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 */
export const EXAMPLE_CONTROL_VALUE_ACCESSOR: any = {  
  /**
   * Used to provide a `ControlValueAccessor` for form controls.
   */
  provide: NG_VALUE_ACCESSOR,
  /**
   * Allows to refer to references which are not yet defined.
   * This is because it's needed to `providers` in the component but references
   * the component itself. Handles circular dependency issues
   */
  useExisting: forwardRef(() => ExampleInputComponent),
  multi: true
};
```

Once we have this example provide setup, we can now pass it to a component's `providers` array:

```typescript
@Component({
  selector: 'app-example-input',
  templateUrl: './example-input.component.html',
  styleUrls: ['./example-input.component.css'],
  providers: [EXAMPLE_CONTROL_VALUE_ACCESSOR]
})
export class ExampleInputComponent implements ControlValueAccessor {
```

With this, we'll finally be able to use these methods to control our component.

> If you're wondering why you don't need to do something like this with `ngOnInit`, it's because that functionality is baked right into Angular. Angular _always_ looks for an `onInit` function and tries to call it when the respective lifecycle method is run. `implements` is just a type-safe way to ensure that you're explicitly wanting to call that method.


## `writeValue` {#write-value}

`writeValue` is a method that acts exactly as you'd expect it to: It simply writes a value to your component's value. Because of this, it's suggested to have a setter and getter for `value` and a private internal value that's used as the real value:

```typescript
 private _value: any = null;

  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (this._value !== newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this._value = newValue;
    }
  }
```

Once this is done, the method is trivial to implement:

```typescript
 writeValue(value: any) {
    this.value = value;
  }
```

However, you may notice that your component doesn't properly re-render when you update your value from the parent component. Because you're updating your value outside of the typical pattern, change detection may have a difficult time running when you'd want it to. To solve for this, provide a `ChangeDetectorRef` in your constructor and manually check for updates in the `writeValue` method:

```typescript
export class ExampleInputComponent implements ControlValueAccessor {
  // ...
  constructor(private _changeDetector: ChangeDetectorRef) { }
   // ...
 writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }
```

Now, when we use a value like `new FormValue('test')` and pass it as `[formControl]` to our component, it will render the correct default value

## `setDisabledState` {#disabled-state}

Implementing the disabled state check is extremely similar to [implementing value writing](#write-value). Simply add a setter, getter, and `setDisabledState` to your component and you should be good-to-go:

```typescript
 private _disabled: boolean = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
```

Just as we did with value writing, we want to run a `markForCheck` to allow change detection to work as expected when the value is changed from a parent

> It's worth mentioning that unlike the other three methods, this one is entirely optional for implementing a `ControlValueAccessor`. This allows us 

## `registerOnChange` {#register-on-change}

## `registerOnTouched` {#register-on-touched}


# Form Control Classes

Angular CSS masters might point to [classes that's applied to inputs when various state changes are made](https://angular.io/api/forms/NgControlStatus#css-classes-applied).

These classes include:


- `ng-pristine`
- `ng-dirty`
- `ng-untouched`
- `ng-touched`
They reflect states so that you can update the visuals in CSS to reflect them. When using `[(ngModel)]`, they won't appear, since nothing is tracking when a component is `pristine` or `dirty`. However, when using `[formControl]` or `[formControlName]`, these classes _will_ appear and act accordingly, thanks to the `registerOnChange` and `registerOnTouched` functions.
