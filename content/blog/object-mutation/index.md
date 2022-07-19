---
{
	title: "The story of `let` vs `const`, Object Mutation, and a bug in my code",
	description: '',
	published: '2020-03-02T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['opinion'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

I've been rewriting the code for a site I help run called ["Unicorn Utterances"](https://unicorn-utterances.com) recently to use [Astro](https://astro.build) (expect a blog post on this adventure soon). One of the fan-favorite features of the site is it's dark mode toggle, which enables dark mode purists to gloat over the light mode plebians (like myself).

<video src="./theme_toggle.mp4" title="Toggling the dark mode theme on the Unicorn Utterances site"/>

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

<video src="./no_theme_toggle.mp4" title="Suddenly, toggling the dark mode theme doesn't work, no matter how much I click"/>

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

In one of my recent blog posts called ["Functions are values", I talk about how variables as stored into memory](// TODO: Add link). In that article, I specifically talk about how, when you create JavaScript variables, they create a new space in memory.

Say that we wanted to initialize two variables:

```javascript
var helloMessage = "HELLO";
var byeMessage = "SEEYA";
```

When we run this computer, it will create two "blocks" of memory to store these values [into our RAM, the short-term memory of our computer](/posts/how-computers-speak#ram). This might be visualized like so:

![A big block called "memory" with two items in it. One of them has a name of "helloMessage" and is address `0x7de35306` and the other is "byeMessage" with an address of `0x7de35306`.](./memory_chart.png)







---



Let's say we want to reassign the variable of `helloMessage` to `'HEYYO'`:

```javascript
var helloMessage = "HELLO";
var byeMessage = "SEEYA";

helloMessage = "HEYYO";
```





<video loop="false" title="When reassigning a variable, you pop off the old value from the memory stack and assign the new value to a different memory address" src="./let-reassign-variable.mp4"/>



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





## Arrays are objects too!





# Why did this impact our code?



# How can we fix the problem?