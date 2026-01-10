---
{
title: "Bun - The One Tool for All Your JavaScript/Typescript Project's Needs?",
published: "2024-04-02T17:27:06Z",
tags: ["javascript", "webdev", "bunjs", "typescript"],
description: "In most issues for this newsletter, I have focussed on Typescript and its type system, which I will...",
originalLink: "https://www.allthingstypescript.dev/p/bun-one-tool-for-all-your-javascripttypescript",
socialImage: "social-image.png"
}
---

In most issues for this newsletter, I have focussed on Typescript and its type system, which I will continue doing. This has been great for my readers (from the feedback I have received) but I have wanted to cover broader Typescript-related topics, such as today’s topic, after all this is All Things Typescript. I hope you will enjoy this topic and let me know if you want more like this.

### What is Bun?

NodeJS is the dominant Javascript server runtime environment for Javascript and Typescript (sort of) projects. But over the years, we have seen several attempts to build alternative runtime environments such as [Deno](https://deno.com/) and Bun, today’s subject, among others.

These newer alternatives focus on providing much better runtime performance, much better support for Web APIs on the server, and generally better security among other features, we will look at in later sections. The NodeJS team also continues to make improvements to NodeJS and we have seen tremendous improvements in here as well.

**“Develop, test, run, and bundle JavaScript & TypeScript projects—all with Bun. Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, [test runner](https://bun.sh/docs/cli/test), and Node.js-compatible [package manager](https://bun.sh/package-manager).”**

Compared to Deno, what I think makes Bun special, is that it’s a drop-in replacement for node (you don’t have to change much if anything at all). Unlike Deno which required you to make significant changes to your application at launch to adopt it, Bun doesn’t require you to make any changes to your codebase.

With Bun, you can go into any node-js-based project, like let’s a Next JS or React Application, and just run `bun install` (y_es, but install you read that correctly not npm install_) and then run the `bun run dev` (_or whatever [npm script](https://docs.npmjs.com/cli/v9/using-npm/scripts) you use to launch your project_) and it should run your application, just like Node JS.

From my experience, this ran flawlessly all the time I tried it.

### So, why use Bun?

So, now that I have briefly introduced you to Bun and why it’s a very interesting project, let's see some of the advantages of using Bun, over Node (where most of us are probably coming from), and the others.

#### Speed, it’s Fast, Really Fast

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F13d50cd4-e8cc-4cbe-9cc2-3fb651bf4cbd_631x396.jpeg)

NodeJS is by no means a slow runtime, it wouldn’t be so popular if it was. But compared to Bun, it’s slow. Bun was built from the ground up with speed in mind, using both [JavascriptCore](https://developer.apple.com/documentation/javascriptcore) and [Zig](https://ziglang.org/). The Bun team spent an enormous amount of time and energy trying to make Bun fast, including lots of profiling, benchmarking, and optimizations.

Even the choice of the programming language to use Zig was done with performance in mind. The team chose Zig programming language as it allows them to have low-level control of memory management and lacks hidden control flow, making it easy to write fast software.

The same can be said about the team’s decision to go with JavascriptCore. Both NodeJS and Deno are based on Chrome V8 Engine, while Bun is based on Apple's JavaScriptCore. While not mind-blowingly faster than the V8 Engine, it’s a little bit faster. And these optimizations have paid off for Bun, as it’s faster than both Deno and NodeJS.

To demonstrate this I put my novice benchmarking skills to the test. To run the benchmarks, I used the latest versions of NodeJS, Deno, and Bun, as of the time of writing this issue.

For benchmarking, I used the following simple JS code:

```
for (let i = 0; i < 10000; i++) {
  console.log(`Count: ${i + 1}`);
}
```

And then I used [hyperfine](https://github.com/sharkdp/hyperfine) to run the benchmarks on my MacBook Pro 14 M2 Max, and here are the results:

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3aae920c-34d1-40ee-9c42-a17157cce109_2048x544.png)

As you can see, Bun is 2.20 faster than Deno and 2.88 faster than NodeJS. I also ran the same benchmarks on Windows 11 using WSL and Bun managed an even more impressive feat, being 3.06 times faster than node and 3.26 times faster than Deno, as shown below:

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffa257aeb-7442-43a9-a346-c2f66c061aba_1414x597.png)

This benchmark was run on an Intel Core i9 11900H process and 40 GB of RAM

> 🤔 _**Interestingly**, the Gap between NodeJS and Deno **seems** to be closing, let me know in the comment section below if you want me to do a deep in dive comparing the three on different workloads and different OSs._

If you want to dig into the performance comparison and a very good explanation of the internal workings (in relationship to Javascript Engines) of NodeJS, check out this amazing video by [Chris Hay](https://www.youtube.com/watch?v=8wTulvlllGQ).

#### Compatibility with NodeJS and NPM

I touched on this earlier, if you are already using NodeJS and would love to switch to Bun, you can do so with minimal effort. You can visit any NodeJS-based project, run `bun install` and then run the server using Bun instead of NodeJS, no code changes are needed right out of the box.

“Bun is designed as a drop-in replacement for Node.js. It natively implements hundreds of Node.js and Web APIs, including `fs`, `path`, `Buffer` and more.”

For more information on NodeJS APIs implemented by Bun [here](https://bun.sh/docs/runtime/nodejs-apis).

And if all you just need is a much faster package manager, you can use Bun to replace NPM and use NodeJS for your server, no fuzz.

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2a40787a-aa87-40c8-921d-0d2fef789bb8_1122x445.png)

#### Built-in Tooling

One of the most frustrating or overwhelming things especially for novices about modern web development is the amount of tools that you need to learn. For starters, you will need node/deno/bun and npm, and if you decide to use Typescript, you will need a transpiler and maybe (by maybe I mean, most certainly) a bundler and the story goes on.

We, as web development veterans, sometimes forget how intimidating this can be for beginners, I guess you can call this Stockholm syndrome.

With Bun, you only need Bun. It’s a drop-in replacement for all of the above tools above. Want to install packages, bun has got you, with Bun package manager, it’s a runtime and bundler and will transpile and run typescript code, without you having to install a host of tools to achieve the same.

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4c569d67-cb93-4fad-87e5-c1ccac631b24_500x572.jpeg)

What about testing? Yeah, Bun still got you with an inbuilt test-runner, goodbye Jest?🤷🏾. Bun is fully compatible with jest syntax and you can use it as a drop-in replacement for jest, and you get all the benefits of Bun discussed in this article.

You can learn more about Bun testing [here](https://bun.sh/docs/cli/test).

#### Web Standard API

One thing that serves as a divide depending on the runtime you are targeting is how some APIs are available on the browser, yet are missing on the server (NodeJS). This means that even for tasks you can perform in both the server and the browser, it’s possible to have two different APIs for achieving the same on both, despite the fact you using the same programming language.

A good example of this, until recently, was fetch, a common task like fetching data over HTTP, which you can perform on both the browser and the server. It was natively supported in the browser environment but not supported natively by NodeJS. This can be frustrating because despite the fact you are writing Javascript, the tooling changes based on your target environment.

Bun aims to address this by providing and implementing a list of standard web APIs that are similar to the ones available in the browser environment. Of course not all APIs available in the browser are required in the server environment, think of the DOM and History APIs as good examples of this.

But common tasks in both environments such as making HTTP calls don’t need to have unique Web APIs for each environment. Bun implements the Web Standard APIs for some of this, instead of re-inventing the wheel, which makes our Job (especially full-stack developers) a tad bit easier.

You can find a comprehensive list of Web Standard APIs implemented by Bun [here](https://bun.sh/docs/runtime/web-apis).

#### Supports Typescript and JSX/TSX out of the Box

With Bun, you don’t need to transpile your Typescript code to Javascript to execute it (or result in using something ts-node). You can execute your Typescript directly using Bun, and it’s going to do all the heavy lifting for you - the process of transpilation, and executing the resulting JS code, without you having to think about it.

**One very important caveat**, that I missed before and I was corrected in the comment section below, is that Bun doesn’t perform type-checking, unlike other build tools, just does transpilation. You will still need the Typescript compiler to Typecheck your code.

Bun treats TypeScript as a first-class citizen.

On top of that, it does support JSX (TSX by extension) out of the box, compiling it internally to JS code ready for execution. In both cases, Bun will respect your configurations (`tsconfigs`/`jsconfig`) during the transpilation/conversion process.

You can learn more about Typescript support [here](https://bun.sh/docs/runtime/typescript) and JSX [here](https://bun.sh/docs/runtime/jsx).

#### Single File Executables

Ever wanted to run compile your javascript into binary executables that you can run directly? Bun got your back here as well, you can compile Typescript and Javascript projects, including all dependencies into a single executable binary that you can distribute and run, without needing to install dependencies or even Bun itself.

On top of that, you can embed files and even databases such as SQS Lite, if you want to. Please note, that if you embed SQL Lite, it runs in memory and the changes will be lost when the binary exists. This does give you several choices when it comes to distributing your projects, which doesn’t require the OS to have all the dependencies installed to run.

### Bun Resources

Let’s say you are interested in learning more about Bun and probably give it a try. Bun has a website, where you can learn more about Bun and its features (including all the benchmark data captured in this issue), and here is the [link](https://bun.sh/).

1. [Bun Documentation](https://bun.sh/docs)
    
2. [Installation Instructions](https://bun.sh/docs/installation)
    
3. [Getting started with Bun and React](https://blog.logrocket.com/getting-started-bun-react/)
    
4. [Learn Bun, a faster Node.js alternative](https://www.freecodecamp.org/news/learn-bun-a-faster-node-js-alternative/)
    

### Conclusion

In this issue, I have done something different from my usual content. We have gone over Bun, a Javascript server runtime environment which is a drop-in replacement for NodeJS. We took a look at some of the features that set Bun apart from NodeJS and which might tempt you to switch to Bun.

That’s it from me and until next time, keep on learning.