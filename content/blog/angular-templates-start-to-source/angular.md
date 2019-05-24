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

These template variables can then be referenced by siblings or children, but not by cousin elements

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

That said, they don't rely on the order of parameters (they rather rely on the name of the parameters to pass to the template) and are all entirely optional whether they are consumed by the template or not. In this way, they more similar to [functions with named arguments in Python 3](https://www.python.org/dev/peps/pep-3102/) than they are arguments in a JavaScript function

So, now that we know what they are in broad terms, what do they look like?

### Passing Context To Rendering

While we used the `ngTemplateOutlet` directive before to render a template, we can also pass an input to the directive `ngTemplateOutletContext` in order to pass a context. A context is just an object with a standard key/value pairing.

```html
<ng-template [ngTemplateOutlet]="templateName"
             [ngTemplateOutletContext]="{$implicit: 'Hello World', personName: 'Corbin'}">
</ng-template>
```

From there, you can use `let` declarations to create template variables in that template based on the values passed by the context like so:
```html
<ng-template #templateName let-implicitTemplVal let-boundPersonTemplVar="personName">
  <p>{{implicitTemplVal}} {{boundPersonTemplVar}}</p>
</ng-template>
```

Here, you can see that `let-templateVariableName="contextKeyName"` is the syntax to bind any named context key's value to the template variable with the name you provided after `let`. There is an edge-case you've probable noticed though, the `$implicit` key of the context is treated as a default of sorts, allowing a user to simply leave `let-templateVariableName` to be the value of the `$implicit` key of the context value. 

#### Notes

As a qiuck note, I only named these template variables differently from the context value key in order to make it clear that you may do so. `let-personName="personName"` is not only valid, but can be clearer to other developers of it's intentions in the code.

It's also important to note that a template variable is bound to the element and it's children. Attempting to accessing the template variable from a sibling, parent, or cousin's template code is not valid. To recap:
```html
<!-- ✅ This is perfectly fine -->
<ng-template #templateOne let-varName><p>{{varName}}</p></ng-template>

<!-- ❌ This will throw errors, as the template variable is not set in siblings -->
<ng-template #templateTwo let-thisVar></ng-template>
<p>{{thisVar}}</p>
```

## Keeping Logic In Your Controller - `ViewChild`

NOTE: Structural Directives don't actually use any of this, just something to keep in mind that you might want to just use it as a way to show how you can pass around templates and fuck with them

Or actually I forgot that I'm using this as a way to talk about createEmbedded view before we get to structural directives to help the reader understand how they got there, right

### The Setup

Okay, so templates are really cool. But there are often times where you'd want to grab a reference to a template you'd defined in your template. Say you wanted to pass a template to another part of the component tree? Say you wanted to pass template `C` to component  `B` in the following component tree, say to reuse an template you're passing as the `else` to an `ngIf` that you don't want to move:

```
     +--->A---+->D
app--+        |
     |        +->C
     +--->B
```

As we mentioned before, using the `#templateVar` reference will only work to as high as the siblings. Everything higher/in a different "root" context won't be able to understand where that reference is. 

### The Solution

Well, as it turns out, there's actually a way to get a reference to any component or element within a component. Using `ViewChild`, you're able to grab the template from the component logic rather than the template:

```typescript
@Component({
  selector: 'app',
  template: `
  	<div>
    	<ng-template #templName>Hello</ng-template>
    </div>
    <ng-template [ngTemplateOutlet]="templateHere"></ng-template>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('templName') templateHere: TemplateRef<any>;
}
```

`ViewChild` is a "property decorator" utility for Angular. This utility will search the component view tree to find whatever you're looking for. In the example above, when we pass a string of `'templName'`, we are looking for something in the tree that is marked with the template variable `templName`. In this case, it's an `ng-template`, which is then stored to the `templateHere` when this is found. Because it is a reference to a template, we are typing it as `TemplateRef<any>` to have TypeScript understand the typings whenever it sees this variable. 

Just to remind, there is no reason why the line couldn't read:

```typescript
@ViewChild('templName') templName: TemplateRef<any>;
```

I just wanted to make clear what was doing what in the example

### Viewing Isn't just For Sight-seeing

`ViewChild` isn't just for templates, either. You can get references to anything in the view tree:

```typescript
@Component({
  selector: 'app',
  template: `
  	<my-custom-component #myComponent [inputHere]="50" data-unrelatedAttr="Hi there!"></my-custom-component>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('myComponent') myComponent: MyComponentComponent;
}
```

For example, would give you a reference to the `MyComponentComponent` instance of the template. If you ran:

```typescript
console.log(myComponent.inputHere); // This will print `50`
```

It would give you the property value on the instance of that component. Angular by default does a pretty good job at figuring out what it is that you wanted to get a reference of and returning the "correct" object for that thing.

Depite having used a string as the query for `ViewChild`, you're also able to use the ComponentClass to query for a component with that component type.
```typescript
@ViewChild(MyComponentComponent) myComponent: MyComponentComponent;
```

Would yeild the same results in this particular example. When using `ViewChild`, it might be dangerous to do this if you have many components with that class. This is because when using `ViewChild`, it only returns the first result that Angular can find - this could return results that are unexpected if you're not aware of that.

#### My Name is ~~Inigo Montoya~~ the `read` Prop
Awesome! But I wanted to get the value of the `data-unrelatedAttr` attribute dataset, and my component definition doesn't have an input for that. How do I get the dataset value?

Ahh, so you've seen the problem with Angular's guessing of what datatype you're looking for. There are times where we, the developer, knows better of what we're looking for than the framework services.

Fancy that.

When we want to overwrite the type of data we expect `ViewChild` to return, we can use a second property passed to the `ViewChild` dectorator with the type we want returned. With the usecase mentioned above, we can tell Angular that we want a reference to the element of the component itself by using the `ElementRef`


```typescript
@ViewChild('myComponent', {read: ElementRef}) myComponent: ElementRef; 
```

Now that we've configured the `ViewChild` to read this as an `ElementRef` (A class provided from `@angular/core` to help us with just the thing we're looking for) rather than a component reference, we're able to use the `nativeElement` property of that class to get the HTMLElemenet object for that component instance.

```typescript
console.log(myComponent.nativeElement.dataset.unrelatedAttr); // This output `"Hi there!"`
```

#### THIS NEEEDS SOME QUALITY EXPLAINING CUZ UH WTF: Acting as a Cyrstal Ball Gazer (by reading changelogs for future releases)



> Prior to this commit, the timing of `ViewChild`/`ContentChild` query
> resolution depended on the results of each query. If any results
> for a particular query were nested inside embedded views (e.g.
> *ngIfs), that query would be resolved after change detection ran.
> Otherwise, the query would be resolved as soon as nodes were created.
>
> This inconsistency in resolution timing had the potential to cause
> confusion because query results would sometimes be available in
> ngOnInit, but sometimes wouldn't be available until ngAfterContentInit
> or ngAfterViewInit. Code depending on a query result could suddenly
> stop working as soon as an *ngIf or an *ngFor was added to the template.
>
> With this commit, users can dictate when they want a particular
> `ViewChild` or `ContentChild` query to be resolved with the `static` flag.
> For example, one can mark a particular query as `static: false` to
> ensure change detection always runs before its results are set:
>
> ```
> @ContentChild('foo', {static: false}) foo !: ElementRef;
> ```
>
> This means that even if there isn't a query result wrapped in an
> *ngIf or an *ngFor now, adding one to the template later won't change
> the timing of the query resolution and potentially break your component.
>
> Similarly, if you know that your query needs to be resolved earlier
> (e.g. you need results in an ngOnInit hook), you can mark it as
> `static: true`.
>
> ```
> @ViewChild(TemplateRef, {static: true}) foo !: TemplateRef;
> ```
>
> Note: this means that your component will not support *ngIf results.
>
> If you do not supply a `static` option when creating your `ViewChild` or
> `ContentChild` query, the default query resolution timing will kick in.
>
> Note: This new option only applies to `ViewChild` and `ContentChild` queries,
> not `ViewChildren` or `ContentChildren` queries, as those types already
> resolve after CD runs.



Something to keep in mind as you work with `ViewChild` is that it runs AFTER the `ngOnInit` hook but BEFORE the `ngAfterViewInit` hook. 

```typescript
// Ensure Change Detection runs before accessing the instance
@ContentChild('foo', { static: false }) foo!: ElementRef;
// If you need to access it in ngOnInt hook
@ViewChild(TemplateRef, { static: true }) foo!: TemplateRef;
```













#### It's like talking to me: You're flooded with references! - `ViewChildren`

It's also worth mentioning that there are other property decorators in the same vein of `ViewChild`. 

`ViewChildren` will allow you to get a reference to any items in the view that match your `ViewChildren` query as an array of each item that matches:

```typescript
@Component({
  selector: 'app',
  template: `
    <div>
        <my-custom-component [inputHere]="50"></my-custom-component>
        <my-custom-component [inputHere]="80"></my-custom-component>
    </div>
  `
})
export class AppComponent implements OnInit {
  @ViewChild(MyComponentComponent) myComponentS: QueryList<MyComponentComponent>;
}
```







 `ContentChild` is similar to `ViewChild` but looks for items passed into the `ng-content` of the component rather than the view of the component itself, and `ContentChildren` is the `ViewChildren` of `ContentChild` that will give an array of any items that match a query in the `ng-content` of the component.




















While this example is contrived, there are real-world usages that use this pattern. The examples I can think of that would use this pattern are a bit more complex and complex examples tend to be bad for educational purposes like this. Admittedly, they more-often then not end up being anti-patterns, so it's likely for the best we don't anyway.

All the same, now that we've gone over `ViewChild` and the `read` property, we can trudge 🐕🛷 forward towards the honest goods! You got this! 💪









## Embedded Views - We Get It You Like The Expression

It might seem like I've been trying to use `embedded view` far too much, possibly avoiding using `render` more than might seem logical at first, but there's a reason for this:

Angular tracks them seperately from other components.

Angular also allows you find, reference, modify, and create them yourself! 🤯





## Structural Directives - What Sorcery is this?

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








