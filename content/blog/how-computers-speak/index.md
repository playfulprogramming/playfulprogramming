> I want to start this article by saying "It's okay if you don't know programming". I'm writing this article as a starting point to a developer's journey or even just to learn more about how computers work under-the-hood. I'll make sure to cover as many of the basics as I can before diving into the more complex territory. That said, we all learn in different ways and I am not a perfect author. If you have questions or find yourself stuck reading through this, drop a comment down below or [join our Discord](https://discord.gg/FMcvc6T) and ask questions there. We have a very friendly and understanding community that would love to explain more in depth.
>
> 
>
> Further, while I'll be using JavaScript for the examples in this article, the foundational concepts apply regardless of what programming language you use. While some languages may have more or less complex translations to and from your machine, they ultimately boil down to the same formula.
>
> Now that that's out-of-the-way, let's get started!

If you've spent any time with developers, you'll likely have heard of the term "source code". Source code simply refers to the text that programmers type in order to make their programs. Take the following text:

```javascript
const magicNumber = 185;

console.log(magicNumber);
```

If you're not familiar with what that code does, that's okay. We'll explain this code in a bit. Right now it's just important to focus on what's being typed. If you opened Word, you'd be able to type this in using a typical QWERTY keyboard.

Now, while you _could_ write your code in Word, it would add additional (invisible) encoding characters in the file. However, if you were to use Notepad (or similar), and save this to a `.txt` file, it would be considered a "source code" file.

> Typically, code is not stored in a `.txt` file, but it rather stored in a different file extension. However, if you saved the code above in a `code.txt` file, then renamed that to a `code.js` file, that would be how JavaScript is typically stored. The contents of the file are exactly the same, just the file name (ala extension) is different

