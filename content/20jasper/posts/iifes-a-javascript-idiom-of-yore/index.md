---
{
	title: 'IIFEs — a JavaScript Idiom of Yore',
	published: '2025-03-13',
	description: 'IIFEs were very useful back in the day, but modern JavaScript has made them irrelevant',
  tags: ['javascript'],
  originalLink: 'https://jacobasper.com/blog/iifes-a-javascript-idiom-of-yore/'
}
---

I work with lots of legacy code, so IIFEs are my best friend. The build system I work with doesn't allow for modules, so I have to make due with older idioms like our favorite initialism, the IIFE!

## What is an IIFE?

An IIFE is an immediately invoked function expression

All of these functions are, as the name suggests, called after they are declared

<!-- prettier-ignore -->
```js
(() => { console.log('yipee') })();
(function unnecessarilyNamed { console.log('suspicious') })();
!(function () { console.log('iife time') })();
void function () { console.log('fishy 🤔🤔🤔') }(); 
```

It's pronounced iffy (/ˈɪfi/)[^iifePronunciation], not to be confused with something of dubious authenticity, like your haircut

[^iifePronunciation]: https://en.wiktionary.org/wiki/IIFE

Ironically enough, the arguments for using IIFEs nowadays are often quite questionable. In a world without block scoping, top level `await`, or modules, IIFEs are far less relevant

## Scoping

### Function vs Block Scoping

Prior to ES5/ES2015, variables would be function scoped with `var` or globally scoped when declared without a keyword

This means that block scope effectively did not exist, and functions were the smallest scope[^tryCatchScope]

[^tryCatchScope]: Catch blocks scope caught variables to the block as of ES3. They are smaller than the function scope mentioned, just not very useful to scope non-thrown variables. [Mozilla Scope Cheat Sheet](scopeCheatSheet)

[scopeCheatSheet]: https://web.archive.org/web/20121022212951/https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Scope_Cheatsheet

With the advent of `let` and `const`, the following are effectively the same

```js
(function () {
	var hi = "what's up";
})();
```

```js
{
	const hi = "what's up";
}
```

### Aliasing

Blocks colocate aliases and their definitions. When modules aren't available, I prefer blocks since IIFEs typically span most of the file

```js
(function($) {
  ...
})(jquery);
```

```js
{
	const $ = jquery;
}
```

```js
import $ from 'jquery';
```

### Function statements

A function statement is a function declared within a block like so

```js
{
	function x() {}
}
```

As of ES5, strictly speaking function statements were illegal

> It is recommended that ECMAScript implementations either disallow this usage of FunctionDeclaration or issue a warning when such a usage is encountered[^es5StatementSpec]

However, browsers allowed for them, leading to "significant and irreconcilable variations among the implementations in the semantics[^es5StatementSpec]"

[^es5StatementSpec]: [Annotated es5 standard - statements](https://es5.github.io/#x12)

As of ES6, function statements are specified. In sloppy mode, they are function scoped, and in strict mode, they are block scoped[^blockLevelDeclarations]

[^blockLevelDeclarations]: https://262.ecma-international.org/6.0/index.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics

```js
{
	function x() {
		return 'hi';
	}
}
console.log(x()); // hi
```

```js
'use strict';
{
	function x() {
		return 'hi';
	}
}
console.log(x()); // ReferenceError: x is not defined
```

As long as you're in strict mode (or avoid function statements altogether), you shouldn't pollute the global scope

This is one of many reasons I prefer function expressions. `const` is block scoped and prevents redeclaration and reassignment. Since I work in JS (by force), I need all the help I can get!

Yet again, modules are the superior option here. Everything is private by default, and exported members are explicitly marked. I do wish modules were separate from files, but I'll take modules over a single global scope any day!

```js
export default function x() { ... }
```

## Top level `await`

ES2022 introduced top level `await`. Prior, `await` could only be used in `async` functions like so

```js
(async () => {
	await Promise.resolve('gaming');
})();
```

```js
await Promise.resolve('yippee');
```

A common argument in favor of IIFEs here is you can avoid coloring a sync function, but in those cases, I prefer to just call the async function directly

The following are functionally the same—both initialize the promise and don't wait for it to complete

```js
function sync() {
	(async () => {
		await asyncThing();
	})();
}
```

```js
function sync() {
	asyncThing();
}
```

## Do expression proposal

Another use case for IIFEs are to colocate variables closer without creating another function

I always feel weird about using an IIFE, but `do` expressions make that nicer

_As of March 13th 2025, do expressions are a stage 1 proposal_[^doExpression]

[^doExpression]: https://github.com/tc39/proposal-do-expressions

```js
const activity = (() => {
	const age = x + 20;
	if (age > 30) return 'Go to store';
	if (age > 50) return 'Eat waffle';
	return 'Drink slushy';
})();
// do stuff with activity
```

Do expressions return the final expression from any block

<!-- prettier-ignore -->
```js
const activity = do {
	const age = x + 20;
	if (age > 30) { 'Go to store' }
	else if (age > 50) { 'Eat waffle' }
	else { 'Drink slushy' }
};
```

This would be especially convenient for JSX! I always find myself wanting a midpoint between a separate function and piles of ternaries. [Check the proposal for more examples](^doExpression)!

---

Thank you for coming to my TED talk, and hopefully you get a better haircut next time
