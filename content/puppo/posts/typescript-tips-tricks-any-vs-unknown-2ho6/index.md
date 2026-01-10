---
{
title: "Typescript - Tips & Tricks - any vs. unknown",
published: "2021-03-01T07:11:42Z",
edited: "2021-09-09T07:04:00Z",
tags: ["typescript", "webdev"],
description: "Hi guys, today I'll talk about the difference between any and unknown.  Any Any type is a particular...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-any-vs-unknown-2ho6",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Hi guys, today I'll talk about the difference between _any_ and _unknown_.

**Any**
Any type is a particular type in typescript.
If you use this type, the compiler doesn't check your code, and the power is in your hands, but from great powers comes great responsibilities. In this case, the compiler doesn't check your code, but maybe your code could have bugs; these bugs will most likely be found by a user during his operations.

**Unknown**
Unknown type is another particular type in typescript, it's similar to _Any_ type but it helps us to prevent bugs at build time.
The unknown type helps us to force the check of its type before using it.

Now let's turn to some examples.

_Any Type_
```ts
let myAny: any = true
myAny.trim().reverse().split(',');
let myAnyNumeric: number = myAny;
const sum = myAnyNumeric + 3;
```
In this case, we can see a problem right away; in the second line, we try to call the trim method on a boolean type. This code at runtime throws an exception, but we need to run this code to detect this bug.
In the third line instead, I set a boolean type to a numeric type, and in the next line, I add three to this value.
Ok, I think you have understood the possible problems you could have if you overuse any type.

_Unkown Type_
```ts
let myUnknown: unknown = true;
myUnknown.trim(); // Property 'trim' does not exist on type 'unknown'.ts(2339)
let myAnyNumeric: number = myUnknown; // Type 'unknown' is not assignable to type 'number'.ts(2322)
if (typeof myUnknown === 'string') myUnknown.trim();
if (typeof myUnknown === "number") {
  let myAnyNumeric: number = myUnknown;
  const sum = myAnyNumeric + 3;
}
```
In this example, we can see the power of using unknown type instead of any type.
This type doesn't stop the compiler check but it helps us to check our type to prevent bugs at runtime.
Typescript understands what you want to do, and it indicates you the correct way to prevent bugs.

After this post, I think that from now on you will prefer to use _unknown_ instead of _any_ and I know the reason ;)

That's all!
Bye-bye guy!!
