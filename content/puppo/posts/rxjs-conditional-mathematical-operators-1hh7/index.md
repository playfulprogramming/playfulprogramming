---
{
title: "RxJS - Conditional & Mathematical Operators",
published: "2021-09-27T06:14:27Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Hi Guys and welcome back, today I'll illustrate you two simple types of the pipeable operators:...",
originalLink: "https://dev.to/this-is-learning/rxjs-conditional-mathematical-operators-1hh7",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "13743",
order: 1
}
---

Hi Guys and welcome back,
today I'll illustrate you two simple types of the pipeable operators: Conditional Operators and Mathematical Operators.
No time to waste, let's start.

# Conditional Operators
These operators are useful to check if there are values in the observables or to find some specific value in them. Some of these operators are similar to some array methods, with the difference that they work with observables and not with arrays.

* **[defaultIfEmpty](https://rxjs.dev/api/operators/defaultIfEmpty)**

> Emits a given value if the source Observable completes without emitting any next value, otherwise mirrors the source Observable.

```ts
import { EMPTY, Observer } from "rxjs";
import { defaultIfEmpty } from "rxjs/operators";

const observer: Observer<number> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

EMPTY.pipe(
    defaultIfEmpty(10)
).subscribe(observer);
```
```console
value 10
complete
```
![defaultIfEmpty Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mc6m5h39hc2ico12qsnw.jpg)
This operator, as you can see, permits us to receive a default value if the observable does not emit any value.

* **[every](https://rxjs.dev/api/operators/every)**

> Returns an Observable that emits whether or not every item of the source satisfies the condition specified.

```ts
import { Observer, of } from "rxjs";
import { every } from "rxjs/operators";

const observer: Observer<boolean> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of(1,2,3,4,5,6,7,8,9).pipe(
    every(val => val < 10)
).subscribe(observer);
```
```console
value true
complete
```
![every Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o6u37lq95xx255qhqtkz.jpg)
This operator is like the [every method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every?retiredLocale=it) in the arrays.
We can use it when we need to check if all the values of our observable meet a condition.

* **[find](https://rxjs.dev/api/operators/find)**

> Emits only the first value emitted by the source Observable that meets some condition.

```ts
import { Observer, of } from "rxjs";
import { find } from "rxjs/operators";

const observer: Observer<number | undefined> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of(1,2,3,4,5,6,7,8,9).pipe(
    find(val => val === 5)
).subscribe(observer);
```
```console
value 5
complete
```
![find Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gs72e66yjrbl0ek5f73n.jpg)
This operator is like the [find method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) in the arrays.
We can use it to find a value that meets a condition in our observable. It's important to remember that when the operator finds a value that matches our condition it completes the observable.

* **[findIndex](https://rxjs.dev/api/operators/findIndex)**

> Emits only the index of the first value emitted by the source Observable that meets some condition.

```ts
import { Observer, of } from "rxjs";
import { findIndex } from "rxjs/operators";

const observer: Observer<number> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of(1,2,3,4,5,6,7,8,9).pipe(
    findIndex(val => val === 5)
).subscribe(observer);
```
```console
value 4
complete
```
![findIndex Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0b6ykgw3cc7yjqm3dxnt.jpg)
This operator is like the [findIndex method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) in the arrays.
We can use it to find the index of a value that meets a condition in our observable. It's important to remember that when the operator finds a value that matches our condition it completes the observable.

* **[isEmpty](https://rxjs.dev/api/operators/isEmpty)**

> Emits false if the input Observable emits any values, or emits true if the input Observable completes without emitting any values.

```ts
import { EMPTY, Observer } from "rxjs";
import { isEmpty } from "rxjs/operators";

const observer: Observer<boolean> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

EMPTY.pipe(
    isEmpty()
).subscribe(observer);
```
```console
value true
complete
```
![isEmpty Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vdmg3vr5zoazs8b06b1k.jpg)
This operator is used to check if an observable has emitted at least a value.


# Mathematical Operators
These operators are used to retrieve some special values in our observables or to reduce the values.

* **[count](https://rxjs.dev/api/operators/count)**

> Counts the number of emissions on the source and emits that number when the source is completed.

```ts
import { Observer, of } from "rxjs";
import { count } from "rxjs/operators";

const observer: Observer<number | undefined> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of("a", "b", "c", "d", "e").pipe(
    count()
).subscribe(observer);
```
```console
value 5
complete
```
![count Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gvscx0007cr4zd70wixz.jpg)
This operator is used to count the values of our observables. 

* **[max](https://rxjs.dev/api/operators/max)**

> The Max operator operates on an Observable that emits numbers (or items that can be compared with a provided function), and when source Observable completes it emits a single item: the item with the largest value.

```ts
import { Observer, of } from "rxjs";
import { max } from "rxjs/operators";

const observer: Observer<string> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of("a", "b", "e", "d", "c").pipe(
    max()
).subscribe(observer);
```
```console
value e
complete
```
![max Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d2s1ckomsrg8m0e04i04.jpg)
This operator is used to get the maximum value emitted by our  observables.

* **[min](https://rxjs.dev/api/operators/min)**

> The Min operator operates on an Observable that emits numbers (or items that can be compared with a provided function), and when source Observable completes it emits a single item: the item with the smallest value.

```ts
import { Observer, of } from "rxjs";
import { min } from "rxjs/operators";

const observer: Observer<string> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of("a", "b", "e", "d", "c").pipe(
    min()
).subscribe(observer);
```
```console
value a
complete
```
![min Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ptc7qfdls3pysimfberg.jpg)
This operator is used to get the minimum value emitted by our  observables.

* **[reduce](https://rxjs.dev/api/operators/reduce)**

> Applies an accumulator function over the source Observable, and returns the accumulated result when the source completes, given an optional seed value.

```ts
import { Observer, of } from "rxjs";
import { reduce } from "rxjs/operators";

const observer: Observer<number> = {
    next: x => console.log('value', x),
    error: err => console.error('error', err),
    complete: () => console.log('complete'),
};

of(1,2,3,4,5,6,7,8,9).pipe(
    reduce((acc, curr) => acc + curr, 0)
).subscribe(observer);
```
```console
value 45
complete
```
![reduce Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3l39f71fzjh6xmkxlniv.jpg)
This operator is like the [reduce method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) of the array.
It can be used to reduce all the emitted values. The reduced algorithm has to be implemented by us.


Ok, That's all for today.
I hope these simple operators can help you in the future as they did me.

See you in the next article!

_You can find the code of this article [here](https://github.com/Puppo/rxjs-getting-started/tree/11-condition-and-mathematical-operators)._
