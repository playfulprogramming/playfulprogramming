---
{
title: "How to Use Visual Studio Like a Pro When Presenting Your Code",
published: "2023-05-10T07:10:00Z",
tags: ["visualstudio", "csharp", "speaking"],
description: "Visual Studio is great to write code and create something amazing, but sometimes, you may want to use...",
originalLink: "https://dev.to/this-is-learning/how-to-use-visual-studio-like-a-pro-when-presenting-your-code-5955",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Hidden gems in Visual Studio 2022",
order: 1
}
---

Visual Studio is great to write code and create something amazing, but sometimes, you may want to use it for a different purpose: presenting your code to an audience. Whether you are giving a demo, a workshop, a lecture, or a webinar, you want to make sure that your audience can see and understand your code clearly. That's where Presentation Mode comes in.

Presentation Mode is a feature that lets you open an instance of Visual Studio that looks like a fresh install, without any customizations, extensions, or settings synchronization. This way, you can avoid any distractions or confusion that may arise from your personal preferences or environment. You can then adjust any settings that are relevant for your presentation, such as font sizes, themes, window layouts, and keyboard shortcuts. These settings will be preserved for the next time you use Presentation Mode.

## How to Enter Presentation Mode

There are two ways of entering Presentation Mode in Visual Studio: with an extension or from command prompt without extensions.

### With the extension

The easy way is to install the [Tweaks extension](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.Tweaks) and open any solution, project, or file in Visual Studio. Now you can right-click the Visual Studio icon in the Windows task bar and select **Presentation Mode**.

This will launch a new instance of Visual Studio with the default settings and no extensions (other than machine-wide ones). You can then open your solution or project and start presenting.

### From Command Prompt

You can do the same thing yourself if you don't want to install the extension. Open the Developer Command Prompt or Developer PowerShell and execute the following line:

```bash
devenv /RootSuffix PresentationMode
```

This will launch a new instance of Visual Studio with the root suffix PresentationMode. You can swap the word PresentationMode with whatever other word you want to create yet another isolated instance type. This can be helpful for scenarios where you need different settings based on the kind of project you are working on. For instance, you might prefer specific extensions and window layouts only for web development. This allows you to have that versatility.

## How to Customize Presentation Mode

Once you have entered Presentation Mode, you can customize any settings to configure Visual Studio for your presentation style. Here are some common settings that you may want to change:

- **Font sizes**: You can change the font sizes for the Text Editor, Environment, Tooltips, Statement Completion, and more from **Tools > Options > Environment > Fonts and Colors**. A good rule of thumb is to use at least 18 points for the Text Editor and 12 points for the Environment.
- **Theme**: You can change the theme from **Tools > Options > Environment > General**. You may want to choose a theme that matches your presentation slides or has good contrast for your audience.
- **Window layout**: You can change the window layout from **Window > Reset Window Layout**. You may want to minimize or close any tool windows that are not relevant for your presentation, such as Solution Explorer, Output, Error List, etc. You can also use **Window > Auto Hide All** to hide all tool windows until you hover over them.
- **Keyboard shortcuts**: You can change the keyboard shortcuts from **Tools > Options > Environment > Keyboard**. You may want to use the default keyboard shortcuts or choose a scheme that matches your audience's expectations.

These settings will be saved for the next time you use Presentation Mode. If you want to reset them to the default values, you can use **Tools > Import and Export Settings > Reset all settings**¹.

## How to Exit Presentation Mode

To exit Presentation Mode, simply close the instance of Visual Studio that you used for presenting. This will not affect your normal instance of Visual Studio or any other instances with different root suffixes.

## Conclusion

Presentation Mode is a handy feature that lets you use Visual Studio in a clean and distraction-free way for presenting your code to an audience. It allows you to customize any settings that are relevant for your presentation style, such as font sizes, theme, window layout, and keyboard shortcuts. These settings will be preserved for the next time you use Presentation Mode. To enter Presentation Mode, you can either use the Tweaks extension or the Developer Command Prompt or PowerShell. To exit Presentation Mode, simply close the instance of Visual Studio that you used for presenting. I hope this article has helped you learn how to use Visual Studio in Presentation Mode and how to make your code presentations more effective and engaging.
