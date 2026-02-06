---
{
title: "Typescript - Tips & Tricks - Non-null assertion operator",
published: "2021-03-15T07:13:45Z",
edited: "2021-09-09T07:05:12Z",
tags: ["typescript", "webdev"],
description: "In some cases, you have a field that you initialize in a method, and if you follow the flow of the...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-non-null-assertion-operator-21eb",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 13
}
---

In some cases, you have a field that you initialize in a method, and if you follow the flow of the code you are sure that this field is initialized but typescript doesn't understand it.
An example

```ts
type Person = {
  name: string;
};

let person: Person;

function initialize() {
  person = { name: "name" };
}

initialize();
console.log("Hello", person.name); // Variable 'person' is used before being assigned.
```

In this case, you can see how the typescript compiler doesn't understand that the "person" field isn't null but it's initialized.
To resolve this problem, the typescript language exposes us the *"Non-null assertion operation"*(!). This operator says to the compiler that the field isn't null or undefined but it's defined.
The previous example can be reviewed in this way

```ts
type Person = {
  name: string;
};

let person: Person;

function initialize() {
  person = { name: "name" };
}

initialize();
console.log("Hello", person!.name);
```

As you can see, in this case, the code doesn't have errors and the compilation ends with success.

That's all for today!
Bye-bye guys!
