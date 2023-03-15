---
{
    title: "Using JavaScript Classes without the `class` keyword",
    description: "",
    published: '2023-03-16T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['computer science'],
    attached: [],
    license: 'cc-by-4'
}
---

Classes in JavaScript are both powerful and weird. While they allow us to create named objects with similarly purposed methods and properties, they're often misunderstood because of nuanced in the language itself.

Let's look at:

- How to create an object
- 









Let's look at a basic JavaScript object and see what an analogous class might look like:

```javascript
class User {
    name = "Corbin",
    username = "crutchcorn",
    sayCatchphrase() {
        console.log("It depends");
    }
}
```

```javascript
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

```javascript
const userObject = {
    name: "Corbin",
    username: "crutchcorn",
    sayCatchphrase: function() {
        console.log("It depends");
    }
}
```

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

new User();
```

But it's more helpful to think of `User` as an analogous for `constructor`:

```javascript
function User() {
    this.name = "Corbin";
    this.username = "crutchcorn";
    this.sayCatchphrase = function() {
   		console.log("It depends");
	}
}
```

## Prototype Manipulation

Knowing this:

```javascript
function User() {
    this.name = "Corbin";
    this.username = "crutchcorn";
}

User.prototype.sayCatchphrase = function() {
   console.log("It depends");
}
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



