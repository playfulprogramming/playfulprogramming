# Angular Templating

## Article Overview

_*ADD MORE FLAVOR TEXT TO START THIS FLIPPIN' SWEET ARTICLE OFF*_

Templates allow developers to create embedded views of UI from another location. These templates are able to be passed and handled much like most values in JavaScript. You're also able to leverage a set of APIs built into these templates to pass and manipulate data from one template to another during the render process. The ability to have this tool at your disposal not only makes Angular very appealing as a component framework, but is how many of it's internal processes are built.

While this article is far from a comprehensive list of all template related APIs, there are three primary APIs that are used within a user defined template that I want to touch on in this article:

- `ng-template`
- `ng-container`
- [Structural Directives](<https://angular.io/guide/structural-directives#asterisk>) (such as `*ngIf`)

## A Brief Introduction to Templates

### Introductory Example
Before we dive into the meat of this article, let's do a quick recap of what a templates look like. While Angular templates come in many shapes and sizes, a straightforward example of what one in action might look might be something similar to this: 
```html
<ng-template #templHere>
  <p>False</p>
</ng-template>
<p *ngIf="bool; else templHere">True</p>
```

In this example, we are creating a template and assigning it to a [template variable](<https://blog.angulartraining.com/tutorial-the-magic-of-template-reference-variables-3183f0a0d9d1>). This template variable will make `templHere` a valid variable whereever it's referenced within the template (much like how variables are bound from the component logic to the template, you can bind data from within the template to other parts of the template).

We are then creating a structural directive `ngIf` that checks if `bool` is true or false. If it is false, it will then check if the `else` condition has a value assigned to it. In this example, it does: The template we've assigned to `templHere`. Because there's a value there, when `bool` is false, `<p>False</p>` will be rendered, but if `bool` is true, `<p>True</p>` will be rendered. If you had forgotten to include the `ngIf`, it would never render the `False` element because **the `ng-template` component never renders to the DOM unless otherwise specified**

### Example Alternative - Let's Checkout `ngTemplateOutlet`

But there's a ~~simpler~~ ~~much more complex~~ another way show the same template code above!

```html
<ng-template #templHere>
  <p>False</p>
</ng-template>
<ng-template #ngIfTrueCondTempl>
  <p>True</p>
</ng-template>
<ng-template [ngTemplateOutlet]="bool ? ngIfTrueCondTempl : templHere"></ng-template>
```

While this is not how the `ngIf` structural template works internally (we'll touch on that in a bit, including taking a look at how Angular's source code is written), this is a good introduction to the `ngTemplateOutlet` input to the `ng-template` component.

While I'd mentioned previously that `ng-template` does not render to the DOM, because we're using `ngTemplateOutlet`, it will create an embedded view based on the template passed into it. This embedded view will be located in the DOM where the `ng-template` that used the `ngTemplateOutlet` directive. Knowing that, you can see that the following example would show the user three of the most mythical beasts imaginable:

```html
<ng-template #templateName><button>🦄🦄🦄</button></ng-template>
<ng-template [ngTemplateOutlet]="templateName"></ng-template>
```

Once you understand that, combined with knowing about template variables ([which we covered at the beggining of this section](#introductory-example)), it can be easier to understand that we're just doing a turnary to pass the correct template based on the value of `bool` to create an embedded view of that template.

## Pass Data To Templates - The Template Context

You know how I mentioned that you can pass data between templates (at the start of the article)? That is built on top of the concept of Contexts. Context are a way of passing data just like you would parameters to a function by creating template variables for the template that is created with a context.

That said, they don't rely on the order of parameters (they rather rely on the name of the parameters to pass to the template) and are all entirely optional whether they are consumed by the template or not. In this way, they more similar to ADDLINK:`namedFunctions from Python 3` than they are arguments in a JavaScript function

So, now that we know what they are in broad terms, what do they look like?



















### Passing Context To Rendering
You can pass values to templates by using a template context

```html
<ng-template [ngTemplateOutlet]="templateName"
             [ngTemplateOutletContext]="{$implicit: 'value', otherVar: 'otherVal'}">
</ng-template>
```

And then consuming it like so:
```html
<ng-template let-implicitVal let-boundVar="otherVal">
  <p #str1>{{implicitVal}}</p>
  <p #str1>{{boundVar}}</p>
</ng-template>
```

Where `let-nameHere` is the name of the `$implicit`ly passed values for `nameHere` template variable, and `let-item="text"` gets the value of `text` that's passed and is assigned to the template variable `item`

### Structural Directives - What Sorcery is this?

A structural directive is something like `*ngFor` or `*ngIf`, they allow you to turn whatever you're looking at into a template.
EG:

```html
<div *ngIf="bool">
  <p>Hello</p>
</div>
```

Might turn into something like*:

```html
<ng-template #abcd>
  <div><p>Hello</p></div>
</ng-template>
<ng-template [ngTemplateOutlet]="bool ? abcd : null"></ng-template>
```

Internally.

\* This is guestimation, don't attack if not perfectly correct

* Internally. 

So when you mark something with a structural directive, you're turning it into an Angular template and then passing that element as a child to that template.

You can also take the template variables and turn them into a way to communicate with the structural directive, like how `*ngFor` works:

https://angular.io/guide/structural-directives#microsyntax

For more information on this see:

<https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/>






#### MOVEME: EXPLAINBTR: Template Variables

Template variables can reference other types other than templateRef ([just like `{read}` can be used with `ViewChild`](<https://angular.io/api/core/ViewChild#description>)) by using the prop input equality operator like values are passed to inputs (`#templArg="exportAsName"`) that matches the `exportAs` value of the component/directive you're trying to "spy" on








