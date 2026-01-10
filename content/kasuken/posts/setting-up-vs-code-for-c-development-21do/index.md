---
{
title: "Setting up VS Code for C# development",
published: "2023-08-31T13:58:01Z",
tags: ["csharp", "vscode"],
description: "Visual Studio Code (VS Code) is a popular and versatile code editor that supports many languages and...",
originalLink: "https://dev.to/this-is-learning/setting-up-vs-code-for-c-development-21do",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Visual Studio Code (VS Code) is a popular and versatile code editor that supports many languages and platforms. In this blog post, I will show you how to set up VS Code for C# development, using the C# Dev Kit extension and the .NET SDK.

## Prerequisites
- A computer running Windows, Linux, or macOS.
- VS Code installed on your computer. You can download it from [here](https://code.visualstudio.com).
- The .NET SDK installed on your computer. You can download it from [here](htp://dot.net). The .NET SDK is a set of libraries and tools that allow you to create and run .NET applications. It includes the .NET CLI, the .NET runtime and libraries, and the dotnet driver.

# Install the DevKit C# Extension
To install the C# Dev Kit extension for Visual Studio Code, you can follow these steps:

- Open Visual Studio Code and click on the Extensions icon in the Activity Bar on the left side of the editor. Alternatively, you can use the keyboard shortcut Ctrl+Shift+X (Cmd+Shift+X on macOS) to open the Extensions view.
- In the search box, type 'C# Dev Kit' and press Enter. You should see the C# Dev Kit extension by Microsoft in the results list.
- Click on the Install button to install the extension. You may need to reload VS Code to activate the extension.
- Once the extension is installed, you can start using it for C# development. You can also check out the [C# documentation] for more information and tips on how to use the extension.

![](https://github.com/microsoft/vscode-dotnettools/blob/main/docs/media/07-add.existing.project.gif?raw=true)

## Creating a simple C# application

To create a simple C# application, you can use the .NET CLI to generate a console app template. Open a terminal or command prompt and run the following command:

```bash
dotnet new console -o HelloWorld
```

This will create a folder named HelloWorld with a file named Program.cs inside it. The Program.cs file contains the following code:

```csharp
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

This is a simple C# program that prints "Hello World!" to the console.

## Opening the project in VS Code

To open the project in VS Code, you can either use the File menu and select Open Folder... or use the terminal or command prompt and run the following command from the HelloWorld folder:

```bash
code .
```

This will launch VS Code and open the HelloWorld folder as a workspace.

## Running and debugging the application

The C# Dev Kit extension provides multiple ways to run and debug your C# application. Here are some of them:

### Debug with F5

With no debug configurations available to select in the Debug view, you can start debugging your project by having a .cs file opened and then pressing F5. The debugger will automatically find your project and start debugging. If you have multiple projects, it will prompt for which project you would like to start debugging.

You can also start a debugging session from the Run and Debug view from the side bar of VS Code.

When you start debugging, VS Code will launch a terminal window and run the dotnet run command to execute your application.

You can use the debugging commands in the top bar to control the execution of your application, such as pause, resume, step over, step into, step out, restart, and stop.

You can also use breakpoints, watch expressions, call stack, variables, output, and debug console windows to inspect and modify the state of your application.

For more information on debugging in VS Code, see the [Debugging documentation](^9^).

### Debug with Solution Explorer

With the C# Dev Kit extension installed, there is a Debug context menu when you right-click on your project in the Solution Explorer. There are three options:

- Start New Instance - This starts your project with a debugger attached.
- Start without Debugging - This runs your project without a debugger attached.
- Step into New Instance - This starts your project with a debugger attached but stops at the entrypoint of your code.

You can access the Solution Explorer by clicking on the Solution Explorer icon in the Activity Bar or by using the keyboard shortcut Ctrl+Shift+P (Cmd+Shift+P on macOS) and typing "Solution Explorer".

### Debug with Command Palette

With the C# Dev Kit extension installed, you can also start debugging from the Command Palette by using the Debug: Select and Start Debugging command. This will give you a list of launch targets that you can choose from.

You can access the Command Palette by using the keyboard shortcut Ctrl+Shift+P (Cmd+Shift+P on macOS) or by clicking on the View menu and selecting Command Palette...

## Editing and refactoring the code

VS Code provides a rich C# editing experience, powered by Roslyn and C# Dev Kit. You can use features such as IntelliSense, formatting, linting, code fixes, refactorings, and more to write and improve your code.

### IntelliSense

IntelliSense is a feature that provides code completion, parameter info, quick info, and member lists. You can use the keyboard shortcut Ctrl+Space (Cmd+Space on macOS) at any time to get context-specific suggestions.

You can also enhance your IntelliSense experience with the GitHub Copilot extension, which is an AI-powered code completion tool that helps you write code faster and smarter. You can use the GitHub Copilot extension in VS Code to generate code, or to learn from the code it generates.

### Formatting and Linting

Formatting and linting are features that help you keep your code consistent and readable. You can use the keyboard shortcut Shift+Alt+F (Shift+Option+F on macOS) to format your code according to the C# coding conventions. You can also configure the formatting options in the VS Code settings.

Linting is a feature that analyzes your code for potential errors and warnings. You can see the linting results in the Problems window or in the editor as squiggles. You can also use the keyboard shortcut Ctrl+. (Cmd+. on macOS) to see a list of suggested actions to fix or improve your code.

### Refactoring

Refactoring is a feature that helps you modify your code without changing its behavior. You can use refactorings to rename variables, extract methods, move types, and more. You can access the refactoring options by using the keyboard shortcut Ctrl+. (Cmd+. on macOS) or by right-clicking on the code and selecting Quick Fix....

## Conclusion

In this blog post, I have shown you how to set up VS Code for C# development, using the C# Dev Kit extension and the .NET SDK. I have also demonstrated some of the features and benefits of using VS Code for C# development, such as debugging, IntelliSense, formatting, and refactoring.

If you have any questions or feedback, please leave a comment below. Happy coding!

---

![Dev Dispatch](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!


