---
{
title: "Playwright - debug your tests",
published: "2022-12-21T09:00:42Z",
edited: "2023-02-21T07:19:12Z",
tags: ["playwright", "e2e", "vscode", "extensions"],
description: "Debug your tests   One of the most popular things done by developers is to debug the code...",
originalLink: "https://blog.delpuppo.net/playwright-debug-your-tests",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "20832",
order: 1
}
---


# Debug your tests

One of the most popular things done by developers is to debug the code using `console.log`.  
But today I want to show you how to debug your Playwright tests.

Let's start with the Playwright Inspector.  
Using the option `--debug` when you run the tests, Playwright opens two new windows in your display, a browser and the Playwright Inspector.  
To try this, you can type in your terminal this command `npx playwright test --debug`, the result seems like this

![Playwright Inspector](https://cdn.hashnode.com/res/hashnode/image/upload/v1670410960054/mKShQ1M4a.gif)

You can use the commands in the inspector to move forward in the test and check the stuff.

Cool, but I prefer debugging the tests directly from my editor (VsCode). To do that, you have to install the official extension called [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). The extension permits you to install Playwright in your projects or add new browsers configuration, but today the goal is the debug feature.  
Now, in VsCode if you open the Test Explorer, you can see all your tests in the projects and run them or debug them directly from your editor. Here is an example.

![VsCode Test Explorer](https://cdn.hashnode.com/res/hashnode/image/upload/v1670413453990/Es3Xapjj_.png)

Ok, now it's time to see how you can run or debug your test directly from VsCode.  
First of all, using the command in the top right of the Test Explorer panel, you can decide between running or debugging all the tests in your suite. Clicking on the arrow on the left of these buttons, you can also decide in which browser you want to run your tests. Here is a short demo!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1670414310565/e0RQ7kmhL.gif)

In this example, you can see how the runner works, but now it's time to see how it's possible to debug tests.  
Let's start adding a break-point in the code base. If you are not familiar with this in VsCode, it's elementary, click with the mouse on the left of the line where you want the debugger stops its execution.

{% embed https://youtu.be/QIryVOtMXvM %}

Now, it's time to debug the test. We will see two methods to debug the tests; the first runs all the tests, and the second runs only the necessary test.

**Debug all the tests**

Using the icon in the top-right of the test explorer, you can run all your tests in debug mode, and for each test with a break-point, VsCode can stop the execution and permits you to check the test's status. Here is a video example of that.

{% embed https://youtu.be/F5L-qpg3UBA %}

That is a good example, but typically, you want to debug one test per time.

**Debug only needed test**

To do that, the flow is very similar, you have to choose which test you want to debug and insert a break-point where you want the execution will stop. Then in Test Explorer, you have to search for your test; you can type the name of your test in the search bar, or you can scroll through the three and find it using the mouse. To run your test now, you must press the icon relative to the debug execution on the right of the test name. Doing that, VsCode will run your test and will stop the execution when the code arrives at the break-point. Here, you can check your application's status and the problems in your test. Using the command in the top-right of the VsCode's window, you can move on in the execution.

{% embed https://youtu.be/68mH0VsjV4M %}

As you can see, if you are playing with the Test Explorer, you can run or debug all the tests or a specific one. The same approach exists for groups of tests too, so you can run or debug a bunch of tests in the same `describe`.

Ok, I spent an entire article showing you how you can run or debug tests using VsCode because many times I see people that don't know how to debug, and they spend a lot of time finding the problem and fixing the test. Now you have all the tools to debug your tests with Playwright, so you can check and fix tests quickly.

That's it for today; you have learnt how to run and debug tests with Playwright; before using the Playwright inspector and then directly from VsCode.  
I hope you enjoy this content, and if you have any questions, don't hesitate to reach out to me.

See you soon, folk

Bye bye

{% embed https://dev.to/puppo %}