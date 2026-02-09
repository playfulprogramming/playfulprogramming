---
{
title: "How to retrieve sub properties in a PowerShell script with the Invoke-Expression method",
published: "2023-12-07T13:55:00Z",
tags: ["powershell"],
description: "Sometimes, you may want to access the sub properties of an object, which are the properties of the...",
originalLink: "https://https://dev.to/playfulprogramming/how-to-retrieve-sub-properties-in-a-powershell-script-with-the-invoke-expression-method-16f4",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Sometimes, you may want to access the sub properties of an object, which are the properties of the properties. For example, if you have a process object, you can access its name, id, memory usage, and other properties. But what if you want to access the properties of the process’s main module, such as its file name, version, or description? How can you do that in PowerShell?

One way to do that is to use the **Invoke-Expression** method, which evaluates a string as a PowerShell command and returns the result. This method can be useful when you want to dynamically construct a command based on some variables or parameters. For example, suppose you have a variable `$path` that contains the registry key path, and you want to get the value of a sub property named `InstallPath` under that key. You can use the Invoke-Expression method to construct and execute the command like this:

```powershell
$path = 'HKLM:SOFTWARE\Wow6432Node\Microsoft\.NETFramework'
Invoke-Expression "(Get-ItemProperty -Path '$path' -Name 'InstallPath').InstallPath"
```

The result of this command will be the value of the `InstallPath` sub property, which is a string that represents the installation path of the .NET Framework. Note that the command is enclosed in double quotes, and the `$path` variable is expanded inside the single quotes. The parentheses around the `Get-ItemProperty` cmdlet ensure that the sub property is accessed after the cmdlet is executed.

Another example is to use the Invoke-Expression method to access the sub properties of a process object. Suppose you have a variable `$MyPowershellProcess` that contains a process object for the PowerShell process. You can use the Invoke-Expression method to get the file name of the process’s main module like this:

```powershell
$MyPowershellProcess = Get-Process powershell
Invoke-Expression "$MyPowershellProcess.MainModule.FileName"
```

The result of this command will be the file name of the PowerShell executable, which is a string that represents the full path of the file. Note that the command is enclosed in double quotes, and the `$MyPowershellProcess` variable is expanded inside the quotes. The dot operator is used to access the sub property `FileName` of the `MainModule` property.

In my last script I use the following code to access sub properties with the name inside other variables:

```powershell
$propertyValue = Invoke-Expression ('$result.value[0].' + $bestPractice.propertyPath + '.' + $bestPractice.name)
```

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
