---
{
    title: "Using JavaScript classes without the `class` keyword",
    description: "Classes are a core feature of JavaScript - but they weren't always that way. How did earlier JS devs write classes? Let's learn how together.",
    published: '2023-06-29T21:52:59.284Z',
    tags: ['javascript'],
    license: 'cc-by-4'
}
---

Classes in JavaScript are both powerful and weird. While they allow us to create named objects with similarly purposed methods and properties, they're often misunderstood because of nuanced in the language itself.

But did you know that prior to 2015, JavaScript didn't even have a `class` keyword as part of the language?

Despite this, many programs at the time used classic Object Oriented Programming (OOP) methodologies such as using a class, extending it, and even adding static methods.

> But without a `class` method, how did they even make classes?

A good question! Let's answer that and, along the way, look at:

- How to create a "class" without the `class` keyword
- How to "extend" a "class"
- How to add static methods to our "class"

# Create public fields with the `constructor`

Let's look at a modern JavaScript class:

```javascript
class User {
    name = "Corbin",
    username = "crutchcorn",
    sayCatchphrase() {
        console.log("It depends");
    }
}
```

This is a fairly basic class that has two properties (`name` and `username`) as well as a `sayCatchphrase` method.

However, despite [the `class` keyword being added in 2015 with ES6](https://262.ecma-international.org/6.0/#sec-class-definitions), [public fields like this weren't added until ECMAScript 2020](https://github.com/tc39/proposal-class-fields#implementations):

[![A JavaScript compatibility table showing support for `class` added in Node 6, but "Public fields" added in Node 12](./class_compat.png)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

> So then how did classes get properties in years after 2015 but before 2020?

The answer? The `constructor` method:

```javascript {2-5}
class User {
    constructor() {
        this.name = "Corbin",
        this.username = "crutchcorn",
    }
    
    sayCatchphrase() {
        console.log("It depends");
    }
}
```

In fact, using this `constructor` method, we can even add the method as well:

```javascript {5-7}
class User {
    constructor() {
        this.name = "Corbin",
        this.username = "crutchcorn",
        this.sayCatchphrase = function() {
            console.log("It depends");
        }
    }
}
```

> An interesting fact, for sure - but it doesn't answer the question of how to make a class.

Don't worry, we're getting there!

<!-- in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of articles like this." button-text="Visit our Open Collective" button-href="https://opencollective.com/unicorn-utterances" -->

# Create a class without the `class` keyword

Before we answer the question of "how to make a class in JavaScript without the `class` keyword", let's take a step back and look at what a `class` is actually doing...

After all, a class like `User` above might create an object like so:

```javascript
const userObject = {
    name: "Corbin",
    username: "crutchcorn",
    sayCatchphrase: function() {
        console.log("It depends");
    }
}
```

Knowing this, we might think that the best way to make a class without the keyword is to return an object from a function:

```javascript
function User() {
    return {
        name: "Corbin",
        username: "crutchcorn",
        sayCatchphrase: function() {
            console.log("It depends");
        }
    }
}
```

And sure enough, if we run this code using:

```javascript
const user = new User();
user.sayCatchphrase(); // "It depends"
```

It will run as-expected. However, it won't solve all cases. EG:

```javascript
new User() instanceof User; // false
```

Instead, what if we just converted the aforementioned class' `constructor` body to a function?:

```javascript
function User() {
    this.name = "Corbin";
    this.username = "crutchcorn";
    this.sayCatchphrase = function() {
   		console.log("It depends");
	}
}
```

Now, not only do we have the method working, but `instanceof` works as well:

```javascript
const user = new User();
user.sayCatchphrase(); // "It depends"
new User() instanceof User; // true
```

## Prototype Manipulation

> But surely changing from a class to a function doesn't allow you to change the prototype in the same way?

Actually, it does! That's how this whole thing works!

Consider the following code:

```javascript
function User() {
    this.name = "Corbin";
    this.username = "crutchcorn";
}

User.prototype.sayCatchphrase = function() {
   console.log("It depends");
}
```

This is the same way of adding a method as the `this.sayCatchphrase` method as before, but is done by changing the prototype.

We can test this code still works by running:

```javascript
const user = new User();
user.sayCatchphrase(); // "It depends"
```



## Create an extended class using the `super` method

Before we talk about function-based class extension, we need to talk about pre-ES2020 class creation once again.

See, when we convert the following code to use a `constructor`:

```javascript
class Person {
	personality = "quirky";
}

class Corbin extends Person {
	name = "Corbin";
}
```

Like so:

```javascript
class Person {
    constructor() {
    	this.personality = "quirky";
    }
}

class Corbin extends Person {
	constructor() {
    	this.name = "Corbin";
    }
}
```

And try to initialize it:

```javascript
const corn = new Corbin()
```

We get the following error:

```
Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    at new Corbin (<anonymous>:9:6)
```

This is because we're not using the `super()` method to tell our extended class to utilize the parent's class' methods.

To fix this, we'll add that method to the extended class' `constructor`:

```javascript {9}
class Person {
    constructor() {
    	this.personality = "quirky";
    }
}

class Corbin extends Person {
	constructor() {
		super();
    	this.name = "Corbin";
    }
}
```

Now our `Corbin` constructor work work as-intended:

```javascript
const corn = new Corbin();
console.log(corn.name); // "Corbin";
console.log(corn.personality); // "quirky";
```

# Extend a functional class using `Object.create`

Let's now convert our `Person` and `Corbin` classes to use functions instead of the `class` keyword.

The person class is easy enough:

```javascript
function Person() {
    this.personality = "quirky";
}
```

And we _could_ use [the `call` method to bind `Person`'s `this` to `Corbin`](/posts/javascript-bind-usage#bind), like so:

```javascript
function Corbin() {
    Person.call(this);
    this.name = "Corbin";
}
```

And it appears to work at first:

```javascript
const corn = new Corbin();
console.log(corn.name); // "Corbin";
console.log(corn.personality); // "quirky";
```

But now, once again, if we call `instanceof` it doesn't support the base class:

```javascript
new Corbin() instanceof Corbin; // true
new Corbin() instanceof Person; // false
```

To fix this, we need to tell JavaScript to use the `prototype ` of `Person` and combine it with the prototype of `Corbin`, like so:

```javascript
function Person() {
}

Person.prototype.personality = "quirky";

function Corbin() {
}

Corbin.prototype = Object.create(Person.prototype);
Corbin.prototype.name = "Corbin";

const corn = new Corbin();
corn.personality // "quirky"
corn.name // "Corbin"

const pers = new Person();
pers.personality // "quirky"
pers.name // undefined
```

> Notice how we're using [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) to create a base object from the other prototype

# Static Methods

Let's wrap up this article by talking about how to add static methods to a functional class.

As a refresher, this is what a static method looks like on a ES2020 class:

```javascript
class User {
    name = "Corbin",
    username = "crutchcorn",
    static sayCatchphrase() {
        console.log("It depends");
    }
}

User.sayCatchphrase(); // "It depends"
User.name // undefined

const corn = new User();
corn.name; // "Corbin"
```

This can be added by providing a key to the function's name outside of the function body:

```javascript
function User() {
    this.name = "Corbin",
    this.username = "crutchcorn",
}

User.sayCatchphrase() {
    console.log("It depends");
}


User.sayCatchphrase(); // "It depends"
User.name // undefined

const corn = new User();
corn.name; // "Corbin"
```

# Conclusion

This has been an interesting look into how to use JavaScript classes without the `class` keyword.

Hopefully, this has helped dispel some misunderstandings about how classes work in JavaScript or maybe just given historical context for why some code is written how it is.

Like learning JavaScript's fundamentals?

[Check out my article that explains how to use the `.bind` keyword in JavaScript.](/posts/javascript-bind-usage#bind)

Read it and want more?

[Check out my book that teaches the introduction of React, Angular, and Vue all at once; "The Framework Field Guide".](https://framework.guide)

Until next time!
