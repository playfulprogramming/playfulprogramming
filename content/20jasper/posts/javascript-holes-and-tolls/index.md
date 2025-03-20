---
{
  title: 'JavaScript Holes and Tolls (On Performance)',
  description: "Compiler optimizations that you shouldn't worry about but are cool.",
  published: '2025-03-11',
  tags: ['chrome', 'javascript'],
  originalLink: 'https://jacobasper.com/blog/javascript-holes-and-tolls/'
}
---

Is there a functional difference between the following two code blocks?

```js
const array = Array(10).fill(10);
```

```js
const array = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
```

If you said "Obviously, the first is written in such a way that v8 cannot perform certain optimizations due to `array` being holey" then you are a big nerd[^touchGrass] or you read ahead in the article. That's weird, how did you have that specific of an answer ready in such a short time???

[^touchGrass]: This is for you. Please go outside. The sun misses you. ![Grass with dew on it](./touchGrass.webp)

If you said it's purely stylistic, then you are safely only a medium sized nerd and probably touch grass at least once a month.

---

**Huge disclaimer—everything I say will be specific to V8, and I do not work on the engine, so take everything with a grain of salt.**

## What's going on here?

Note that I've truncated the debug output for brevity. I recommend messing around with the full output if you have some free time!

Let's look at the less optimal approach.

```js
d8> %DebugPrint(Array(10).fill(10));
DebugPrint: 0x13e600288601: [JSArray]
 - elements: 0x13e600288611 <FixedArray[10]> [HOLEY_SMI_ELEMENTS]
 - length: 10
 - elements: 0x13e600288611 <FixedArray[10]> {
         0-9: 10
 }
0x13e600089bf5: [Map]
 - elements kind: HOLEY_SMI_ELEMENTS

[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
```

The elements kind is `HOLEY_SMI_ELEMENTS` here, meaning the engine marked this array as potentially missing elements. Here, an array with holes is created and then filled. You may think it should be packed again, but once an array is holey, there's no going back.

Now what about the latter option?

```js
d8> %DebugPrint([10, 10, 10, 10, 10, 10, 10, 10, 10, 10])
DebugPrint: 0x3d3700288655: [JSArray]
 - elements: 0x3d3700288665 <FixedArray[10]> [PACKED_SMI_ELEMENTS]
 - length: 10
 - elements: 0x3d3700288665 <FixedArray[10]> {
         0-9: 10
 }
0x3d3700089331: [Map]
 - elements kind: PACKED_SMI_ELEMENTS

[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
```

This array has an elements kind of `PACKED_SMI_ELEMENTS`, so v8 can perform some optimizations now that it knows there aren't any missing elements.

I'd expect that packed arrays are stored as—well—arrays, and holey arrays are likely stored as hashmaps.

Note that it _is_ possible to make a packed array of a certain length without using a literal. For example, the following are all packed:

```js
Array.from({ length: 10 }, () => 10); // PACKED_SMI_ELEMENTS

const arr = [];
for (let i = 0; i < 10; i++) {
	arr.push(10);
}
// arr is PACKED_SMI_ELEMENTS
```

## What is a hole?

JavaScript is fun, so arrays don't actually need to have values in them. No, they're not `undefined`—they are holes.

Here is an array of holes, note `<the_hole_value>`.

```js
d8> %DebugPrint(Array(10))
DebugPrint: 0x3d370028aa6d: [JSArray]
 - elements: 0x3d370028aa7d <FixedArray[10]> [HOLEY_SMI_ELEMENTS]
 - length: 10
 - elements: 0x3d370028aa7d <FixedArray[10]> {
         0-9: 0x3d3700000761 <the_hole_value>
 }

[, , , , , , , , , ]
```

And here is an array of `undefined`.

```js
d8> %DebugPrint([undefined, undefined])
DebugPrint: 0x350400288605: [JSArray]
 - map: 0x350400089cc1 <Map[16](PACKED_ELEMENTS)> [FastProperties]
 - elements: 0x3504002885f5 <FixedArray[2]> [PACKED_ELEMENTS]
 - length: 2
 - elements: 0x3504002885f5 <FixedArray[2]> {
         0-1: 0x350400000011 <undefined>
 }

[undefined, undefined]
```

An array with `undefined` has values and is considered packed, while holes, well, are empty.

You can't hold a hole in a variable—as far as I know, these are unique to arrays. If you try to access a hole, the value returned will be coerced to undefined.

```js
Array(10)[0]; // undefined
```

### How can I make a hole?

How else can we make a hole besides the `Array` constructor?

#### `delete`

`delete` creates a hole instead of shifting elements.

```js
const arr = [1, 2, 3];
delete arr[1]; // arr is now [1, , 3]
```

```js
const arr = [1, 2, 3];
arr.splice(1, 1); // arr is now [1, 3]
```

#### `Array.prototype.length`

Setting an array's length will create holes.

```js
const arr = [];
arr.length = 10; // arr is now [, , , , , , , , , ]
```

#### Array literals

```js
[, , , ,]; // [, , , ]
```

The last comma in an array literal is a trailing comma and the logs _don't_ have trailing commas. That means if you copy paste the output, you'll eventually have an empty array!

#### Assigning beyond the length of the array

Beyond some holes in between, this will add extra holes after the new element!

```js
d8> const arr = [0]
undefined
d8> arr[5] = 5
5
d8> %DebugPrint(arr)
DebugPrint: 0x38c002885ed: [JSArray]
 - length: 6
 - elements: 0x038c0028a2e1 <FixedArray[25]> {
           0: 0
         1-4: 0x038c00000761 <the_hole_value>
           5: 5
        6-24: 0x038c00000761 <the_hole_value>
 }
0x38c00089bf5: [Map]
 - elements kind: HOLEY_SMI_ELEMENTS

[0, , , , , 5]
```

This happens even if you assign to `arr[arr.length]`, though it stays packed.

```js
d8> %DebugPrint(array)
DebugPrint: 0xdb50028a651: [JSArray]
 - length: 2
 - elements: 0x0db50028a6a9 <FixedArray[19]> {
           0: 0
           1: 5
        2-18: 0x0db500000761 <the_hole_value>
 }
0xdb500089331: [Map]
 - elements kind: PACKED_SMI_ELEMENTS

[0, 5]
```

#### `copyWithin`

```js
[, , 1, 2].copyWithin(2); // [, , , ]
```

Remember that in the logs, there is no trailing comma, so this is still 4 long.

---

If you ever feel like typing `[,,,,,,]`, I don't know, take a walk or something. You know what. I will tell my dog and they will be very sad and cry.

![a sad puppy wearing a sweatshirt thinking please don't use holey arrays](./sadPuppy.webp)

Alright, now that we have that out of the way, let's get it moving, I have a slushy to drink.

### How do JavaScript constructs interact with holes?

The array returned by `splice` is empty.

```js
const y = [, , , ,];
y.splice(1, 1); // []
// y is now [, , ]
```

`sort` always moves holes to the end.

```js
[, , 1, 5, 1, ,].sort(); // [1, 1, 5, , , ]
```

Here's a variety of interactions with holes—some ignore them, some remove them, some replace them with undefined. The MDN describes much of this behavior, however, holey and packed arrays are described as "sparse" and "dense" respectively.

```js
[, ,].length; // 2
[, , 5].map((x) => 'why have you done this'); // [, , "why have you done this"]
[,,5,10].filter(x => x > 5) // [10]
[,,5].fill(10) // [10, 10, 10]
[...[,,,]] // [undefined, undefined, undefined]
[,,].every(x => false) // true
[1,2,,,5,,].reverse() // [, 5, , , 2, 1]
[,,,].with(2,10) // [undefined, undefined, 10]
[,,,].forEach(_ => console.log("I'm so excited to log something!")) // *crickets*
[,,,,].push(10) // [, , , , 10]
[,,,].values().next() // {value: undefined, done: false}
```

## Not all packed arrays are made equal

Beyond packed and unpacked arrays, arrays can be optimized based on their elements' types.

```js
Array.from({ length: 10 }, () => 10); // PACKED_SMI_ELEMENTS
Array.from({ length: 10 }).fill(10); // PACKED_ELEMENTS
```

These seem equivalent, but the second option is suboptimal. `SMI` stands for "small integer," and `ELEMENTS` is a generic element.

Since it lacks a `mapFn`, the second array is filled with `undefined`, demoting the array to `PACKED_ELEMENTS`. Like how an unpacked array can never become packed again, the more generic `ELEMENTS` can never become the more specific `SMI`. Filling a `PACKED_ELEMENTS` array does not transition it to `PACKED_SMI_ELEMENTS`.

Long story short, create your arrays as specifically as you can, so the engine can help you out the most!

## What if I have holey arrays in my code right now?!

I wouldn't worry about it too much. It probably affects readability somewhat, but if you really need to save a few instructions here and there, you'll have profiled and know what to do.

It's fun to know, and you can avoid using the array constructor, but most times it shouldn't matter enough for you to care.

## "Where did you learn all this stuff; you have a humongous brain!"

Well I'm flattered by the compliment, but I'm standing on the shoulders of giants. I learned most of this from the MDN and [Mathias' blog on elements kinds on the v8 blog](https://v8.dev/blog/elements-kinds)! They even mention [how to run the d8 compiler and see this debug output yourself!](https://v8.dev/blog/elements-kinds#debugging)

I pretty often am asked about things like the time complexity or performance characteristics of defining arrays in certain ways. While you absolutely do not need to know about internals to write most algorithms—the point of time complexity is estimation after all—I never shy away from a good rabbit hole to dive into some source code or read a nice technical article. There's nothing better than someone saying "x works like y" and sending over some source code that says "x works like y in Chrome but not Firefox and only on Friday afternoons".

---

I made a goal to write this blog in under 2 hours since I'm very talented at going on tangents. I set a stopwatch and went at it. Did I hit my goal? Nope, but I did stop adding new content at 2 hours, and then took a final hour to edit, so I'd call this a success.

I did not accidentally make a list of every iterable in the JavaScript library then get overwhelmed and not release the article this time 😅. I definitely don't have a backlog of like 10 half written blogs, trust me.
