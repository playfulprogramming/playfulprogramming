---
{
title: "Cracking the JavaScript Code: Unveil the Magic of Object Property Descriptors",
published: "2023-11-02T06:35:07Z",
edited: "2023-11-09T07:27:01Z",
tags: ["javascript", "object", "descriptor"],
description: "👋 Hey, JavaScript developers!  Ever wondered what makes your objects tick? Or how to go all...",
originalLink: "https://blog.delpuppo.net/cracking-the-javascript-code-unveil-the-magic-of-object-descriptors",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "The JavaScript you don't know",
order: 7
}
---

👋 Hey, JavaScript developers!

Ever wondered what makes your objects tick? Or how to go all "Inception" on your JavaScript code by manipulating object properties at a deeper, more granular level? Well, you're in luck! Today, we're diving into the magical world of Object Property Descriptors in JavaScript—a realm where you become the puppet master of your objects. 🎭

Get ready for a roller coaster ride that takes you through the hidden alleys of JavaScript's objects. By the end of this post, you'll be wielding Object Property Descriptors like a wizard casting spells, giving you full control over properties, and even the behaviour of your objects. 🧙

## What is a JavaScript Object Property Descriptor?

In JavaScript, objects are more than just key-value pairs. They're intricate entities with characteristics that often go unnoticed, hidden beneath the surface like an iceberg in an ocean of code. Welcome to the fascinating realm of Object Property Descriptors, a tool that lets you truly tap into the full potential of JavaScript objects.

An Object Property Descriptor is essentially a metadata object that details how a property on an object behaves. It's like the DNA of the property, encoding its attributes and defining its characteristics. You can think of an Object Property Descriptor as a control panel, giving you knobs and levers to fine-tune how a property can be accessed, modified, enumerated, or deleted.

Here are the attributes you can configure with an Object Property Descriptor:

- `value`: The actual value of the property. Simple enough, right? 📦

- `writable`: Determines if the property value can be changed. It's like a lock that you can engage or disengage at will. 🔒

- `enumerable`: Controls whether the property shows up during enumeration, like when you use a `for...in` loop or `Object.keys()`. It's like a spotlight—or lack thereof—on your property. 🔦

- `configurable`: Decides if the property can be deleted or has its attributes changed. Think of it as the ultimate veto power. 🛑

You can access and modify these attributes using built-in JavaScript methods like `Object.getOwnPropertyDescriptor()`, `Object.defineProperty()`, and `Object.defineProperties()`. These are your magic wands to perform spellbinding feats of object manipulation!

For example, to make a property read-only, you can set its `writable` attribute to `false`. Or if you want to hide a property from enumeration, just set the `enumerable` attribute to `false`. It's like tailoring your object properties to fit your exact needs, almost as if you're crafting a bespoke suit!

## **Object Property Descriptors in Practice**

It's time to get our hands dirty and jump into the practical aspects of using Object Property Descriptors in JavaScript.

### 1️⃣ Accessing Descriptors with `Object.getOwnPropertyDescriptor()`

Let's start with the basics. Ever wondered what the descriptor of an existing object property looks like? `Object.getOwnPropertyDescriptor()` is your answer. It takes two arguments: the object itself and the property name as a string.

```js
const myObj = { age: 30 };
const descriptor = Object.getOwnPropertyDescriptor(myObj, 'age');

console.log(descriptor); // Output: { value: 30, writable: true, enumerable: true, configurable: true }
```

Here, the `descriptor` object shows the default attributes: `value`, `writable`, `enumerable`, and `configurable`. No surprises, everything is set to `true` by default! 🎉

### 2️⃣ Defining Descriptors with `Object.defineProperty()`

Okay, ready to step it up? What if you want to create a property with custom attributes? Say hello to `Object.defineProperty()`. It takes three arguments: the object, the property name, and the descriptor object.

```js
const person = {};
Object.defineProperty(
    person,
    'name',
    {
        value: 'Alice',
        writable: false,
        enumerable: true,
        configurable: false
    }
);

console.log(person.name); // Output: Alice
```

Now, [`person.name`](http://person.name) is read-only and not configurable but still enumerable. Try changing its value, and JavaScript will be like, "Nice try, buddy!" 🤨

### 3️⃣ Batch Operation with `Object.defineProperties()`

But wait, there's more! What if you want to define multiple properties at once? `Object.defineProperties()` has got your back.

```js
const animal = {};
Object.defineProperties(animal, {
    name: {
        value: 'Dog',
        writable: true
    },
    sound: {
        value: 'Woof',
        enumerable: false
    }
});

```

Here, `animal` gets two properties, each with its own set of descriptors. Efficient, isn't it? 🤓

### 4️⃣ Computed property with `Object.defineProperty()`

But wait, there's more again. What if you want to define a property that depends on other ones? `Object.defineProperty()` has got your back again.

```js
const person = {
  firstName: 'John',
  lastName: 'Doe',
};

// Define a read-only property
Object.defineProperty(person, 'fullName', {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  enumerable: true,
});

console.log(person.fullName); // John Doe
```

Here `person` has three properties, `firstName`, `lastName` and `fullName`. `fullName` depends on the others and it's enumerable so that it's included in the `for...in` loop and `Object.keys()` method.

Ok, I think the idea now it's clear and you can use your imagination to combine these configurations to provide the best descriptors for your objects.

To find out more don't waste my YouTube video on my [YouTube Channel](https://www.youtube.com/@Puppo_92)

<iframe src="https://www.youtube.com/watch?v=AHLdUs8LtIA"></iframe>

## Conclusion

In conclusion, Object Property Descriptors are a powerful feature of JavaScript that allows you to manipulate and define object properties with fine-grained control. This advanced feature offers developers the ability to create more dynamic and flexible code.

Whether you're a junior developer or an expert, understanding Object Property Descriptors can help you level up your JavaScript skills.

So go ahead, tinker with your code, challenge the norms, and keep pushing the boundaries. The JavaScript universe is your playground! 🚀

You can find the code of this article [here](https://github.com/Puppo/javascript-you-dont-know/tree/07-object-descriptor).

{% embed https://dev.to/puppo %}
