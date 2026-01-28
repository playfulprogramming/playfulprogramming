---
{
title: "Do you know JavaScript?",
published: "2023-03-14T12:45:42Z",
tags: ["webdev", "javascript", "beginners"],
description: "Do you know Javascript? The language we all love has some weird and sometimes unexpected...",
originalLink: "https://leonardomontini.dev/javascript-minigames/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Web Development",
order: 4
}
---

Do you know Javascript? The language we all love has some weird and sometimes unexpected behaviours.

It is a good idea to know them, mostly to avoid unexpected bugs and unpleasant surprises.

Do you want an example?

```js
const a = 0.1;
const b = 0.2;
const c = 0.3;

console.log(a + b === c); // false
```

The output here is `false`. The sum `0.1 + 0.2` is not equal to `0.3`.

Why does this happen? It's because of how floating point numbers are represented in JavaScript.

One more cool example:

```js
"2" + "3" === "23"; // true
```

This was expected, right? We're concatenating two strings. But what if we replace `+` with `*`?

```js
"2" * "3" === 6; // true
```

In this case, the `*` operator tried to convert the two strings in numbers, that's why we got `6`.

## The minigames

I've collected 12 situations like these and I will walk you through them in this video. I will also use the node REPL to further expand on some of them when the output is particularly weird.

<iframe src="https://www.youtube.com/watch?v=8gGuu9c9miY"></iframe>

---

This video format is something I've had in mind for a while and I wanted to give it a try. To be honest I'm not too satisfied with the outcome, but I wanted to share it anyway to collect feedback and make even better versions in the future. I'd like to go with multiline code snippets and decide if keep the explanation or make it faster and more entertaining by skipping them. What do you think?

With that said, I hope you enjoyed it and learned something new! Please let me know if you have suggestions on how to improve the video, or if you have any other feedback in general.

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
