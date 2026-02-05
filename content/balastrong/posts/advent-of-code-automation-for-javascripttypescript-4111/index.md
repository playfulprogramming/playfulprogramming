---
{
title: "Advent of Code Automation for Javascript/Typescript",
published: "2023-12-03T21:27:55Z",
tags: ["adventofcode", "javascript", "typescript", "webdev"],
description: "December means Advent of Code for many of us 🎄 (or at least, the first few days of December)  These...",
originalLink: "https://leonardomontini.dev/advent-of-code-javascript-typescript",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Web Development",
order: 14
}
---

December means Advent of Code for many of us 🎄 *(or at least, the first few days of December)*

These funny challenges require a few steps every day, from setting up the new empty solution files to manually downloading the inputs and submitting the solution.

What if the manual/repetitive steps could be automated? 🤔 It's a game made by developers for developers (developers developers) and depending on your language there are some so-called runners to give some automation 🤖

## aocrunner

This one I found last year (and I'm using again this year) is designed if you're playing the challenge with both Javascript or Typescript.

This is the original repo: https://github.com/caderek/aocrunner

## Tool features

I mean... what do you even need to automate? The game isn't just getting the input and running a js/ts file?

Yeah, but we love automating things, so here's what this tool does:

- Define a common template to handle the input file and both solutions
- Create the folder with the files you need for the challenge
- Download the input file
- Run the solution locally
- Submit the solution

You can also quickly run some custom tests and other nice to have features.

I recorded a demo where I show it in action, you can find it here or on YouTube:

<iframe src="https://www.youtube.com/watch?v=Stf66XnTzbw"></iframe>

Here below you can find all the main steps anyway, in case you don't want to watch the video :)

## How to use it

Basically a command lets you create the initial project with some other handy features in the `scripts` section of the `package.json` file.

### Setup

As written in the README, you can run a command that will create a folder containing all the files you need for the challenge:

```bash
npx aocrunner init
```

A simple CLI installer will ask you for some questions (like the year, js/ts, folder name, etc) and then it will create the folder with the files.

### Setup the session cookie

All inputs are different for each user, which means you need somehow to authenticate to the website to download the input file.

Everything happens under the hood, all you need to do is to feed the tool with your session cookie, which you can find in the browser from the "Application" tab of the dev tools.

Put it inside the `.env` file in the root of the project and that's it! (In [the video](https://youtu.be/Stf66XnTzbw) I show it step by step)

### Play a day!

To run the challenges for a day, you can use the `run` command:

```bash
npm run start 1
```

If it's the first time you run it, it will download the input file and create the js/ts file to run the solution in a new folder.

Otherwise, it will just run & watch the solution to evaluate the result every time you save the file.

### Submit the solution

While you're running it with the `run` command, you can also submit the solution by pressing `s` in the terminal.

## Conclusion

There are also some other features I'd recommend you to try, but one thing it's also worth mentioning is that unfortunately the original project seems inactive.

It works fine so I'm happy to talk about it, but if you're using other runners or you made one, feel free to share it in the comments below!

Happy Advent of Code! 🎄

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
