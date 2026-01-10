---
{
title: "Template Literal Types in TypeScript",
published: "2021-06-24T06:39:45Z",
tags: ["typescript", "webdev", "javascript", "programming"],
description: "In this article, we will take a closer look at template literal types and how you can take advantage...",
originalLink: "https://mainawycliffe.dev/blog/template-literal-types-in-typescript",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this article, we will take a closer look at template literal types and how you can take advantage of them in your day-to-day activities as a developer. 

So, what are template literal types?

## Literal Types

In order to understand what template literal types are, we first need to have a brief look at literal types. Literal types allow us to define types that are more specific, instead of something that is generalized like string or number. 

Let's say you have a switch; it can have the value of either on or off. One way of defining the types of this, is to use literal types, giving it the type of either `On` or `Off`:

```typescript
type Switch = "On" | "Off"
```

In the case above, the value of any variable of type Switch can only be `On` or `Off`:

```typescript
const x: Switch = "On"
const y: Switch = "Off"
```

If you tried to assign any other values other than `On` or `Off`, typescript will throw an error:

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/06/Template-Literal-Types-1.png)</figure>

## Template Literal Types

Template Literal Types build on this, allowing you to build new types using a template and can expand to many different string using [Unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types). This works just like [template literal/strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), but instead of concatenating to form strings, it concatenates to form types. 

```typescript
const variable = "string";
type tVariable = "string";

// this results to a variable
const val = `This is a concatenated ${variable}`

// while this results to type
type X = `This is a concatenated ${tVariable}`
```

As you can see, they are similar in syntax apart from what they are defined as, the first being a variable and the second being a type. The type of the first definition will be string, while the second one will be of type `This is a concatenated string` and a variable of that type can only be assigned to that string.

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/06/image-2.png)</figure>

> **NB:** If you tried to use variable instead of a type when defining Template Literal Type, it will throw the following error: `'variable' refers to a value, but is being used as a type here. Did you mean 'typeof variable'?`

If we take our example above of type Switch, we may want to have a function that returns the status of the switch, i.e. `Switch is On` or `Switch is Off`, and have it strongly typed, in that it can only return only those strings. With Template Literal Types, we can define this as follows:

```typescript
type Switch = "On" | "Off"

const x: Switch = "On"
const y: Switch = "Off"

type SwitchStatus = `Switch is ${Switch}`;
```

And this in return gives us the types: `Switch is On` and `Switch is Off`:

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/06/Template-Literal-Types-3.png)</figure>

## Using To Build Types for Grid Items Coordinates

Let's say we are working with a grid system, and wanted to perform a task on various boxes in our grid, like placing something on a specific box given its coordinates. It would be nice if we could strongly type it and ensure we don't specify values outside the grid.

For instance, if we had a grid whose length was 3 smaller boxes on either side of the box. This makes it that we have 9 smaller box fitting on our big box. We can use literal types to create a type for each of our boxes, with the type being its position in the grid. So, the first gets `L1-H1` and the last gets `L3-H3` types, as shown below. 

```typescript
type SquareBoxes = "L1-H1" | "L1-H2" | "L1-H3" | "L2-H1" | "L2-H2" | "L2-H3" | "L3-H1" | "L3-H2" | "L3-H3";
```

Those are a lot of types to create by hand even for a small grid of 9 boxes. But, with template literals types, we could define just the type of the length of one side and use template string literals to expand the rest of the types:

```typescript
type length = "1" | "2" | "3";

type SmallerBoxes = `L${length}-H${length}`
```

And this would yield the same result as before:

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/06/Template-Literal-Types-2.png)</figure>

This makes our work easier and it is more versatile, because if the smaller boxes ever increased or decreased, you only need to adjust the size of the length.

```typescript
// 16 boxes
type length = "1" | "2" | "3" | "4";

// 25 boxes
type length = "1" | "2" | "3" | "4" | "5";

// 4 boxes
type length = "1" | "2";
```

## Combining With Generics

We can combine template literal types with generics to some amazing effect. Let's take with a Type of `Person`, which has two properties - `name` and `age`. 

```typescript
type Person = {
    name: string;
    age: number;
}
```

We want to add two methods to be called to update the values of `name` or `age` i.e. `nameChanged` or `ageChanged`. We can create a new type, that will take type `Person` as a generic, and for each property of type `Person`, we will add new properties with `Changed` appended the original properties of type Person i.e. `nameChanged` and `ageChanged`. We will used template literal types to create a new property by appending `Changed` to the property name.

```typescript
type WithPersonChangedEvents<Type> = {
    [Property in keyof Type as `${string & Property}Changed`]: (newValue: Type[Property]) => void;
} & Type;
```

> **NB:** The above example uses some advanced typescript technique for manipulating types on top of Template Literal Types which you can learn more [here](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html).

Now, we can use both of our Types (**Person** and **WithPersonChangedEvent**) above:

```typescript
const person: WithPersonChangedEvents<Person> = {
    name: "Name",
    age: 20,
    nameChanged: (newName) => console.log(newName),
    ageChanged: (newAge) => console.log(newAge),
};

person.ageChanged(21); // Logs: 21
person.nameChanged("new Name"); // Logs: "new Name"
```

And as you can see, our object - `person` has 4 properties, with 2 being the added methods.

## Conclusion

We have learned about Template Literal Types in Typescript and how they build on top Literal types to provide you even more flexibility when defining types. We have also looked at different use cases like in a grid system type definition for different boxes coordinates and combining them with generics to define extra properties for an object.

### Resources

* Creating Types from Types - [Link](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html).
* Template Literal Types Documentation - [Link](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html).
* Template literals (Template strings) - [Link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
* Types and Mocking - Typescript - [Link](https://mainawycliffe.dev/blog/types-and-mocking-typescript).
* Transforming Types in TypeScript with Utility Types - [Link](https://mainawycliffe.dev/blog/transforming-types-typescript-utility-types).

[ Discuss this Article](https://github.com/mainawycliffe/discussion/discussions/13)