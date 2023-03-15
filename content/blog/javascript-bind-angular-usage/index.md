---
{
    title: "JavaScript `this` binding & Angular Usage",
    description: "",
    published: '2023-03-16T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['computer science'],
    attached: [],
    license: 'cc-by-4'
}
---

## What does `.bind` mean and why did it fix our problem?

OK, so here's the deal. Remember this headache inducing sentence that I just used as an explanation:

> This is because `this` is being unbound from the component instance within `addEventListener`, and we need to forcibly rebind the `count` to the component instead.

Even I'm ready to admit that, while it is _technically correct_, it's absolute gibberish to anyone that's already in the know.

Here's what's actually happening.

This behavior isn't unique to Angular, it's a JavaScript "feature" of `this` that's introduced a bug in our code.

Take the following two classes:

```javascript
class Cup {
	contents = "water";
    
    consume() {
        console.log("You drink the ", this.contents, ". Hydrating!");
    }
}

class Bowl {
    contents = "chili";
    
    consume() {
        console.log("You eat the ", this.contents, ". Spicy!");
    }
}

cup = new Cup();
bowl = new Bowl();
```

If we run:

```javascript
cup.consume();
```

It will `console.log` "You drink the water. Hydrating!". Meanwhile, if you run:

```javascript
bowl.consume();
```

It will `console.log` "You eat the chili. Spicy!".

Makes sense, right?

Now, what do you think will happened if I do the following?

```javascript
cup = new Cup();
bowl = new Bowl();

cup.consume = bowl.consume;

cup.consume();
```

While you might think that it would log `"You eat the chili. Spicy!"`, it doesn't! Instead, it logs: `"You drink eat the water. Spicy!"`.

Why?

The `this` keyword isn't bound to the `Bowl` class, like you might otherwise expect. Instead, the `this` keyword searches for the [scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) of the caller. 

> To explain this better using plain English, this might be reiterated as: "JavaScript looks at the class that uses the `this` keyword, not the class that creates the `this` keyword"

Because of this:

```javascript
cup = new Cup();
bowl = new Bowl();

// This is assigning the `bowl.consume` message
cup.consume = bowl.consume;

// But using the `cup.contents` `this` scoping
cup.consume();
```

![Imagine bowl and cup as two boxes. Inside of the boxes are 2 items each. The "Bowl" box contains a yellow container of "Chili", a red "consume" method. The "Cup" box contains a blue container of "Water" and a purple "consume" method. When we assign the red "bowl" consume method to `cup` and call "consume", it will still have `this` pointed towards "Water"](./this_explainer_chart.png)



This can be a problem at times. If we want `bowl.consume` to _always_ reference the `this` scope of `bowl`, then we can use `.bind` to force `bowl.consume` to use the same `this` method.

```javascript
cup = new Cup();
bowl = new Bowl();

// This is assigning the `bowl.consume` message and binding the `this` context to `bowl`
cup.consume = bowl.consume.bind(bowl);

// Because of this, we will now see the output "You eat the chili. Spicy!" again
cup.consume();
```



![When using the "bind" method, you're telling cup.consume to always reference "bowl"'s binding.](./bind_explainer.png)

## What does `.bind` have to do with an Angular event listener?

> Both `cup` and `bowl` are both classes, which creates a scope. This makes sense why `this` is being reassigned, by what does this have to do with `addEventListener`?

To answer this question, let's look back at a minimal version of our unbound Angular code. 

```typescript
@Component({
    selector: 'paragraph',
    template: `
		<button #btn>Add one</button>
    	<p>Count is {{count}}</p>
    `
})
class RenderParagraphComponent implements AfterViewInit {
    @ViewChild('btn') btn: ElementRef<HTMLElement>;
    
    count = 0;
    
    addOne() {
        // What is `this` being set to?
        this.count++;
    }
    
    ngAfterViewInit() {
        this.btn.nativeElement.addEventListener('click', this.addOne);
    }
}
```

Remember that `this` is being bound to _something_. To understand what that might be, let's do a small rewrite of the code:

```typescript
// ngAfterViewInit
const button = this.btn.nativeElement;
button.onClick = this.addOne;
```

We can then think of your browser calling an event on `button` to look something like this:

```javascript
/**
 * This is a representation of what your browser is doing when you click the button.
 * This is NOT how it really works, just an explainatory representation
 */
function clickButton() {
	button.onClick();
}
```

Now that we have that code written to be a little simpler, let's chart out what's happening behind-the-scenes:

![When onClick is assigned to addOne, it doesn't carry over the `this`, because it isn't bound. As a result, when button.onClick is called, it will utilize Button's `this` value.](./component_this_explainer.png)

Here, we can see that, despite assigning `component.addOne` to `button.onClick`, when the browser calls `button.onClick`, the `this` keyword (from within `addOne`) is actually pointing at the scope of the [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) `button`, not the Angular `Component` instance.

This means that within this code:

```typescript
addOne() {
	this.count++;
}

ngAfterViewInit() {
    this.btn.nativeElement.addEventListener('click', this.addOne);
}
```

`this.count` is pointing at the Button HTML DOM instance instead of the component instance.

To prove this, let's `console.log` the DOM element's `count` value:

```typescript
@Component({
    selector: 'paragraph',
    template: `
		<button #btn>Add one</button>
		<button (click)="logButtonCount()">Click me</button>
    `
})
class RenderParagraphComponent implements AfterViewInit {
    @ViewChild('btn') btn: ElementRef<HTMLElement>;

    addOne() {
        // What is `this` being set to?
        this.count++;
        console.log(this); // Will output an HTMLElement instance of `button`
    }
    
    ngAfterViewInit() {
        // Otherwise `logButtonCount` will show `NaN`
        this.btn.nativeElement.count = 0;
        this.btn.nativeElement.addEventListener('click', this.addOne);
    }
    
    logButtonCount() {
        console.log(this.btn.nativeElement.count); // This increments every time `addOne` is ran
    }
}
```

This is the reason we utilized `.bind` in the previous Angular example: it forces `this.count` to be bound to the component instance.

```typescript
addOne = function () {
  this.count++;
}.bind(this);
```


## Can we solve this without `.bind`?

> The `.bind` code looks obtuse and increases the amount of boilerplate in our components. Is there any other way to solve the `this` issue without `bind`?

Yes! Introducing: Arrow functions.

When learning JavaScript, you may have come across an alternative way of creating functions. Sure, there's the original `function` keyword:

```javascript
function SayHi() {
	console.log("Hi");
}
```

But if you wanted to remove a few characters, you could alternatively use an "arrow function" syntax instead:

```javascript
const SayHi = () => {
	console.log("Hi");
}
```

Some people even start explanations by saying that there are no differences between these two methods, but that's not quite right.

Take our `Cup` and `Bowl` example from earlier:

```javascript
class Cup {
	contents = "water";
    
    consume() {
        console.log("You drink the ", this.contents, ". Hydrating!");
    }
}

class Bowl {
    contents = "chili";
    
    consume() {
        console.log("You eat the ", this.contents, ". Spicy!");
    }
}

cup = new Cup();
bowl = new Bowl();

cup.consume = bowl.consume;

cup.consume();
```

We already know that this example will log `"You eat the water. Spicy!"` when `cup.consume()` is called.

But what happens if we instead change `Bowl.consume()` from a class method to an arrow function:

```javascript
class Cup {
	contents = "water";
    
    consume = () => {
        console.log("You drink the ", this.contents, ". Hydrating!");
    }
}

class Bowl {
    contents = "chili";
    
    consume = () => {
        console.log("You eat the ", this.contents, ". Spicy!");
    }
}

cup = new Cup();
bowl = new Bowl();

cup.consume = bowl.consume;

// What will this output?
cup.consume();
```

 While it might seem obvious what the output would be, if you thought it was the same `"You eat the water. Spicy!"`  as before, you're in for a suprise.

Instead, it outputs: `"You eat the chili. Spicy!"`, as if it were bound to `bowl`.

> Why does an arrow function act like it's bound?

That's simply the semantic meaning of an arrow function! While `function` (and methods) both implicitly bind `this` to a callee of the function, an arrow function is bound to the original `this` scope and cannot be modified.

Even if we try to use `.bind` on an arrow function to overwrite this behavior, it will never change its scope away from `bowl`.

```javascript
cup = new Cup();
bowl = new Bowl();

// The `bind` does not work on arrow functions
cup.consume = bowl.consume.bind(cup);

// This will still output as if we ran `bowl.consume()`.
cup.consume();
```

Knowing this, we can refactor our Angular component to set `addOne` to an arrow function instead of using `.bind`:

```typescript
@Component({
    selector: 'paragraph',
    template: `
		<button #btn>Add one</button>
    	<p>Count is {{count}}</p>
    `
})
class RenderParagraphComponent implements AfterViewInit, OnDestroy {
    @ViewChild('btn') btn: ElementRef<HTMLElement>;
    
    count = 0;
    
    addOne = () => {
        this.count++;
    }
    
    ngAfterViewInit() {
        this.btn.nativeElement.addEventListener('click', this.addOne);
    }
    
    ngOnDestroy() {
        this.btn.nativeElement.removeEventListener('click', this.addOne);
    }
}
```

Now our component works as intended and has minimal boilerplate to solve the problem of `this`!
