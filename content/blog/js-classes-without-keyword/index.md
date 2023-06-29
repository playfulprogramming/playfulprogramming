---
{
    title: "Using JavaScript Classes without the `class` keyword",
    description: "",
    published: '2023-07-16T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['computer science'],
    attached: [],
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

# Create public fields with the `contructor`

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

```javascript {1-4}
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

```javascript {4-6}
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

## Class Extension

```javascript
function Person() {
}

Person.prototype.test = "1"


function Pix() {
}

Pix.prototype = Object.create(Person.prototype)
Pix.prototype.other = "2"

(new Pix()).test // 1
(new Pix()).other // 2

(new Person()).test // 1
(new Person()).other // undefined
```





# Static Methods

```javascript
class User {
    name = "Corbin",
    username = "crutchcorn",
    static sayCatchphrase() {
        console.log("It depends");
    }
}
```

```javascript
function User() {
    this.name = "Corbin",
    this.username = "crutchcorn",
}

User.sayCatchphrase() {
    console.log("It depends");
}
```



