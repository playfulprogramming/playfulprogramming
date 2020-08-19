> While I'll be using JavaScript for the examples in this article, the foundational concepts apply regardless of what programming language you use. While some languages may have more or less complex translations to and from your machine, they ultimately boil down to the same formula.
>
> Now that that's out-of-the-way, let's get started!









 I'm writing this article as a starting point to a developer's journey or even just to learn more about how computers work under-the-hood. I'll make sure to cover as many of the basics as I can before diving into the more complex territory. That said, we all learn in different ways and I am not a perfect author. If you have questions or find yourself stuck reading through this, drop a comment down below or [join our Discord](https://discord.gg/FMcvc6T) and ask questions there. We have a very friendly and understanding community that would love to explain more in depth.







Starting out programming can feel intimidating because there are many components that comes in to play when learning about programming that isn't properly explained at the very first time. Take for example, an error like this: 

```javascript
const magicNumber = = 185;
```

```
Uncaught SyntaxError: Unexpected token '='
```

Why does this happen? 













If you've spent any time with developers, you'll likely have heard of the term "source code". Source code simply refers to the text that programmers type in order to make their programs. Take the following text:

```javascript
const magicNumber = 185;

console.log(magicNumber);
```

If you're not familiar with what that code does,  we'll explain this code in a bit. Right now it's just important to focus on what's being typed. If you opened Word, you'd be able to type this in using a typical QWERTY keyboard.

Now, while you _could_ write your code in Word, it would add additional (invisible) encoding characters in the file. However, if you were to use Notepad (or similar), and save this to a `.txt` file, it would be considered a "source code" file.

> Typically, code is not stored in a `.txt` file, but it rather [stored in a different file extension](/posts/what-do-files-extensions-do/). However, if you saved the code above in a `code.txt` file, then renamed that to a `code.js` file, that would be how JavaScript is typically stored. [The contents of the file are exactly the same, just the file name (ala extension) is different](/posts/what-do-files-extensions-do/)

However, you'll notice that if you double-click the file nothing special happens, it just opens the file in a text editor. You'd have to use something like [NodeJS](https://nodejs.org/) which is a program used to run JavaScript source code files as a program. While this might make sense at a surface level, it brings more things into question.

- Why do I need a custom program to run some programming languages?
- How does a computer turn letters and symbols into instructions that it knows how to run?
- Why do some programming languages have different rules and look different from one-another?
- Why can't we simply give the computer English instructions and have it run those with a special program?

The answer to all of these involves an understanding of how hardware works, and one of the best ways to learn programming is to learn how a computer works in the first place.

# How A Computer Works {#computer-hardware}

> This section won't be a complete "Computers 101" course. While we _will_ be writing material that dives in deeper into these subject matters, this is meant as a short description to supplement explanations later on in the article. If you'd like to see that type of content in the future, be sure to [sign up for our newsletter](https://newsletter.unicorn-utterances.com/)

Your computer is comprised of many components, but today we'll be focusing on five of the primary ones:

- Motherboard
- Long Term Storage ("HDD" or "SSD")
- Graphics Processing Unit ("GPU")
- Central Processing Unit ("CPU")
- Random Access Memory ("RAM")

These are used to connect each of these parts together, make up the "brains" of your computer. Whenever you take an action on your computer, these components launch into action to bring you the output you'd expect. Be it auditory, visual, or some other form of output, these components will do the "thinking" required to make it happen.

## Motherboard {#mobo}

A motherboard is the platform in which all other components connect together and communicate through. There are various integrated components to your motherboard like storage controllers, chipsets that are necessary for your computer to work. Fancier motherboards include additional functionality like high speed connectivity (PCIE 4.0) and Wi-Fi. 

When you turn on your computer, the first that will happen is your motherboard will do a "POST"; a hardware check to see if everything connected is functioning properly. Then the motherboard will start the boot sequence; which starts with storage

## Long Term Storage {#hdd}

There are 2 primary types of storage in computers; Solid State Drives (SSD), and Hard Disk Drives (HDD). When the boot sequence hits storage, your drive will scan the very first bit of it's disk ([also known as the "boot sector"](https://en.wikipedia.org/wiki/Boot_sector)) to find the installed operating system. Once your storage is done finding the relevant files, your computer reads the rest of the information off of the drive to load your system. This include configuration files that you've updated by setting up your computer (like your username, wallpaper, and more) as well as the system files setup when you installed your operating system (like Windows). Moreover, this is also where your documents live. If you've written a document in Microsoft Word, downloaded a song from iTunes, or anything in between, it lives on your hard drive.

## Memory {#ram}

While SSDs and HDDs are fantastic for long-term file storage, they're too slow (in terms of reading speeds) to store data needed to run your computer. This is why we have memory in the form of Registers, and Random Access Memory (RAM).  Registers are the closest memory to your processor, and is extremely fast, but they are extremely small. System Memory, or RAM, is outside of the processor but allows us to store entire programs in a responsive manner.  Everything from your operating system to your video player utilizes memory in order to store data while it's processing. We'll see how the computer utilized registers and RAM in programs [later in the article](#assembly-code).

However, while this information is magnitudes faster to access than hard-drives, it's volatile. That means that when you turn off your computer, the data stored in RAM is lost forever. Memory is also much more expensive than Storage. This is why we don't store our files to RAM for long-term access.

## GPU {#gpu}

Computers are a marvel, but without some ability to interact with them, their applications are limited. For many, that interaction comes through their computer screens - being able to see the results of an action they've taken. Your computer's "graphics processing unit" (GPU) is the hardware that is used to calculate the complex maths required to draw things on-screen. The GPUs' complex mathematics prowess can also be utilized for things other than graphics (data analytics, cryptocurrency mining, scientific computation).

## CPU {#cpu}

Your CPU is what does all of the computation needed to perform tasks you do on your computer. It does the math and logic to figure out what the other components need to be doing and it coordinates them. An example of this is telling what the GPU what to draw. While your GPU does the calculations for what's to be drawn, the command to do such comes from the CPU. If your interaction requires data to be stored, it's the one that dispatches those actions to your HDD or RAM.

You can think of these components to work together similar to this:

![](./hardware_devices.svg)

> For those unaware, the visual cortex is the part of the brain that allows us to perceive and understand the information provided to us by our eyes. Our eyes simply pass the light information gathered to our brains, which make sense of it all. Likewise, the GPU does the computation but does not display the data it processes, it passes that information to your monitor, which in turns displays the image source to you.

## Putting It All Together

Now that you understand the individual components that go into your computer, let's explain how these are used in the real world.

Assuming the program is already installed on the computer, when the user selects the icon on their device, the CPU tells the HDD to load the relevant initialization data 

 

# Assembly: What's that? {#assembly-code}

> Assembly is the most direct method for talking to computer hardware outside of manually writing binary. However, due to it's proximity to the hardware, each type of CPU has a different flavor of assembly. Because of this, the actual assembly code isn't particularly important, nor is it particularly accurate. Keep that in mind as we go forward.

You may have heard that computers only truly understand `1`s and `0`s. While this is true, this is not how engineers program. 

Even for direct hardware access, there is a language that doesn't 



All programming languages end up as assembly instructions at one stage or another (we'll touch on how that conversion takes place later on).







// Use faux assembly code to showcase how memory is assigned in "variable" creation

// Showcase a quick example of a stack, and how things work fundamentally different (aka more explicitly) in assembly 



# This (code) Keeps Lifting me Higher {#introducing-c-code}

As efficient as assembly code is, you may have noticed that it's not particularly readable. Further, for larger projects, it's not possible to manage a project of that scale without some abstractions that higher-level languages provide. This is where languages like C or Ruby come into play*.



// Showcase difference in assembly vs C coding for variable creation

// Show "assembled" faux assembly code that maps to the C code

```c
void main() {
   int magicNumber = 185;
}
```



## Compiler

## Tangent: Compiled vs. Runtime {#compiled-vs-runtime}

As [the start of this section](#introducing-c-code), we mentioned that languages like C or Ruby are higher-level languages than assembly. However, long-time developers will be quick to remind that these two languages are drastically different. The biggest difference between these being that C is a "compiled" language while Ruby is a dynamic "runtime" language.



// ...



But how does it know that X (JS) means that we want to do Y (ASSEMBLY)? How is it able to do that conversion?

# Introducing the AST {#ast}

An Abstract Syntax Tree (AST) takes human-readible text and turns it into machine-understandable data using a rigid set of rules.

// ...



Let's take the following code snippet:

```javascript
const magicNumber = 185;
```

While this code sample is small (and doesn't do anything on it's own), it contains enough complexity in how the computer understands it to use as an introductory example.

## The Lexer {#lexer}

There are (typically) two steps to turning source code into something that the computer is able to transform into assembly instruction sets.

First, the computer goes through a **"lexer"**. The lexer is what turns individual characters into collections of characters called **"tokens"**. These tokens can either be a single character or a collection of characters. Both the lexer and the token identifiers are programmed into the language (either in the runtime or the compiler). Taking the code snippet, we can see that there's 5 tokens that are generated:

![](./lexer_1.svg)

> These lexer demos are a general aproximation of how a lexer might work. This particular example isn't based on any specific JavaScript lexer

While these tokens' collective functions may seem obvious to you and I, the computer does not yet understand that we want to assign a variable, despite the "ASSIGN" name of the `=` token. At this stage of tokenization, synax errors do not exist yet, code logic does not exist yet, simply characters and tokens.

What do I mean by that? Let's take the following intentionally incorrect example:

```javascript
const magicNumber = = 185;
```

To a developer, this is obviously a syntax error. However, the lexer is not in charge of finding syntax errors, simply assigning tokens to the characters it's been taught to recognize. As such, running the above through a lexer would likely yeild us something like this:

![](./lexer_2.svg)

It's not until later (with the parser) that the computer recognizes that there is a synax error, at which point it will throw an error:

```
Uncaught SyntaxError: Unexpected token '='
```

Notice how it reports "Unexpected token"? That's because the lexer is converting that symbol into a token before the parser recognizes that it's an invalid syntax.

## The Parser {#parser} 

Now that we've loosely touched on the parser at the end of the last section, let's talk more about it!

At this stage, the lexer has already had time to convert the code into a series of tokens, complete with a bit of metadata about the tokens (such as what line number and column start/end of the token), and the parser is ready to convert these tokens into a tree for further computing.

> A tree is a kind of memory structure that represents a hierarchy of information related to one-another. While [we touched on this concept in our "Understanding the DOM" article](/posts/understanding-the-dom/), here's a quick chart from that article to show an example tree:
>
> ![](../understanding-the-dom/dom_tree.svg)
>
> Once a set of data is turned into a tree, the computer knows how to "walk" through this tree and utilize the data (and metadata of their relationships) to take actions. In this case, the tree that is created by the parser is traversed to compile the code into instruction sets.


Once the tokenized code is ran through the parser, we're left with the "syntax tree" of the code in question. For example, when ran through Babel's parser (A JavaScript parser written itself in JavaScript), we're left with something like the following:

![](./parser_1.svg)

While the above chart represents the code in a flat manner, it's anything but:

![](./ast_1.svg)

As you can see, there's a top-down view of the AST for the expected code. However, that's not all I'm able to provide. Because Babel's parser is implemented in JavaScript itself, I'm able to show the AST in the shape of a JavaScript object:

```javascript
{
  type: "File",
  program: {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "magicNumber",
            },
            init: {
              type: "NumericLiteral",
              value: 185,
            },
          },
        ],
        kind: "const",
      },
    ],
  },
};
```

> This is not the exact output of the Babel Parser. There is a great deal more metadata that has been stripped for the sake of simplicity

This showcases how much metadata is stored during the parsing process. Everything from operator order to variable naming is stored during this process. Because of this, the conversion to instructions is made possible.

Needless to say, whether you're using a compiled language or a runtime language, you're using an AST at some point of using the language.

## Why Not English? {#english-vs-ast}

// Explain linguistical complexities and it's loose set of rules (comparitively)



// AI is able to do this a bit, there are projects working on making that exact question possible



# Conclusion



