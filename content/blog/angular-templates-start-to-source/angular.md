# Angular Templating

## Article Overview

_*ADD MORE FLAVOR TEXT TO START THIS FLIPPIN' SWEET ARTICLE OFF*_



Templates allow developers to create embedded views of UI from another locations. These templates are able to be passed and handled much like most values in JavaScript. You're also able to leverage a set of APIs built into these templates to pass and manipulate data from one template to another during the render process. The ability to have this tool at your disposal not only makes Angular very appealing as a component framework, but is how many of it's internal processes are built.

While this article is far from a comprehensive list of all template related APIs, there are three primary APIs that are used within a user defined template that I want to touch on in this article:

- `ng-template`
- `ElementRef`
- `TemplateRef`
- `EmbeddedViewRef`
- `ViewContainerRef`
- `createEmbeddedView`
- [Structural Directives](<https://angular.io/guide/structural-directives#asterisk>) (such as `*ngIf`)

While a lot of these examples are going to be small/silly/contrived, they loosely come from patterns I've seen in huge Angular libraries. Some of the coolest aspects of templates are used to make APIs much much simpler to use when consuming a library and some of what we'll be covering is code that's used to provide some useful features (like `ngIf` and `ngFor`) from Angular's source itself.

It's going to be a long article, so please feel free to take breaks, grab a drink to enjoy while reading, pause to tinker with code, or anything in-between. Feedback is always welcomed and appreciated.

Sound like a fun time? Let's goooo! 🏃🌈

## A Brief Introduction to Templates

### Introductory Example
Before we dive into the meat of this article, let's do a quick recap of what a templates look like. While Angular templates come in many shapes and sizes, a straightforward example of what one in action might look might be something similar to this: 
```html
<ng-template #templHere>
  <p>False</p>
</ng-template>
<p *ngIf="bool; else templHere">True</p>
```

In this example, we are creating a template and assigning it to a [template reference variable](<https://blog.angulartraining.com/tutorial-the-magic-of-template-reference-variables-3183f0a0d9d1>). This template reference variable will make `templHere` a valid variable whereever it's referenced within the template (much like how variables are bound from the component logic to the template, you can bind data from within the template to other parts of the template). 

These template reference variables can then be referenced by siblings or children, but not by cousin elements

We are then adding a structural directive `ngIf` to the `p` element on screen. This `ngIf` structural directive will checks if `bool` is true or false, and render items on screen depending on the value of `bool`.

- If it is true, it will render `<p>True</p>` and the template containing the false will not
- If it is false, it will then check if the `else` condition has a value assigned to it, if there is a value assigned, it will render that template. 
  - In this example, it does: The template we've assigned to `templHere`. Because of this, `<p>False</p>` will render

If you had forgotten to include the `ngIf`, it would never render the `False` element because **a template is not rendered to the view unless explicitly told to - this includes templates created with `ng-template`**

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

> While this is not how the `ngIf` structural template works internally, this is a good introduction to the `ngTemplateOutlet` directive, which adds functionality to the `ng-template` tag.
>
> If you're curious to how Angular's `ngIf` works, read on dear visitor.

While I'd mentioned previously that `ng-template` does not render to the DOM, because we're using `ngTemplateOutlet`, it will render the template defined in the passed `ng-template`.

This template that's defined by `ng-template` is called a "view", and when it is rendered to the screen it is called an "embedded view".

This embedded view will be located in the DOM where the `ng-template` that used the `ngTemplateOutlet` directive. Knowing that, you can see that the following example would show the user three of the most mythical beasts imaginable:

```html
<ng-template #templateName><button>🦄🦄🦄</button></ng-template>
<ng-template [ngTemplateOutlet]="templateName"></ng-template>
```

Once you understand that, combined with knowing about template reference variables ([which we covered at the beggining of this section](#introductory-example)), it can be easier to understand that we're just doing a turnary to pass the correct template based on the value of `bool` to create an embedded view of that template.

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

Here, you can see that `let-templateVariableName="contextKeyName"` is the syntax to bind any named context key's value to the template input variable with the name you provided after `let`. There is an edge-case you've probable noticed though, the `$implicit` key of the context is treated as a default of sorts, allowing a user to simply leave `let-templateVariableName` to be the value of the `$implicit` key of the context value. 

#### Notes

As a qiuck note, I only named these template input variables differently from the context value key in order to make it clear that you may do so. `let-personName="personName"` is not only valid, but can be clearer to other developers of it's intentions in the code.

It's also important to note that a template input variable is bound to the element and it's children. Attempting to accessing the template variable from a sibling, parent, or cousin's template code is not valid. To recap:
```html
<!-- ✅ This is perfectly fine -->
<ng-template #templateOne let-varName><p>{{varName}}</p></ng-template>

<!-- ❌ This will throw errors, as the template input variable is not set in siblings -->
<ng-template #templateTwo let-thisVar></ng-template>
<p>{{thisVar}}</p>

<!--❗It is worth noting that you CAN reference template REFERENCE variables from it's siblings, but not from it's parents or higher up the DOM tree -->
<ng-template [ngTemplateOutlet]="templateOne"></ng-template>
```

## Keeping Logic In Your Controller - `ViewChild`

NOTE: Structural Directives don't actually use any of this, just something to keep in mind that you might want to just use it as a way to show how you can pass around templates and fuck with them

Or actually I forgot that I'm using this as a way to talk about createEmbedded view before we get to structural directives to help the reader understand how they got there, right

### The Setup

Okay, so templates are really cool. But there are often times where you'd want to grab a reference to a template you'd defined in your template. Say you wanted to pass a template to another part of the view hierarchy tree (which is the more correct term for "DOM tree" since a lot of templates might not be rendered on screen but are still handled by Angular)? Say you wanted to pass template `C` to component  `B` in the following view tree, say to reuse an template you're passing as the `else` to an `ngIf` that you don't want to move:

```
     +--->A---+->D
app--+        |
     |        +->C
     +--->B
```

As we mentioned before, using the `#templateVar` reference will only work to as high as the siblings. Everything higher/in a different "root" context won't be able to understand where that reference is. 

### The Solution

Well, as it turns out, there's actually a way to get a reference to any componen, directive, or view within a component. Using `ViewChild`, you're able to grab the template from the component logic rather than the template:

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

## Viewing Isn't just For Sight-seeing

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

### My Name is ~~Inigo Montoya~~ the `read` Prop
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

## It's like talking to me: You're flooded with references! - `ViewChildren`

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
export class AppComponent {
  @ViewChildren(MyComponentComponent) myComponents: QueryList<MyComponentComponent>;
}
```

Would give you a list of all components with that base class. You're also able to use the `{read: ElementRef}` propety from the `ViewChild` property decorator to get a `QueryList<ElementRef>` instead of a query list of `MyComponentComponent` types.

### What is `QueryList`

While `QueryList` (from `@angular/core`) returns an array-like, and the core team has done a very good job at adding in all the usual methods (`reduce`/`map`/etc) and it extends an iterator interface (so it will work with `*ngFor`  in Angular templates and `for (let i of _)` in TypeScript/JavaScript logic), it is not an array, so if you're expecting an array, it might be best to use `Array.from` on the `myComponents` component prop when you access it in logic later.

A `QueryList` also allows for some nice additions like the `changes` observable property that will allow you to listen for changes to this query. For example, if you had some components that were hidden behind a toggle:

```html
<input type="checkbox" [(ngModel)]="bool"/>
<div *ngIf="bool">
  <my-custom-component></my-custom-component>    
</div>
<my-custom-component></my-custom-component>
```

And wanted to get the value of all component's `numberProp` values reduced into one, you could do so using the `changes` observable:

```typescript
this.myComponents.changes.subscribe(compsQueryList => {
  const componentsNum = compsQueryList.reduce((prev, comp) => {
    return prev + comp.numberProp;
  }, 0);
  console.log(componentsNum); // This would output the combined number from all of the component's `numberProp` field. This would run any time Angular saw a difference in the values
});
```

It might be a good idea to gain familiarity of doing this, as the Angular docs leave the warning when reading through [`QueryList` docs](https://angular.io/api/core/QueryList#changes):

> NOTE: In the future this class will implement an Observable interface.

##Keep an Eyes on Your Kids - `ContentChild`

Author's note:

> This section of the article assumes you know what the `ng-content` tag is. While I could do an in-depth dive on what `ng-content` and content projection is, it's somewhat outside of the scope of this current article is. Let me know if this is something that interests you, I might do another deep deep dive into how Angular parses tags like `ng-content` and how it's handled by Angular's AST and template parsing/etc.
>
> If you're less familiar with `ng-content`, you can probably get by with just knowing how parent/child relationships elements work and just reading through carefully. Never be afraid to ask questions! 

I always love nesting some of my code into `ng-content`s. I don't know what's so appealing to having my code look like it's straight out of HTML spec, but just being able to pass component instances and elements as children to one of my components and then tinkering with them is so satisfying.

One thing I always run into though, is that I always end up wanting to style the components that're passed in. Take the following example:

```html
<cards-list> <!-- Cards list has default styling with grey background -->
	<action-card></action-card> <!-- Action card has default styling with grey background -->
	<action-card></action-card> <!-- It's also widely used across the app, so that can't change -->
</cards-list>	
```

Anyone with a sense of design might be cringing about now. Grey on grey? On cards? Yuck! Let's make those cards have some white backgrounds.

This might seem like a trivial task to anyone assuming that these components are built-in HTML elements, of course a CSS stylesheet like so would apply:

```css
// cards-list.component.css
action-card {
  background: white;
}
```

But this is often not the case. [Angular's  `ViewEncapsulation`](https://angular.io/api/core/ViewEncapsulation) prevents styles from one component from affecting the styling of another. This will be made especially true if you're using a configuration that allows the native browser to handle the components under the browser's shadow DOM APIs, which restricts stylesheet sharing on a browser-level. This is why the [Angular-specific CSS selector  `::ng-deep`](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep) has been marked for depreciation (sorry old-school Angular developers [including myself, so much to migrate 😭]). 

No matter though, we have the power of `ViewChildren` on our side - Corbin already showed us how to get a reference to an element of a rendered component! Let's spin up an example:

```typescript

@Component({
    selector: 'action-card',
    template: `<div></div>`,
    styles: [':host div {height: 300px; width: 100px; background: grey; margin: 10px;}']
})
export class ActionCard {}

@Component({
  selector: 'cards-list',
  template: `<div><ng-content></ng-content></div>`,
  styles: [':host {background: grey}']
})
export class CardsList implements AfterViewInit {
  @ViewChildren(ActionCard, {read: ElementRef}) actionCards;

  ngAfterViewInit() {
      // Any production code should absolutely be running `Renderer2` to do this rather than modifying the native element yourself
      this.actionCards.forEach(elRef => {
          console.log("Changing background of a card");
          elRef.nativeElement.style.background = "white";
      })
  }
}
```

Awesome, let's spin that up and… Oh. The cards are still grey. Let's open up our terminal and see if the `console.log`s ran. 

They didn't.

Alright, I could keep going but I know you've all read the section title (👀 at the skim-readers).

`ViewChildren` is a fantastic tool but only works for the items defined in the template of the component itself. Any children that are passed to the component are not handled the same way and require `ContentChildren` instead. The same applies for `ViewChild` (which has the adjacent API of `ContentChild`). The `ContentChild/ren` should share the same API with their `ViewChild/ren` counterparts.

If we change the `ViewChildren` line to read:

```typescript
@ViewChildren(ActionCard, {read: ElementRef}) actionCards;
```

We'll see that the code now runs as expected. Cards are recolored, consoles are ran, developers happy.

### The Content Without the `ng`

`ContentChild` even works when you're not using `ng-content` but still passing components and elements as children to the component. So, for example, if you wanted to pass a template as a child but wanted to render it in a very specific way, you could do so:

```html
<!-- root-template.component.html -->
<render-template-with-name>
  <ng-template let-userName>
    <p>Hello there, {{userName}}</p>
  </ng-template>
</render-template-with-name>
```

```typescript
// render-template-with-name.component.ts
@Component({
  selector: 'render-template-with-name',
  template: `
  <ng-template [ngTemplateOutlet]="contentChildTemplate"
               [ngTemplateOutletContext]="{$implicit: 'Name here'}">
  </ng-template>
`
})
export class AppComponent implements OnInit {
  @ContentChild(TemplateRef) contentChildTemplate;
}
```

This is a perfect example of where you might want `@ContentChild` - not only are you unable to use `ng-content` to render this template without a template reference being passed to an outlet, but you're able to create a context that can pass information to the template being passed as a child.


### Timings - The Bane of any JavaScript developer, now with `ViewChild`

But, alas, all good must come with some bad. While the `ViewChild` and `ContentChild` properties are very good at what they do, they can be confusing when it comes to what lifecycle methods they're available in. This is partially why I've been using `ngAfterViewInit` for the examples thus far. It's far easier to keep them consistent until the concept is grasped better and THEN dive into the naunces. This oftentimes works just fine, but there are often times where being able to run code on an element reference in an  `ngOnInit` might be more advantagous - especially if you're trying to get some logic finished before the user sees the rendered screen.

Take the following example and see if you can guess what these `console.log`s are going to output:


```typescript
@Component({
  selector: 'app',
  template: `
  <div #divToView>At Root</div>
  <ng-template [ngTemplateOutlet]="templateToOutlet"
  <ng-template #templateToOutlet>
    <div #childToView>In Template</div>
  </ng-template>
  `
})
export class HelloComponent implements OnInit, AfterViewInit {
  @ViewChild('childToView') childToView;
  @ViewChild('divToView') divToView;

  ngOnInit() {
    console.log("OnInit: " + this.divToView.nativeElement.innerText);
    console.log("OnInit: " + this.childToView.nativeElement.innerText);
  }

  ngAfterViewInit() {
    console.log("AfterView: " + this.divToView.nativeElement.innerText);
    console.log("AfterView: " + this.childToView.nativeElement.innerText);
  }
}
```

Totally lost? 



Think you got it? 



Last chance, go on and properly try it.




```diff
OnInit: At Root
- ERROR TypeError: Cannot read property 'nativeElement' of undefined
AfterView: At Root
AfterView: In Template
```


Weird, isn't it? Even though we're loading up the template immediately, and passing it by template reference variable, it still is `undefined` at the time of the `ngOnInit`.

The reasoning behind this is that the intended query result is nested inside of a template. This template creates an "embedded view", an injected view created from a template when said template is rendered. This embedded view is difficult to see from anything above it in the parent view, and is only exposed properly after change detection is ran. Because change detection is ran after `ngOnInit`, it is `undefined` until the `ngAfterViewInit` lifecycle method.

>  If you understood that, go get yourself some ice-cream, you totally deserve it. If you didn't, that's okay! We all learn at different paces and I'm sure this post could be written a dozen other ways - maybe try re-reading some stuff, tinking with code, or asking any questions you might have from myself or others.

As a result, **if you have your code inside of a template that's being rendered that you want to grab using `ViewChild`/`ContentChild`  - you will need to use an `ngAfterViewInit` rather than a `ngOnInit`.** For similar reasons (change detection being a tricky thing as it is), **you'll need to access the plural APIs ( `ViewChildren`/`ContentChildren`) with the `ngAfterViewInit` lifecycle as well.**

**This also effects `*ngIf` and `*ngFor` structural directives**, so if you've recently added one of those to your template, and have noticed that you've had to switch your lifecylcle methods to using `ngAfterViewInit`, you have a bit of an explaination ([as structural directives use templates internally](#structural-directives-what-sorcery-is-this))

#### Acting as a Cyrstal Ball Gazer - Coming to Angular 8

While this behavior can be a bit confusing, the next version of Angular (Angular 8) will bring an option to the `ViewChild` and `ContentChild` APIs to make this a bit easier to manage mentally. While **these APIs won't enbale use of templated queries in `ngOnInit`**, it will make bugs when adding templated queries (such as `ngIf`) less likely to create new bugs.

For example, if you'd like to force all queries to not run until `ngAfterViewInit`, regardless of using templated views, you can enable that with the `{static: false}` option configuration:

```typescript
@ContentChild(ComponentHere, {read: ElementRef, static: false}) foo: ElementRef;
```

However, if you'd like to try to disallow any templated views from being accessed by a query, you can pass the `static: true` option:

```typescript
@ContentChild(ComponentHere, {read: ElementRef, static: true}) foo: ElementRef;
```


Keep in that if you don't define a `static` prop, it will have the same API behavior as it did in the past. Additionally, because `ContentChildren`/`ViewChildren` don't have the same API nuance, the `static` option prop does not affect those APIs.














While this example is contrived, there are real-world usages that use this pattern. The examples I can think of that would use this pattern are a bit more complex and complex examples tend to be bad for educational purposes like this. Admittedly, they more-often then not end up being anti-patterns, so it's likely for the best we don't anyway.

All the same, now that we've gone over `ViewChild` and the `read` property, we can trudge 🐕🛷 forward towards the honest goods! You got this! 💪











## Embedded Views - Is That Some Kind of Picture Frame?

### If It Is, This Is The Green Screen - Some Background on Them

Before I go much further in this section, I want to make sure that I'm clearing up a bit how Angular works internally. I've sprinked a bit of how it does throughout the article, but having everything in one place helps a lot.

Angular's smallest grouping of display elements are called a `view`. These `view`s can be created and destroyed together and are under the control of a directive or component of some kind and include any templates associated with them.

When a template is rendered to the screen, it creates an `embedded view` which can be controlled and handled from an assocaited parent component or directive. This creation of an embedded view occurs automatically when a template is rendered using `ngTemplateOutlet` but also when using a structural directive such as `ngIf` and `ngFor`.

But that's not all - Angular also allows you find, reference, modify, and create them yourself in your component/directive logic! 🤯

Let's show an example of how we can render an `ng-template` using TypeScipt component logic:

```typescript
import { Component, ViewContainerRef, OnInit, AfterViewInit, ContentChild, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <ng-template #templ>
      <ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
      </ul>
    </ng-template>
    <div #viewContainerRef class="testing">
    </div>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('viewContainerRef', {read: ViewContainerRef}) viewContainerRef;
  @ViewChild('templ', {read: TemplateRef}) templ;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.templ);
  }
}
```

This example has a lot going on, so let's disect it bit-by-bit.

Starting with some small recap:

- We're creating an template with the `ng-template` tag and assigning it to a template reference variable `templ`
- We're also creating a `div` tag, assignining it to the template reference variable `viewContainerRef`
- Lastly, `ViewChild` is giving us a reference to the template on the `templ` component class property.

Now the new stuff:

- We're also using `ViewChild` to assign the template reference variable `viewContainerRef` to a component class property.
  - We're using the `read` prop to give it the [`ViewContainerRef`](https://angular.io/api/core/ViewContainerRef) class, which includes some methods to help us create embedded view
- Then, in the `ngOnInit` lifecycle ([since neither of our `ViewChild` reference are in embedded views themselves](#lakjsdf)), we're running the `createEmbeddedView` method present on the `ViewContainerRef` property to create an embedded view based on the template.

If you take a look at your element debugger, you'll notice that the template is injected as a sibling to the `.testing` div:

```html
<!---->
<div class="testing"></div>
<ul>
  <li>List Item 1</li>
  <li>List Item 2</li>
</ul>
```

[While this has confused many developers, who have expected the embedded view to be children of the `ViewContainer` reference element](https://github.com/angular/angular/issues/9035), this is intentional behavior (as-per their comments in the thread), and is consistent with other APIs similar to it.

The reasoning behind this has a lot to do with how **embedded views are tracked**, they're referenced **by Angular in it's source code by it's index**!

For example, if you wanted to see the index, we could use an API on the view container to get the index of the embedded view. To do this, we'd first need a reference of the embedded view in our template logic.

Just like how we have `ViewContainerRef`, there's also [`EmbeddedViewRef`](https://angular.io/api/core/EmbeddedViewRef#embeddedviewref). Luckily, with our previous example, getting that ref is trivial, as it's returned by the `createEmbeddedView` method:

```typescript
const embeddRef: EmbeddedViewRef<any> = this.viewContainerRef.createEmbeddedView(this.templ);
```

From there, we can use the `indexOf` method on the parent `ViewContainerRef`:

```typescript
const embeddIndex = this.viewContainerRef.indexOf(embeddRef);
console.log(embeddIndex); // This would print `0`
```

The view container keeps track of all of the embedded views in it's control, and when you `createEmbeddedView`, it searches for the index to insert the view into. 


You're also able to lookup an embedded view based on the index you're looking for using `get`. So, if you wanted to get all of the indexes being tracked by `viewContainerRef`, you'd do:

```typescript
ngOnInit() {
  for (let i = 0; i < this.viewContainerRef.length; i++) {
    console.log(this.viewContainerRef.get(i));
  }
}
```

#### Context

Just as we can use `contextRouterOutlet`, you're able to pass context to a template when rendering it using `createEmbeddedView`. So, let's say that you wanted to have a counting component and want to pass a specific index to start couting from, you could pass a context, [with the same object structure we did before](#pass-data-to-template—the-template-context), have:

```typescript
import { Component, ViewContainerRef, OnInit, AfterViewInit, ContentChild, ViewChild, TemplateRef , EmbeddedViewRef} from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
   <ng-template #templ let-i>
        <li>List Item {{i}}</li>
        <li>List Item {{i + 1}}</li>
    </ng-template>
    <ul>
	    <div #viewContainerRef></div>
    </ul>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('viewContainerRef', {read: ViewContainerRef}) viewContainerRef;
  @ViewChild('templ', {read: TemplateRef}) templ;

  ngOnInit() {
    const embeddRef3: EmbeddedViewRef<any> = this.viewContainerRef.createEmbeddedView(this.templ, {$implicit: 3});
    const embeddRef1: EmbeddedViewRef<any> = this.viewContainerRef.createEmbeddedView(this.templ, {$implicit: 1});
  }
}
```

In this example, because we want to have a unordered list with list elements being created using embedded views, we're getting a `ViewContainerRef` directly from inside the unordered list.
But you'll notice a problem with doing this if you open up your inspector (or even just by reading the code):
There's now a `div` at the start of your list.

To get around this, we can use the `ng-container` tag, which allows us to get a view reference without injecting a DOM element into the fray. `ng-container` can also be used to group elements without using a DOM element, similar to how [ADDLINK: React Fragments]() work in that ecosystem.

```html
<ng-container #viewContainerRef></ng-container>
```

#### Move/Insert Template

But oh no! You'll see that the ordering is off. The simplest (and probably most obvious) solution would be to flip the order of the calls. After all, if they're based on index - moving the two calls to be in the opposite order would just fix the problem. 

But this is a blog post, and I needed a contrived example to showcase how we can move views programmatically:


```typescript
const newViewIndex = 0;
this.viewContainerRef.move(embeddRef3, newViewIndex);
```

Angular provides many APIs to take an existing view and move it and modify it without having to create a new one and run change detection/etc again.

If you're wanting to try out a different API and feel that `createEmbeddedView` is a little too high-level for you (we need to go deeper), you can create a view from a template and then embedd it yourself manually.

```typescript
ngOnInit() {
  const viewRef1 = this.templ.createEmbeddedView({ $implicit: 1 });
  this.viewContainerRef.insert(viewRef1);
  const viewRef3 = this.templ.createEmbeddedView({ $implicit: 3 });
  this.viewContainerRef.insert(viewRef3);
}
```

[ADDLINK: And in fact, this is how the `createEmbeddedView` works internally]():

```typescript
// Source code directly from Angular
createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C, index?: number):
EmbeddedViewRef<C> {
  const viewRef = templateRef.createEmbeddedView(context || <any>{});
  this.insert(viewRef, index);
  return viewRef;
}
```



## Accessing Templates from a Directive

So now that we have some understanding of how to create views programmatically, let's see how we can use directives to create them without any concept of a template being associated directly with that logic.

```typescript
@Directive({
  selector: '[directiveName]'
})
export class DirectiveHere implements OnInit {
  @ContentChild(TemplateRef, {static: true}) templ;
  constructor (private parentViewRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.parentViewRef.createEmbeddedView(this.templ);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <div directiveName>
      <ng-template>
          <p>Hello</p>
      </ng-template>
    </div>
  `
})
export class AppComponent {}
```

Because Angular treats directives extremely similarly to components, you'll notice this code is almost exactly the same from some of our previous component code.

However, the lack of a template associated with the directive enables some fun stuff, for example, we can use the same dependency injection trick we've been using to get the view container reference to get a reference to the template element that the directive is attached to and render it in the `ngOnInit` method like so:


```typescript
@Directive({
  selector: '[directiveName]'
})
export class DirectiveHere implements OnInit {
  constructor (private parentViewRef: ViewContainerRef, private templ: TemplateRef<any>) {}

  ngOnInit(): void {
    this.parentViewRef.createEmbeddedView(this.templ);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <ng-template directiveName>
        <p>Hello</p>
    </ng-template>
  `
})
export class AppComponent {}
```

With directives, we can even create an input with the same name, and just pass that input value directly to the template using a context:

```typescript
@Directive({
  selector: '[directiveName]'
})
export class DirectiveHere implements OnInit {
  constructor (private parentViewRef: ViewContainerRef, private templ: TemplateRef<any>) {}

  @Input() directiveName: string;

  ngOnInit(): void {
    this.parentViewRef.createEmbeddedView(this.templ, {$implicit: this.directiveName});
  }
}

@Component({
  selector: 'app-root',
  template: `
    <ng-template [directiveName]="'Hi there!'" let-message>
        <p>{{message}}</p>
    </ng-template>
  `
})
export class AppComponent {}
```



With this syntax, we can add a second input, pass an object as the context to one of the inputs, and then a template reference variable, and be able to recreate Angular's `templateOutlet`

```typescript
@Directive({
  selector: '[directiveName]'
})
export class DirectiveHere implements OnInit {
  constructor (private parentViewRef: ViewContainerRef) {
  }

  @Input() directiveName: TemplateRef<any>;
  @Input() directiveNameContext: object;

  ngOnInit(): void {
    this.parentViewRef.createEmbeddedView(this.directiveName,  this.directiveNameContext);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <ng-template [directiveName]="template1"
                 [directiveNameContext]="{$implicit: 'Whoa 🤯'}"></ng-template>
    <ng-template #template1 let-message>
        <p>Testing from <code>template1</code>: <b>{{message}}</b></p>
    </ng-template>
  `
})
export class AppComponent {}
```





And this is how the templateOutlet code works in Angular



### A Note on Components

A component is just a directive with a template







## Structural Directives - What Sorcery is this?

Angular has many helpers that will allow you to do various things. There's the classic `*ngIf` that will conditionally render props, the always lovely `*ngFor` that will iterate through an array and allow you to 



```typescript
import {
  Component,
  ContentChild,
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  AfterViewInit,
  Input
} from '@angular/core';

@Directive({
  selector: '[directiveName]'
})
export class DirectiveHere implements OnInit {
  constructor (private templ: TemplateRef<any>,
               private parentViewRef: ViewContainerRef) {
  }

  @Input() directiveName: TemplateRef<any>;

  ngOnInit(): void {
    if (this.directiveName) {
      this.parentViewRef.createEmbeddedView(this.templ);
    }
  }
}

@Component({
  selector: 'app-root',
  template: `
    <div *directiveName="bool">
      <p>Test</p>
    </div>
    <label for="boolToggle">Toggle me!</label>
    <input id="boolToggle" type="checkbox" [(ngModel)]="bool"/>
  `
})
export class AppComponent {
  bool = true;
}
```



But you'll notice the toggle doesn't hide anything. Let's change that









```typescript
@Directive({
  selector: '[directiveName]'
})
export class DirectiveHere implements OnInit {
  constructor (private templ: TemplateRef<any>,
               private parentViewRef: ViewContainerRef) {
  }

  private _val: TemplateRef<any>;

  @Input() set directiveName(val: TemplateRef<any>) {
    this._val = val;
    this.update();
  }

  update(): void {
    if (this._val) {
      this.parentViewRef.createEmbeddedView(this.templ);
    }
  }
}
```





```typescript
update(): void {
  if (this._val) {
    this.parentViewRef.createEmbeddedView(this.templ);
  } else {
    this.parentViewRef.clear();
  }
}
```







This is Angular source code, unmodified with the exception of removing lines of code that would make an explaination harder to perform (not because of complexity, but just because of it's length)

````typescript
import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({selector: '[ngIf]'})
export class NgIf {
  private _context: NgIfContext = new NgIfContext();
  private _thenTemplateRef: TemplateRef<NgIfContext>|null = null;
  private _thenViewRef: EmbeddedViewRef<NgIfContext>|null = null;

  constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgIfContext>) {
    this._thenTemplateRef = templateRef;
  }

  @Input()
  set ngIf(condition: any) {
    this._context.$implicit = this._context.ngIf = condition;
    this._updateView();
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        if (this._thenTemplateRef) {
          this._thenViewRef =
            this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
        }
      }
    }
  }
}

export class NgIfContext {
  public $implicit: any = null;
  public ngIf: any = null;
}
````







### Microsyntax









#### `ngFor`



While this is 99% the source code from Angular, I have made some changes outside of removing lines that I want to note before moving forward:

- I have removed large parts of the API for simplicitiy's sake
- I have removed error checking for simplicity's sake
- Removed any references of generics
  - This includes making import changes and passing in `any` as a type alias with the same type name
    - Because of this, this code will not run by pasting into an Angular project, [I have spun up a stackblitz to show it working here]() so you can see the full demo without redaction



```typescript


import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

class NgForOfContext {
  constructor(
    public $implicit: any, public ngForOf: NgIterable, public index: number,
    public count: number) {}

  get first(): boolean { return this.index === 0; }

  get last(): boolean { return this.index === this.count - 1; }

  get even(): boolean { return this.index % 2 === 0; }

  get odd(): boolean { return !this.even; }
}

@Directive({selector: '[ngFor][ngForOf]'})
export class NgForOf implements DoCheck {
  @Input()
  set ngForOf(ngForOf: NgIterable) {
    this._ngForOf = ngForOf;
    this._ngForOfDirty = true;
  }

  private _ngForOf !: NgIterable;
  private _ngForOfDirty: boolean = true;
  private _differ: IterableDiffer | null = null;

  constructor(
    private _viewContainer: ViewContainerRef, private _template: TemplateRef<NgForOfContext>,
    private _differs: IterableDiffers) {}

  ngDoCheck(): void {
    if (this._ngForOfDirty) {
      this._ngForOfDirty = false;
      // React on ngForOf changes only once all inputs have been initialized
      const value = this._ngForOf;
      if (!this._differ && value) {
        this._differ = this._differs.find(value).create();
      }
    }
    if (this._differ) {
      const changes = this._differ.diff(this._ngForOf);
      if (changes) this._applyChanges(changes);
    }
  }

  private _applyChanges(changes: IterableChanges) {
    const insertTuples: Array<RecordViewTuple> = [];
    changes.forEachOperation(
      (item: IterableChangeRecord, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          const view = this._viewContainer.createEmbeddedView(
            this._template,
            new NgForOfContext(null, this._ngForOf, -1, -1),
            currentIndex
          );
          const tuple = new RecordViewTuple(item, view);
          insertTuples.push(tuple);
        } else if (currentIndex == null) {
          this._viewContainer.remove(adjustedPreviousIndex);
        } else {
          const view: any = this._viewContainer.get(adjustedPreviousIndex) !;
          this._viewContainer.move(view, currentIndex);
          const tuple = new RecordViewTuple(item, view);
          insertTuples.push(tuple);
        }
      });

    for (let i = 0; i < insertTuples.length; i++) {
      this._perViewChange(insertTuples[i].view, insertTuples[i].record);
    }

    for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
      const viewRef: EmbeddedViewRef = this._viewContainer.get(i) as any;
      viewRef.context.index = i;
      viewRef.context.count = ilen;
      viewRef.context.ngForOf = this._ngForOf;
    }

    changes.forEachIdentityChange((record: any) => {
      const viewRef: EmbeddedViewRef = this._viewContainer.get(record.currentIndex) as any;
      viewRef.context.$implicit = record.item;
    });
  }

  private _perViewChange(
    view: EmbeddedViewRef,
    record: IterableChangeRecord
  ) {
    view.context.$implicit = record.item;
  }
}

class RecordViewTuple {
  constructor(public record: any, public view: EmbeddedViewRef) {}
}
```













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








