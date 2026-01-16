---
{
title: "10 more Javascript Challenges!",
published: "2023-04-24T12:06:46Z",
edited: "2023-04-26T07:57:05Z",
tags: ["webdev", "javascript", "challenge", "codenewbie"],
description: "Do you know Javascript? After the success of the previous video, I've decided to make a second one...",
originalLink: "https://leonardomontini.dev/javascript-10-challenges/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Web Development",
order: 6
}
---

Do you know Javascript? After the success of the [previous video](https://youtu.be/8gGuu9c9miY), I've decided to make a second one with 10 more challenges to test your knowledge of the language.

These are 4 out of the 10 challenges you'll find in the video:

<iframe src="https://www.youtube.com/watch?v=wE-6CswAE64"></iframe>

---

The `++` operator is really handy and you can put it either before or after the variable. But do you know the difference between the two?

```js
let value = 3;
console.log(value++);
console.log(++value);
```

---

You can use `_` and the letter `e` in numbers and they're still valid!

```js
const THE_ANSWER = 1_2 + 3e1;

console.log(THE_ANSWER);
```

---

Isn't the output here supposed to be `7` on both cases? Actually, none of them is `7`!

```js
const x = "5";

console.log(1 + 1 + x);
console.log(x + 1 + 1);
```

---

Can you spot any unintended side effect here?

```js
let me = { name: "Leonardo", socials: { twitter: "@balastrong" } };

let luca = { ...me };
luca.name = "Luca";
luca.socials.twitter = "@puppo92";

console.log(me);
console.log(luca);
```

---

If you're curious about the answers, you can find them in the video below. I hope you enjoy it!

<iframe src="https://www.youtube.com/watch?v=79R_ys7a8Aw"></iframe>

In the video above, I go through all challenges and show the answer, but I also recorded a slower version where I actually explain them in more detail. If you're curious and want to learn more, you can find it here:

<iframe src="https://www.youtube.com/watch?v=wE-6CswAE64"></iframe>

Let me know how many did you got right! :D

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
