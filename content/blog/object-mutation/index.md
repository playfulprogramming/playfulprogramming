---
{
	title: "The story of `let` vs `const`, Object Mutation, and a bug in my code",
	description: '',
	published: '2022-12-22T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Recently, we rewrote [our community blog for "Unicorn Utterances"](https://unicorn-utterances.com) to use [Astro, a static site generator framework](https://astro.build). One of the fan-favorite features of the site is it's dark mode toggle, which enables dark mode purists to gloat over the light mode plebians (like myself).

<video src="./theme_toggle.mp4" title="Toggling the dark mode theme on the Unicorn Utterances site"></video>

> For real though, support light mode in your sites and make them the default setting - [it's a major accessibility concern](https://www.vice.com/en/article/ywyqxw/apple-dark-mode-eye-strain-battery-life).

In the migration, I wrote some code to  trigger a dark mode toggle:

```javascript
// ...
const initialTheme = document.documentElement.className;
toggleButtonIcon(initialTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.className;
  document.documentElement.className =
              currentTheme === 'light' ? 'dark' : 'light';

  const newTheme = document.documentElement.className;
  toggleButtonIcon(newTheme);
})
```

While writing this, I thought:

> That's an awful lot of `document.documentElement.className` repeated. What if we consolidated it to a single variable of `className`?

```javascript
// ...
let theme = document.documentElement.className;
toggleButtonIcon(theme);

themeToggleBtn.addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light';

  toggleButtonIcon(theme);
});
```

Awesome! Code looks a lot cleaner, now to go and test it...

<video src="./no_theme_toggle.mp4" title="Suddenly, toggling the dark mode theme doesn't work, no matter how much I click"></video>

Uh oh. It's not toggling anymore! 😱

> Why did that code break? We made such a simple refactor?!

This migration of code broke our theme switching thanks to the underlying properties of "object mutation".

> What's "object mutation"?

Let's talk about that. Along the way, we'll touch on:

<!-- // TODO: Add links to headers --> 

- How memory addresses are stored in-memory
- The differences between `let` and `const` (including one you might not expect)
- How to perform memory mutation
- How to fix our code 



# How variables are assigned to memory addresses

To understand object mutation, we first need to conceptualize how JavaScript handles variable creation.

In one of my blog posts called ["Functions are values", I talk about how variables as stored into memory](// TODO: Add link). In that article, I specifically talk about how, when you create JavaScript variables, they create a new space in memory.

Say that we wanted to initialize two variables:

```javascript
var helloMessage = "HELLO";
var byeMessage = "SEEYA";
```

When we run this computer, it will create two "blocks" of memory to store these values [into our RAM, the short-term memory of our computer](/posts/how-computers-speak#ram). This might be visualized like so:

![A big block called "memory" with two items in it. One of them has a name of "helloMessage" and is address `0x7de35306` and the other is "byeMessage" with an address of `0x7de35306`.](./memory_chart.png)

These memory blocks then can be referenced in our code by using their variable name (`helloMessage` and `byeMessage` respectively). It is important to note, however, a few things about these memory blocks:

1) They have a size.

   Each of these memory blocks has an amount of system memory they consume. It can be a very small amount of data (like storing a small string as we're doing here), or a huge amount of data (such as keeping a movie's video file in memory)

2) They have a lookup address.

   Very generally, this lookup address is simply the memory location of where a variable starts. This lookup address may be called a "memory address" and may be represented as a number of bits counting up from `0`.

3. These memory addresses can be re-used.
   If explicitly told to, a computer can change the values of an existing memory block.

4. These memory addresses/blocks can also be freed up when they're no longer needed.
   In some languages, this is done manually while other languages do this (mostly) automatically.

5) Once freed, these memory addresses/blocks can be re-used.

## Reassigning variables

Let's say we want to reassign the variable of `helloMessage` to `'HEYYO'`:

```javascript
var helloMessage = "HELLO";
var byeMessage = "SEEYA";

helloMessage = "HEYYO";
```

In this code sample, the first two lines:

1) Creates a `helloMessage` variable.
   - Which, in turn, creates a memory block (say, `0x7de35306`) 
   - The characters that make up the string `"HELLO"` are placed in this memory block
2) Creates a `byeMessage` variable.
   - This also creates a memory block (`0x7de35307`)
   - Which contains the string `"SEEYA"`

After these two instructions are executed, we find ourselves reassigning the variable of `helloMessage` to `HEYYO`. While it might be reasonable to assume that the existing `helloMessage` memory block is changed to reflect the new string, that's not the case. 

Instead, the reassignment of `helloMessage` creates a _new_ memory block, adds it to the end of the memory stack, and removes the old memory block.

<video loop="false" title="When reassigning a variable, you pop off the old value from the memory stack and assign the new value to a different memory address" src="./let-reassign-variable.mp4"></video>

Once this is done, the `helloMessage` variable points to a new memory address entirely, despite being called the same variable name.

This may seem unintuitive at first until we remember: memory addresses have sizes.

> What does this mean for us?

Think about how the above memory is aligned in the above chart; Ideally, to utilize as much memory in your machine as possible, data should be side-by-side in your RAM. This means that if you have a memory address starting at memory address `10` and it takes up `13` bytes, the next memory address should start at `23`.

If you change the length of one memory block, you may have to shift over other blocks or rearrange their positioning. This can be a very expensive operation for your computer.

Since they're the same length strings, we could theoretically just reassign our `HELLO` memory block to say `HEYYO`. This isn't always the case, however, since strings can vary in length.

While `HELLO` and `HEYYO` are the same length, what happens if we tried to do this?

```javascript
var helloMessage = "HELLO";
helloMessage = "THIS IS A LONG HELLO";
```

 In this example we would need to create a new memory block _anyway_, since it doesn't hold the same value length as before.

> But why doesn't our computer check if it's the same length before and decide to reassign the memory block or create a new one?  

Well, as mentioned previously, your computer doesn't _inherently_ know what the size of `helloMessage` is. After all, the variable simply points to a memory address. To get the length of the memory block, you need to read the value and return the length to the rest of the computer.

So, in order to re-use existing blocks you would need to:

1. Read the value of the existing `helloMessage` memory block.
2. Calculate the length of said memory block.
3. Compare it against the new value's length.
4. If they're the same, reuse the existing block.
5. If not, then create a new block and cleanup the old one.

Remember, each of these executions takes time. While they're inexpensive on their own, if ran extremely frequently, even tiny fractions of time can add up.

Compare that list of 5 items against the "create a new block every time" implementation:

1. Create a new block of memory and clean up the old one.

A much smaller list, right? This means that our computer is able to execute this faster than the other implementation.







---





# `let` vs `const`

Now, you might assume that `const` stands for `constant`, and you'd be right! We can easily check this by running the following:

```
const val = 1;
val = 2;
```

Will yield you an error:

> Uncaught TypeError: invalid assignment to const 'val'

With this assumption, you might think that you can't change data within a `const`, but (surprisingly), you'd be wrong.





# Object Mutation



> How does an object not reassign a memory address when you do this?

```
const obj = {a: 234};

obj.a = 123;
```

`obj` is mutating because under-the-hood, the object is pointing to a memory address. 234 is GC'd and 123 is created in it's place. The new memory address is then assigned to a mutated `obj.a` memory address

## Arrays are objects too!





# Why did this impact our code?



# How can we fix the problem?