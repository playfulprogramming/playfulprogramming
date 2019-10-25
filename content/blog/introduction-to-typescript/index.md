---
{
	title: "Introduction to TypeScript — What is TypeScript?",
	description: "An introduction and explanation of what TypeScript is, is not, and what it's used for",
	published: '2019-10-13T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['typescript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

TypeScript's popularity cannot be understated. Either you likely know someone who works with it, you've heard of it, or possibly you've been using it. As the language continues to grow and evolve, it can be helpful to jump into the language and play with it. Other times, however, having a reference for what the language is, what the language is not, and how it can be helpful can be of great resource. We're hoping that this page can be a good starting point for that resource.

> If you're more of an auditory learner, there's also a podcast episode that was done on this exact subject matter with the author of this post.
>
> This podcast episode [can be found on one of our sponsor's pages](https://www.thepolyglotdeveloper.com/2019/10/tpdp-e32-getting-familiar-typescript-development/)

# What is TypeScript? {#what}

**TypeScript is a superset of JavaScript**, meaning that _all valid JavaScript is valid TypeScript, but not all TypeScript is valid JavaScript_. Think of it as JavaScript plus some goodies. These goodies _allow developers to add type information to their code that is enforced during a TypeScript to JavaScript compilation step_.

These goodies are enabled by the TypeScript compiler, which takes your TypeScript source code and output JavaScript source code, capable of running in any JavaScript environment.

### Doesn't JavaScript Have Types Already? {#javascript-types}

While JavaScript _does_ have a loose understanding of types, they're not strictly enforced.

Take the following example:

```javascript
let numberHere = 0;
numberHere = 'Test';

const newNumber = 10 - numberHere;
```

In this example, we're expecting `10 - 0` but have accidentally thrown in a new line during a copy + paste session (this always happens to me) that changed the type from a number to a string. As a result of this errant line, instead of `newNumber` being a number, it's now `NaN`.

While TypeScript does not restrict the ability to have `NaN`s and errant copy-pastes (oh how I wish it did), it can make it more obvious that mistakes like this have been made by marking `numberHere` as a number type explicitly.

```typescript
let numberHere: number = 0;
// 🛑 Error will be thrown during compilation:
// Type '"Test"' is not assignable to type 'number'.
numberHere = 'Test';

const newNumber = 10 - numberHere;
```

This point is made even more complex when dealing with how both values are handled internally in JavaScript. Especially when talking about ES6 classes, _the type-strict nature of TypeScript types and the "types" that are understood in JavaScript are not the same_. While [ES6 classes are syntactical sugar on top of JavaScript's prototype system](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) and there [are only seven base-types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures) (called _primitive types_) in JavaScript that every other value is composed of, TypeScript has a much more robust type system.

> Author's Note:
> While the above mention of _primitive types_ and _syntactical sugar_ are meant as a path for you to learn more, don't feel discouraged from learning more about TypeScript if you're unfamiliar with such concepts.
>
> We're going to try to go at a high-level, and while we may hint at deeper concepts or knowledge, know that we all learn at our own pace. It's more than okay to take your time feeling comfortable before diving into those topics.

# Why TypeScript? {#why}

You may be asking yourself: "Why use TypeScript if it doesn't change the runtime behavior of your code?" There can be a few reasons you may want to integrate TypeScript in your project, such as the following.

## Type Safety {#type-safety}

As mentioned before, [JavaScript may have rudimentary types, but TypeScript's are far more robust](#javascript-types). This robustness is able to lend developers to force their code inputs and outputs to strictly enforce the limitations the developer places on them. Let's look at  take the following code for example:

```js
function addFive(input) {
    return input + 5;
}
addFive('5');
```

Reading through this code quickly, you might be able to spot the problem. Because we passed in a string, rather than a number, we get the result of `'55'` rather than the (likely) expected result of `10`. _This is the kind of unintentional code safety concern that TypeScript fixes_. Using TypeScript, we are able to check the properties passed into `addFive` during compile time in order to warn a developer about these mistakes.

```ts
// test.ts
function addFive(input: number) {
    return input + 5;
}
addFive('5');
```

Will now output:

```bash
>tsc test.ts
test.ts:5:9 - error TS2345: Argument of type '"5"' is not assignable to parameter of type 'number'.
5 addFive('5');
```

In a smaller codebase, such as the given example, it can be easy to miss how important type checking is. Detecting the error in this small length of code is often trivial; however, it can be much more difficult to do so in larger, more complex codebases or when utilizing code that might not be from your project, such as a library or framework. In these use cases, it can be much easier to identify an edge case where changing a function's parameters would break another part of the codebase. Likewise, being able to quickly identify implementation errors when using a library is a significant factor in identifying problems effectively.

## Developer Quality of Life {#quality-of-life}

While it can be easy to forget in the abstract world of development, developers make the code that we interact with on a daily basis. These developers (yourself included) tend to like enjoying certain experiences while working on their code. TypeScript provides a myriad of such quality-of-life improvements.

Let's go over some of the arguments in favor of TypeScript's developer quality of life improvements.

### Improved Tooling Support {#tooling}

Historically, having the ability to make assumptions about code in order to provide developer niceties (such as autocomplete code suggestions) in loosely typed languages such as JavaScript has been incredibly hard to do. As time has gone on, support for these types of actions has gotten better; but due to the nature of JavaScript's type system, there will likely always be limitations on how effectively this can be done. TypeScript's syntax, however, _can provide much of the type data about your source code needed for tools to be able to provide those niceties_ that are otherwise tricky for these tools to build. _The TypeScript team even provides a tool to communicate directly to these IDEs_ so that the work on implementing this syntax data consumption is much more trivial than they otherwise would be. _This is why [many changelogs for TypeScript releases](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html) mention changes to editors such as [Visual Studio Code](https://code.visualstudio.com)_.

#### 3rd Party Library Support {#typing-files}

Because of JavaScript's awesome engineering diversity, many widely used projects do not use TypeScript. However, _there are ways we can still utilize TypeScript's tooling capabilities without porting the code_. If you have a good understanding of the given project's codebase and TypeScript, _you can write a definition file that sits separated from the rest of the codebase_. These definition files allow you many of the same tooling abilities native TypeScript source code allows.

An example of these typings might look something like this:

```javascript
// index.js
function aNumberToAString(numProp) {
	if (typeof numProp !== "number") throw "Only numbers are supported";
	return numProp.toString();
}
```

```typescript
// index.d.ts
declare function aNumberToAString(numProp: number): string; // Accept a number arg, return a string
```

##### Community Hosting {#definitely-typed}

Additionally, because TypeScript has a well established and widely used install-base, **there are already many different definition files in the wild for supporting non-TypeScript supporting projects**. One of the more extensive collections of these typings lives at the [DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped), which publishes the package's community typings under the package names `@types/your-package-name` (where `your-package-name` is the name of the project you're looking for typings of) that you can look for on your package manager.

### Documented Types {#typing-doc-references}

Another way TypeScript can help with the workflow while coding is in regard to gaining references to APIs and code.

When working on projects with objects that contain many properties that are used variously across files and functions, it can be difficult to track down what properties and methods are available to you without having to refer to the documentation of that scope in your application. With types present in your code, you're often able to reference that type (_often with a "jump to declaration" shortcut feature that is present in many IDEs_) to quickly refer to the properties and methods present on a given value or class.

## Type Information {#reflect-metadata}

However, developer quality of life changes and type safety aren't the only positive for utilizing TypeScript in your projects!

Although it's a much more complex and highly experimental feature of TypeScript, _you are also able to use the typing data from your program to do other operations without explicitly duplicating the type data._

What do I mean by this? Take the following code:

```typescript
function HandleUserInput(inputProp: number, functionToHandle: Function): string {
...
}
```

What if you had a way to mutate or modify this function? What if this way of mutating this function allowed you the ability to see that the first parameter is a number, the second is a function, and the return type is a string? **While this may not seem to have any immediate advantages, this meta-type info allows us to do powerful things.** It can be used in a situation where you might want to generate a JSON schema based on a class declaration in a TypeScript file or when using ORMs and mapping TypeScript types to the databases' native type. _By doing something like this with your ORM, you could preserve both the database typing and the TypeScript compile type within the same file so that you don't have to do duplicate checks against either._

> Author's note:
> An ORM is an "Object Relational Model". An ORM is a library that helps developers keep database schemas mapped in their code, often by having classes reflect the shape of their (typically) SQL server schema.
>
> As always, feel free to search more on them (the terms "JavaScript ORM" might help) and always know that not knowing a thing is always okay 🤗

Here's an example [from a library built to do just that](https://typeorm.io/#/) that allows you to preserve the TypeScript type to save data in specified field types in your database:
```typescript
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}
```

And this feature doesn't have an API dissimilar to standards-based APIs; [it's being built with and on top of features proposed for a future version of JavaScript (commonly referred to as ESNext).](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)

# What isn't TypeScript {#misconceptions}

Now that we've covered a bit of what TypeScript _is_, it might be a good idea to quickly synopsis what it _isn't_. After all, to know what something is not is oftentimes just as powerful as knowing what something _is_.

## It's Not the Tower You Think It Is {#typescript-is-not-babel}

One of the things TypeScript is not is a transpiler. What this means is that TypeScript (alone) _will not take TypeScript source code that contains syntax from newer JavaScript versions (ES6+) and output older versions of JavaScript (ES5) in order to improve browser compatibility (IE11)_.

For anyone who's used TypeScript, this may confuse you, as there are various flags and config options for the output version of JavaScript it compiles to. What's really happening under-the-hood is that TypeScript hands off your source code to Babel after it compiles down to JavaScript. [With Babel 7 this is even harder to notice](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/), but be aware that any transpilation you expect to occur when using TypeScript may force you to use and understand Babel tools.

However, this does mean that you can utilize the entire arsenal of Babel tooling to your disposal, [such as Babel plugins](https://babeljs.io/docs/en/plugins/).

## Logic != Typings {#typings-are-not-logic}

_TypeScript will not find all your typing errors on its own_. This is because TypeScript is only as useful as your typings are. [Let's look back at an earlier example](#type-safety):

```javascript
function addFive(input) {
    return input + 5;
}
```

If you keep `addFive`'s `input` parameter without an explicit type, it will try to do its best to detect the type based on the operations you run on the value. **While these inferred types are often very useful, it often has difficulty doing so in an accurate manner**. _This is why manually assigning types is almost always preferred to leaving them as inferred_. If it couldn't properly detect a type for the value in this example, it does nothing to prevent strings from being passed as the parameter value.

Although examples like this are simple, strict typings can also become fairly complex to maintain maximum type strictness. See the [Advanced section of the official handbook](https://www.typescriptlang.org/docs/handbook/advanced-types.html) for examples that illustrate this.
**Also, because typings do nothing to test against the logic of your program, they should not be seen as a replacement for testing, but rather a companion to them.** _With strict typings and proper testing, regressions can be severely limited and improve code quality of life._

##### Typing Mishaps Happen {#typings-can-be-wrong-too}

Remember, because typings are kept separately from the project's logic code, typings can be misleading, incomplete, or otherwise incorrect. While this can also happen with TypeScript logic code, it tends to be more actively mitigated as a project's ability to compile (and therefore distribute) relies on that typing information. This isn't to say that you should immediately mistrust typings, but this is simply a reminder that they too may have their flaws — just as any other part of a codebase.

## Don't Forget To Document {#typescript-is-not-documentation}

Just as typings shouldn't replace tests, typings should also not replace documentation or comments. Typings can help understand what inputs and outputs you're expecting, but just the same as with testing; _it doesn't explain what the logic does or provide context as to why the data types have specific properties_, what the properties are used for, and so forth. Additionally, typings often do little to help explain how to contribute in the larger scale when talking about documentation. For example, in a large-scale application, there may be come complex data patterns or order-of-operations that are required to do a task. Typings alone will not effectively communicate these design principles that are integral to the usage of the code.

Essentially, I just want to make sure to iterate that while there may be tools that can let you auto-document the properties and the property type from TypeScript annotations, hand-done documentation is still extremely important.

# Conclusion

And with that, we have a better understanding of what TypeScript is! I hope this has been informative and helpful for those that may be new to the language in particular. What'd you learn, let us know!

Now that you're more familiar with TypeScript, maybe you'd like to play around with one of their more experienced functionality: [Type generics](https://unicorn-utterances.com/posts/typescript-type-generics/)? We have a whole post around that concept as well, [you can find that here](https://unicorn-utterances.com/posts/typescript-type-generics/).

Thanks for reading! Leave any questions or feedback in the comments below.
