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







To showcase:
```html
<div>
  <!--❗However, you CAN reference template REFERENCE variables from it's siblings -->
  <ng-template [ngTemplateOutlet]="templateOne"></ng-template>
</div>
<!-- ❌ But you cannot use reference variables from higher up the view tree -->
<ng-template [ngTemplateOutlet]="templateTwo"></ng-template>
```

