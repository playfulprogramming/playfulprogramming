---
{
title: "Typescript - Tips & Tricks - Optional modifier",
published: "2021-03-03T07:03:28Z",
edited: "2021-09-09T07:04:35Z",
tags: ["typescript", "webdev"],
description: "Hi guys and welcome back, Today I'll talk about the optional modifier. Sometimes we have objects that...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-optional-modifier-48pg",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Hi guys and welcome back,
Today I'll talk about the optional modifier.
Sometimes we have objects that have some optional properties.
In these cases, we need to identify the optional and the required properties, so the consumers can know what is required and what not.
To do this in typescript we have a special modifier named "optional" and it is identified by a question mark (_?_).
Let's see an example:
```ts
export type Person = {
  name: string;
  surname: string;
  email: string;
  phone?: string;
};

const person1: Person = {
  name: "name1",
  surname: "surname1",
  email: "email1@email1.it",
};

const person2: Person = {
  name: "name2",
  surname: "surname2",
  email: "email2@email2.it",
  phone: "123",
};
```
In this example we can see the optional modifier in action, the "phone" property is marked as optional so in the "person1" object we can avoid setting the "phone" property.
This modifier, also, could be used in the functions' parameters if we have one or more optional parameters.
A simple example.
```ts
function printPerson(name: string, email: string, phone?: string): void {
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  if (phone) console.log(`Phone: ${phone}`);
}

printPerson("name1", "email1@email1.it");
/*
  Name: name1
  Email: email1@email1.it
*/
printPerson("name2", "email2@email1.it", "123");
/*
  Name: name2
  Email: email2@email1.it
  Phone: 123
*/
```
We can see how in the first example we can avoid setting the phone parameter because it's optional.

From the optional modifier, it's all.
See you soon guy!