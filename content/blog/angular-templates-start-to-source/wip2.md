# Template Variable Access

There are two types of template variables: _template input variables_ and _template reference variables_.

## Template Input Variables

Template input variables are the variables you bind to a template when using context. `<ng-template let-var>`. _These variables are defined from the context that is applied to the template_. As a result *these templates are able to be accessed by the children of the templates, but not from a higher level* - as the context is not defined above the template:

```html
<!-- ✅ This is perfectly fine -->
<ng-template #templateOne let-varName><p>{{varName}}</p></ng-template>

<!-- ❌ This will throw errors, as the template context is not available from anywhere that isn't a child of the template -->
<ng-template #templateTwo let-thisVar></ng-template>
<p>{{thisVar}}</p>
```

## Template Reference Variables

Template reference variables, however, have a much more complex answer in regards to how they're able to be accessed.

As a small review of what they are:
_A template reference variable is a variable assigned to a tag so that other items in the same template are able to reference that tag._

```html
<div>
	Hello There!
	<ng-template #testingMessage><p>Testing 123</p></ng-template>
</div>
<ng-template [ngTemplateOutlet]="testingMessage"></ng-template>

<!-- Will now show the following in the DOM: -->
<!--   <div>Hello There!</div>   -->
<!-- <p>Hi There</p> -->
```

In this example, we're getting a reference to `testingMessage` template to be able to provide as an input. We're then passing that value to another `ng-template`'s `ngTemplateOutlet` directive to get it rendering on screen. Because the variable is defined in the same *view hierarchy tree* level, it is accessible from an element on a higher DOM tree node. This view hierarchy tree position defines all of the limitations on accessing a template reference variable.

### What Kind of Tree??

Okay, so let's take that last sentence and expand on it a bit. First, a bit of background!

So, when you build out an HTML file, you're defining the shape the document object model (DOM) takes. When you load a file similar to this:

```html
<!--index.html-->
<!-- ids are only added for descriptive purposes -->
<main id="A">
	<ul id="B">
		<li id="C">Item 1</li>
		<li id="D">Item 2</li>
	</ul>
	<p id="E">Text here</p>
</main>
```

_The browser takes the items that've been defined in HTML and turns them into a tree that the browser can understand how to layout and draw on the screen_. That tree, internally, might look something like this:

```
   +--->B---+->C
A--+        |
   |        +->D
   +--->E
```
> Each element in this chart align the ID to the element in the chart

The same could be said for Angular templates! _While Angular renders to the DOM the same as HTML, Angular also has it's own internally tree to keep track of templates defined in Angular_. 

The reason Angular has it's own tree is due to the dynamic nature of Angular. In order to understand how to hide content on the fly, change out the content on screen, and know how to keep consistent expected interactions between all of this, Angular needs to have a tree to keep track of it's state.

Because this tree is not the DOM itself, it shouldn't be confused with the DOM itself. _The tree Angular uses to track it's state is called the "view hierarchy tree"_. This tree is composed of various "views". _A view is a grouping of elements and is the smallest grouping of elements that can be created or destroyed together_.

A simple example of a view is a simple `ng-template`:

```html
<ng-template>I am a view</ng-template>
<ng-template>
  <p>So am I!</p>
  <div>Even with me in here? <span>Yup!</span></div>
</ng-template>
```

When this is rendered on screen (say, by using an `ngTemplateOutlet`), it becomes an "embedded view". This is because you're placing a view into another view. I'll explain:

```html
<ng-template>
  <p>I am in a view right now</p>
  <ng-template #rememberMsg>
    But as you might recall, this is also a view
  </ng-template>
  <ng-template [ngTemplateOutlet]="rememberMsg" [ngTemplateOutletContext]="{$implicit: 'So when we render it, it\'s a view within a view'}"
</ng-template>
```

It's this composition of views that makeup the "view higharchy". A view can act as a "view container" for other views (as it is here), can be moved around, etc. 

As a result of this "view container" being another view itself, it can also be added as a view to another view container, so on so forth.

### A Word on Components

If you're looking for them, you might notice a few similarities between component templates and `ng-template`s. Both of them allow for values to be passed into them (`@Input` props for components, context for templates), both of them are defined with the same template syntaxes (with the same HTML-like syntax).

Well, there's a good reason for that: _A component is actually just a directive with a special view - a "host view" (defined by the `template` or `templateUrl` field in the decorator) associated with it_. This host view can also be attached to another view by using the `selector` value of that component's.

```typescript
@Component({
  selector: "child-component",
  template: `
		I am the host view, and act as a view container for other views to attach to
		<div><p>I am still in the child-component's host view</p></div>
		<ng-template #firstChildCompTempl>
			I am in a view outside of the child-component's host view
		</ng-template>
	  <ng-template [ngTemplateOutlet]="firstChildCompTempl"
                 [ngTemplateOutletContext]="{$implicit: 'And now I'm attaching that template to the host view by embedding the view'}">
		</ng-template>
	`
})
export class ChildComponent {}


@Component({
  selector: 'app',
  template: `
		I am in app's host view, and can act as a view container for even other host views by using the component's selector
		<child-component></child-component>
	`
})
export class AppComponent {}
```

## Template Variable View 

So, as mentioned before, templates (and by proxy: views) can be stacked into one-another like so:

```html
<ng-template #helloThereMsg>
	Hello There!
	<ng-template #testingMessage><p>Testing 123</p></ng-template>
</ng-template>
```

Obviously, this by itself would not render anything, but let's change that. Let's say I want to use a template outlet for both of these templates outside of the `helloThereMsg` template declaration.

You might think, based on what we know about template reference variables, that rendering the `testingMessage` template as well would be a trivial task - they're accessable accross the template, no? Well, let's try:

```html
<ng-template #helloThereMsg>
	Hello There!
	<ng-template #testingMessage><p>Testing 123</p></ng-template>
</ng-template>
<div>
  <ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
</div>
<ng-template [ngTemplateOutlet]="testingMessage"></ng-template>
```

<iframe src="https://stackblitz.com/edit/start-to-source-11-broke-template-var?embed=1&file=src/app/app.component.ts" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
But you'll notice that `testingMessage` isn't rendering, why is that?

Template reference variables bind to the view that they're present in. Like with CSS applied to a DOM element, they apply to the element itself and children, but not the parent.


```
           +-->helloThereMsg view--+-->testingMessage
host view--+
           +--->div
```

Because the `helloThereMsg` template creates it's own view and the `testingMessage` template variable is defined, it is only able to accessable from within the `helloThereMsg` template. Because we're trying to reference it from the host view, it can't find the variable, is marked as `undefined` as a value, and does not render anything (as that's the default behavior of passing `undefined` to `ngTemplateOutlet`)

In order to fix this behavior, we'd need to move the second `ng-template` into the `helloThereMsg` template view

```html
<ng-template #helloThereMsg>
	Hello There!
	<ng-template #testingMessage><p>Testing 123</p></ng-template>
	<ng-template [ngTemplateOutlet]="testingMessage"></ng-template>
</ng-template>
<div>
  <ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
</div>
```

<iframe src="https://stackblitz.com/edit/start-to-source-12-fixed-template-var?embed=1&file=src/app/app.component.ts" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
## Timings - The Bane of any JavaScript developer, now with `ViewChild`

But the example immediately above doesn't have the same behavior as the one before that. We wanted to get:

```html
<div>Hello there!</div>
<p>Testing 123</p>
```

And instead got:

```html
<div>Hello there! <p>Testing 123</p></div>
```

Luckily, we've already covered `@ViewChild`, which is able to get references from further down the view tree than the template is able to.

```typescript
@Component({
  selector: "my-app",
  template: `
    <ng-template #helloThereMsg>
      Hello There!
      <ng-template #testingMessage>Testing 123</ng-template>
    </ng-template>
    <ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
    <ng-template [ngTemplateOutlet]="testingMessageCompVar"></ng-template>
  `
})
export class AppComponent {
  @ViewChild("testingMessage", { static: false }) testingMessageCompVar;
}
```

Something you'll see if you open the console in that example is the classic error:

```
Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'ngTemplateOutlet: undefined'. Current value: 'ngTemplateOutlet: [object Object]'.
```

This error is being thrown by Angular's developer mode (so if you're running a production build, this error will not show). But why is this error happening? What can we do to fix it?

This, my friends, is where the conversation regarding change detection, lifecycle methods, and the `static` prop come into play.

## Change Detection, How Does It Work

While diving into change detection in depth is a massive article all on it's own. While I'm not wanting to deviate too badly from the general discussion around templates, having a bit of understanding on change detection will help in general. That said, here's a general overview of what change detection is and how it applies to that example:

_Angular has specific hooks of times when to update the UI_. Without these hooks, Angular has no way of knowing when data that's shown on screen is updated. These hooks essentially simply check when data has changed. While these checks are imperfect, they has default behavior that will handle most cases and and the ability to overwrite it and even manually trigger a check.

One of the default checks that is ran when Angular is starting the intial render of a component. During this time, it will do a check of all of the values stored within the component's state. Afterwards, it will run checks whenever any data has changed whether or not to update the UI.

These checks trigger the lifecycle method `DoCheck`, which you can manually handle. 

```typescript
export class AppComponent implements DoCheck, OnChanges, AfterViewInit {
  realMsgVar: TemplateRef<any>;
  @ViewChild("testingMessage", { static: false }) testingMessageCompVar;

  ngDoCheck() {
    console.log("ngDoCheck: The template is present?", !!this.testingMessageCompVar);
    this.realMsgVar = this.testingMessageCompVar;
  }

  ngOnChanges() {
    console.log("ngOnChanges: The template is present?", !!this.testingMessageCompVar);
  }
  
  ngAfterViewInit() {
    console.log('ngAfterViewInit: The template is present?', !!this.testingMessageCompVar);
  }
}
```

<iframe src="https://stackblitz.com/edit/start-to-source-13-lifecycle-explain?embed=1&file=src/app/app.component.ts" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

```diff
- ngDoCheck: The template is present? false
+ ngAfterViewInit: The template is present? true
+ ngDoCheck: The template is present? true
```


When adding in an `ng-template`, 


https://blog.angular-university.io/angular-debugging/














[ADDLINK: At the start of the section about `ViewChild`](), I asked you to temporarily set aside the `static` prop and what it does to ensure the concepts are grasped properly. I think it's a good time to cover the prop in further detail.

While the `ViewChild` and `ContentChild` properties are very good at what they do, they can be confusing when it comes to what lifecycle methods they're available in. This is partially why I've been using `ngAfterViewInit` and `static: false` for the examples thus far.

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

The reasoning behind this is that the intended query result is nested inside of a template. This template _This template creates an "embedded view"_, an injected view created from a template when said template is rendered. This embedded view is difficult to see from anything above it in the parent view, and is only exposed properly after change detection is ran. Because change detection is ran after `ngOnInit`, it is `undefined` until the `ngAfterViewInit` lifecycle method.

>  If you understood that, go get yourself some ice-cream, you totally deserve it. If you didn't, that's okay! We all learn at different paces and I'm sure this post could be written a dozen other ways - maybe try re-reading some stuff, tinking with code, or asking any questions you might have from myself or others.

As a result, **if you have your code inside of a template that's being rendered that you want to grab using `ViewChild`/`ContentChild`  - you will need to use an `ngAfterViewInit` rather than a `ngOnInit`.** For similar reasons (change detection being a tricky thing as it is), **you'll need to access the plural APIs ( `ViewChildren`/`ContentChildren`) with the `ngAfterViewInit` lifecycle as well.**

**This also effects `*ngIf` and `*ngFor` structural directives**, so if you've recently added one of those to your template, and have noticed that you've had to switch your lifecycle methods to using `ngAfterViewInit`, you have a bit of an explanation ([as structural directives use templates internally](#structural-directives-what-sorcery-is-this))

#### Great Scott - You Control The Timing!

https://github.com/angular/angular/pull/28810

While this behavior can be a bit confusing, Angular 8 brought an option to the `ViewChild` and `ContentChild` APIs to make this a bit easier to manage mentally. While **these APIs won't enable use of templated queries in `ngOnInit`**, it will make bugs when adding templated queries (such as `ngIf`) less likely to create new bugs.

For example, if you'd like to force all queries to not run until `ngAfterViewInit`, regardless of using templated views, you can enable that with the `{static: false}` option configuration:

```typescript
@ContentChild(ComponentHere, {read: ElementRef, static: false}) foo: ElementRef;
```

However, if you'd like to try to disallow any templated views from being accessed by a query, you can pass the `static: true` option:

```typescript
@ContentChild(ComponentHere, {read: ElementRef, static: true}) foo: ElementRef;
```


Keep in that if you don't define a `static` prop, it will have the same API behavior as it did in the past. Additionally, because `ContentChildren`/`ViewChildren` don't have the same API nuance, the `static` option prop does not affect those APIs.

# Why

But it might seem silly to be using to use `ViewChild` for a template reference variable 