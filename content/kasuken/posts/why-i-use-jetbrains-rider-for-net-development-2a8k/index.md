---
{
title: "Why I Use JetBrains Rider for .NET Development",
published: "2025-11-13T09:55:00Z",
edited: "2025-11-13T09:51:28Z",
tags: ["dotnet", "productivity"],
description: "Finding the ideal IDE for .NET work is rarely a straightforward journey. As .NET developers, I invest...",
originalLink: "https://dev.to/this-is-learning/why-i-use-jetbrains-rider-for-net-development-2a8k",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "34041",
order: 1
}
---


Finding the ideal IDE for .NET work is rarely a straightforward journey. As .NET developers, I invest huge amounts of time in tooling, and every annoyance—slow loading, awkward workflows, missing features, can disrupt my focus and flow. Visual Studio has long dominated my daily tool statistics, but in recent years JetBrains Rider has earned a place on my machine, and for good reason.

Rider is not just another editor. It’s a modern, cross-platform IDE built from the ground up by the same people behind ReSharper. If you’ve ever dreamed of a fast, resource-efficient, and deeply integrated development environment for .NET, Rider is likely already on your radar. What I’ve found is that, once you get past the initial adjustment, Rider quietly improves the everyday experience of .NET development—sometimes in ways you don’t notice until you go back to something else.

![My icons on the taskbar](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sugfl4nltqtezkk5lwz1.png)

As you can see on the screenshot above, I don't have Visual Studio on my machine anymore.

---

## Why I Chose Rider Over Visual Studio

My journey with Rider began out of curiosity but quickly turned into appreciation for the sheer number of pain points it eliminates. The first thing that struck me was how effortlessly Rider runs on all my machines, regardless of operating system. I routinely work across Windows and Mac, and the ability to carry my IDE and settings with me is invaluable. No need for workarounds, no feature gaps, no “missing” editor windows.

I also used VS Code in the past as my main .NET environment, but I missed a lot of features. I love VS Code (I have also a tattoo with the logo), but for .NET it is not the right tool.

Performance is another area where Rider delivers. It opens massive solutions fast and rarely stumbles even when refactoring or running code analysis on large codebases. The UI feels modern and uncluttered, but it’s also highly customizable. Shortcuts and navigation are easy to adjust, and you quickly fall into a rhythm where you can fly through files, definitions, and references without reaching for the mouse.

What really sold me, though, was the depth of built-in tooling. Rider ships with ReSharper-level code inspections, refactorings, and quick-fixes by default. There’s no need to add extra plugins or endure the lag that sometimes comes with layering on more extensions in Visual Studio. Integrated Git support (even if I use more often a mix between GitKraken, GitHub Desktop and the console), a robust database explorer, and even a built-in HTTP client are all available out of the box.
For this reason, I still have Postman on my machine, but when I can, I use the http client inside Rider. I can save the http files directly in the solution and everyone in the project can use it, because they are part of the source code.

---

## Living With Rider Day to Day

Switching IDEs is a real commitment, and I was skeptical about leaving behind years of muscle memory from Visual Studio.
At the beginning, I had VS and Rider, side by side, but I always finished to using VS because I was too lazy to learn new things.
Then, when I got a new laptop, I installed only VS Code and Rider, so I forced myself to use it. No excuse.
But after the first week, Rider’s workflow began to feel natural. Solution management is painless. I can open .NET Core, ASP.NET, and Windows Forms in the same window. Multi-targeted projects work without friction. Git operations and branching are tightly integrated. The built-in terminal means fewer context switches, and the task runner lets me automate everything from builds to test runs with a couple of keystrokes.

Debugging is quick and reliable—setting breakpoints, inspecting variables, attaching to processes, and even editing code while debugging all feel snappy. Navigating large codebases is more fluid, thanks to instant "Go to Definition" and symbol search features. Code inspections and suggestions are always present, but never intrusive.

Rider feels purpose-built for people who want to code more and configure less. Dark mode, custom themes, and adaptable keymaps let you shape the environment to your preferences with little effort.

As a theme, now I am using the default Dark theme of Rider. For having the same feeling when I use VS Code, I found the porting of the theme even for VS Code.

---

## 5 Hidden Gems in Rider

Beyond the headline features, Rider hides a number of tools that can fundamentally change how you work, often going unnoticed until you stumble across them.

First, Rider’s dynamic code analysis runs continuously in the background, flagging potential bugs, code smells, and even subtle style violations. The real value is in the instant quick-fixes: a single keyboard shortcut (Alt+Enter) and Rider can reformat, refactor, or even rewrite problematic code, all without interrupting your train of thought.
Sometimes I disable this option when I am on my laptop on the train or in general not at my desk to preserve a little bit the battery. It's quite easy to turn it on and off because there is an option directly on the File menu.

Navigation is another quiet superpower. The "Search Everywhere" window, triggered with Shift+Shift, brings up files, classes, symbols, settings, and even menu commands in one place. Combined with highly customizable keymaps and actions, it’s easy to move around a project without ever reaching for the mouse.

![The "Search Everywhere" window](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/85zy3nvwzpemuspjhkmi.png)

If you care about code consistency, Rider’s integration with `.editorconfig` files stands out. The IDE enforces formatting and style rules across your project and visually indicates where your code diverges from team standards. The built-in visual editor makes tweaking rules straightforward, and you can catch issues before they hit code review.
I use the .editorconfig of a friend of mine, Marco Minerva. I move that file from project to project all the time.

For those who frequently interact with web APIs, Rider’s HTTP client is a small but powerful addition. It lets you create `.http` files directly in your solution, send requests, inspect responses, and even generate C# HTTP client code—all without leaving the IDE or reaching for external tools like Postman.

Finally, the database explorer in Rider means you don’t need a separate SQL tool for most data work. You can connect to major databases, run queries, and even preview LINQ queries mapped to your schema—all from within your solution. As a not really an expert in Database and Entity Framework, I love this integration.

![database explorer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p9hrknqaj64rnqxjro4e.png)

---

## GitHub Copilot Integration

One of the most exciting developments for Rider is its tight integration with GitHub Copilot. As you type, Copilot surfaces context-aware suggestions—sometimes completing whole methods or filling out boilerplate code from just a comment or a function signature.

What’s especially useful is how well Copilot integrates with Rider’s own completion system. Suggestions appear inline, can be accepted or cycled with familiar shortcuts, and work across all supported languages—including C#, JavaScript, TypeScript, and Razor files. This means you get AI assistance not just for backend code but also for front-end, tests, and even scripting tasks.

![GitHub Copilot Integration](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3ydbdmptmfw3g4vylrej.png)

For me, Copilot in Rider isn’t just a novelty; it’s a genuine productivity boost. It helps me prototype faster, learn new APIs in context, and avoid repetitive coding.
I will write another blog post for this specific topic.

---

## Drawbacks and Considerations

No tool is perfect, and Rider is no exception. The most obvious barrier for many is cost: Rider requires a commercial license. For hobbyists or open-source developers, there is a free version with all the features enabled!

Extension support is another point to consider. While Rider’s plugin ecosystem is robust and growing, there are still some Visual Studio extensions and integrations that haven’t made the leap. If you rely on a very specific workflow or niche tooling, you’ll want to check compatibility before switching.

The UI does take some getting used to if you’re coming from Visual Studio. Some menus are arranged differently, and not all wizards or designers are present. If you’re tied to Windows-specific features, especially for legacy .NET workloads or advanced Azure integrations, you may find Rider lacking in those areas.

Finally, in larger organizations, the choice of IDE may not be yours alone. Some teams or companies standardize on Visual Studio, so using Rider could be discouraged or unsupported in those environments.

---

🙋‍♂️ Hey, I'm Emanuele — you might know me online as **Kasuken**.

👨‍💻 Senior Cloud Engineer | Microsoft MVP (12x) | GitHub Star (4x)  
🛠️ I build things with **.NET**, **Azure**, **AI**, and **GitHub**  
🌈 Turning code into 🦖 and 🦄 — one commit at a time

🚀 If you're into .NET, GitHub, DevOps, or just cool side projects,  
feel free to [connect with me on LinkedIn](https://www.linkedin.com/in/bartolesiemanuele)

P.S. I break things so you don’t have to. 😉