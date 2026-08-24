---
{
title: "Running External Commands in C# and Wait Until They Finish",
published: "2025-06-28T18:29:50Z",
tags: ["csharp", "powershell"],
description: "Ever needed your C# application to run a PowerShell script, wait until it's done, and print the...",
originalLink: "https://dev.to/playfulprogramming/running-external-commands-in-c-and-wait-until-they-finish-3f8l",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Ever needed your C# application to run a PowerShell script, wait until it's done, and print the output directly in your console?

Maybe you're automating a deployment process, launching a diagnostic script, or integrating with a CLI tool like Git, Docker, or ffmpeg.
After a few years, in these days, I had to do it again and I think I found the right way again, because I forgot how to do it! 😀

Let’s dive in.

---

## 🚀 Why Execute External Commands from C#?

Running external commands from a C# application is more common than you might think. In many real-world scenarios, you don’t want to reimplement logic that already exists in command-line tools or scripts.

Here are a few examples where this is useful:

- 💪 **Automation & DevOps**: Running PowerShell scripts for provisioning resources, deploying software, or managing files.
- 🐳 **Tool Integration**: Calling `docker`, `git`, `az`, or `ffmpeg` to leverage existing CLI workflows inside your app.
- 📄 **Legacy Compatibility**: Executing older batch or shell scripts without rewriting them in C#.
- 📦 **Hybrid Workflows**: Combining the power of .NET with external tools to create flexible automation pipelines.

> Tip: While it's easy to start a process, doing it right — especially handling output and waiting for completion — requires some care. That’s exactly what I will cover next.

---

## ⚙️ Setting Up the Project

To follow along, you’ll need a basic .NET console application. Here's how to get started:

### 🛠️ Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (I use .NET 9 but from .NET 6 is more or less the same)
- PowerShell (included on Windows by default)
- An IDE like Visual Studio, JetBrains Rider, or just your favorite code editor and terminal

### 📦 Creating the Project

In your terminal:

```bash
dotnet new console -n ConsoleWaitScript
cd ConsoleWaitScript
```

This scaffolds a simple C# console app with a `Program.cs` file.

Next, replace the contents of `Program.cs` with the following code.
I'll break it down in detail in the next section.

---

## 🧪 The Inline PowerShell Example

Let’s dive into the heart of the project — running an inline PowerShell script from C# and waiting for it to complete.

Here’s the full code:

```csharp
using System;
using System.Diagnostics;

namespace ConsoleWaitScript
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("PowerShell Script Launcher");
            
            for (int i = 0; i < 10; i++)
            {
                RunInlineCountdownScript(10);
            }
        }

        static void RunInlineCountdownScript(int seconds)
        {
            Console.WriteLine($"Running inline PowerShell countdown script for {seconds} seconds");

            string inlineScript = $@"
Write-Host 'Starting countdown for {seconds} seconds'
for ($i = {seconds}; $i -gt 0; $i--) {{
    Write-Host \"$i seconds remaining...\"
    Start-Sleep -Seconds 1
}}
Write-Host 'Countdown complete!'
";

            try
            {
                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = $"-ExecutionPolicy Bypass -Command \"{inlineScript}\"",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = false
                };

                using (Process process = new Process())
                {
                    process.StartInfo = startInfo;

                    process.OutputDataReceived += (sender, e) =>
                    {
                        if (!string.IsNullOrEmpty(e.Data))
                            Console.WriteLine(e.Data);
                    };

                    process.ErrorDataReceived += (sender, e) =>
                    {
                        if (!string.IsNullOrEmpty(e.Data))
                            Console.WriteLine($"ERROR: {e.Data}");
                    };

                    process.Start();

                    process.BeginOutputReadLine();
                    process.BeginErrorReadLine();

                    process.WaitForExit();

                    Console.WriteLine($"Script completed with exit code: {process.ExitCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing PowerShell script: {ex.Message}");
            }
        }
    }
}
```

### 🔍 What’s Happening Here?

- I defined a PowerShell script inline, using string interpolation to build the countdown logic dynamically.
- `ProcessStartInfo` configures how the process will run:

  - `UseShellExecute = false`: needed to redirect output.
  - `RedirectStandardOutput` and `RedirectStandardError`: lets us capture and log what the script prints.
  - `CreateNoWindow = false`: allows you to see the script’s window, if one opens.
- We hook into `OutputDataReceived` and `ErrorDataReceived` to print live output from PowerShell.
- `WaitForExit()` makes sure our app waits for the script to finish before continuing.

> Note: This pattern works for any executable, not just PowerShell!

---

## 📦 Tips

### 🔒 `UseShellExecute = false`

Setting this to `false` is essential when you want to redirect output or error streams.

### ⏹️ Always Wait for Completion

Without `process.WaitForExit()`, your application may exit or continue before the external command finishes.

### 📤 Flush Output with `BeginOutputReadLine`

Using this ensures output is processed line-by-line and doesn't hang waiting for the full buffer.

### 💡 Escape Carefully

If your script gets complex, consider writing it to a `.ps1` file instead of embedding it.

### ⚠️ About `-ExecutionPolicy Bypass`

Use with care, especially in production.

---

## 📌 Real-World Use Cases

### 🐙 Git Automation

For instance, this is my case. I have to wait a long operation, based on git.

```csharp
startInfo.FileName = "git";
startInfo.Arguments = "clone https://github.com/user/repo.git";
```

### 🐳 Running Docker or CLI Tools

```csharp
startInfo.FileName = "docker";
startInfo.Arguments = "run --rm hello-world";
```

### 🛠 DevOps Script Orchestration

Use with database backups, codegen, secret rotation, etc.

### 🧪 Test Harnesses

Great for running test runners or diagnostic tools.

---

🔖 Stay ahead of the dev curve
I created a Curated RSS Feed Bundle for Web Developers — a hand-picked OPML file of the best dev blogs and websites on the internet.
💡 Just download, import into your favorite RSS reader (like Feedly or NetNewsWire), and enjoy fresh insights every day.

👉 [Grab it on Gumroad](https://emanuelebartolesi.gumroad.com/l/rssfeeds) — stay sharp without the noise.
