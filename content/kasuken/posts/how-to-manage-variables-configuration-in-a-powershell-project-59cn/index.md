---
{
title: "How to Manage Variables Configuration in a PowerShell Project",
published: "2024-02-02T19:05:30Z",
tags: ["powershell", "development", "scripting"],
description: "One of the challenges of writing PowerShell scripts is how to handle variables configuration, such as...",
originalLink: "https://dev.to/this-is-learning/how-to-manage-variables-configuration-in-a-powershell-project-59cn",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

One of the challenges of writing PowerShell scripts is how to handle variables configuration, such as settings, paths, credentials, and other values that may vary depending on the environment or context. In this article, we will explore some best practices for managing variables configuration in a PowerShell project.

## Use a Configuration File

One of the simplest and most common ways to manage variables configuration is to use a configuration file. A configuration file is a PowerShell script that defines global variables that can be used by other scripts in the project. For example, you can create a file named `Config.ps1` and put all your configuration variables in it, such as:

```powershell
# Config.ps1
$ServerName = "SQLServer"
$DatabaseName = "MyDatabase"
$UserName = "Admin"
$Password = "P@ssw0rd"

```

Then, you can dot-source the configuration file in your main script or any other script that needs to access the configuration variables. Dot-sourcing is a way of executing a script in the current scope, so that any variables, functions, or aliases defined in the script are available in the caller's scope. To dot-source a script, you use the dot operator (`.`) followed by the path to the script. For example:

```powershell
# Main.ps1
. .\\Config.ps1 # Dot-source the configuration file
# Use the configuration variables
Write-Host "Connecting to $ServerName..."

```

Using a configuration file has some advantages:

- It separates the configuration from the logic, making the code more readable and maintainable.
- It allows you to change the configuration values without modifying the main script or other scripts that use them.
- It enables you to have different configuration files for different environments or scenarios, such as development, testing, production, etc.

However, using a configuration file also has some drawbacks:

- It exposes the configuration values in plain text, which may pose a security risk if they contain sensitive information such as passwords or keys.
- It requires you to manually copy or deploy the configuration file along with your main script or other scripts that use it.
- It may cause conflicts or errors if different scripts use different configuration files or define variables with the same name.

## Use Environment Variables

Another way to manage variables configuration is to use environment variables. Environment variables are variables that are defined by the operating system or by other applications and are available to all processes running on the system. PowerShell can access environment variables using the `env:` drive, which is a special provider that exposes environment variables as a hierarchical namespace. For example, you can access the `PATH` environment variable using `$env:PATH`.

To use environment variables for your configuration values, you need to define them before running your PowerShell script. You can do this using various methods, such as:

- Using the `Set-Item` cmdlet on the `env:` drive. For example:

```powershell
Set-Item env:ServerName "SQLServer"
```

- Using the `setx` command-line tool. For example:

```powershell
setx ServerName SQLServer
```

- Using the graphical user interface of your operating system. For example, on Windows 10, you can go to Settings > System > About > Advanced system settings > Environment Variables.

Using environment variables has some advantages:

- It avoids storing the configuration values in plain text files, which may improve security.
- It allows you to change the configuration values without modifying your PowerShell script or other scripts that use them.
- It enables you to have different configuration values for different users or sessions on the same system.

However, using environment variables also has some drawbacks:

- It may not be convenient or feasible to define environment variables for every configuration value you need.
- It may cause conflicts or errors if different scripts use environment variables with the same name but different meanings.
- It may not be portable across different systems or platforms that have different environment variables or naming conventions.

## Use Parameters

A third way to manage variables configuration is to use parameters. Parameters are arguments that are passed to a PowerShell script or function when it is invoked. Parameters allow you to specify input values for your script or function without hard-coding them in the code. You can define parameters for your script or function using the `param` keyword at the beginning of the script or function body. For example:

```powershell
# Main.ps1
param(
  $ServerName,
  $DatabaseName,
  $UserName,
  $Password
)
# Use the parameters
Write-Host "Connecting to $ServerName..."
```

Then, you can pass values to the parameters when you call the script or function. You can do this using various methods, such as:

- Using named parameters. For example:

```powershell
.\\Main.ps1 -ServerName SQLServer -DatabaseName MyDatabase -UserName Admin -Password P@ssw0rd
```

- Using positional parameters. For example:

```powershell
.\\Main.ps1 SQLServer MyDatabase Admin P@ssw0rd
```

- Using splatting. Splatting is a way of passing a collection of parameter values to a script or function using a single variable. The variable can be an array, a hash table, or a custom object. For example:

```powershell
# Define a hash table with parameter names and values
$Params = @{
  ServerName = "SQLServer"
  DatabaseName = "MyDatabase"
  UserName = "Admin"
  Password = "P@ssw0rd"
}
# Pass the hash table using the @ symbol
.\\Main.ps1 @Params
```

Using parameters has some advantages:

- It allows you to pass different configuration values to your script or function without modifying the code.
- It enables you to validate the parameter values using attributes such as `[ValidateSet]`, `[ValidatePattern]`, `[ValidateRange]`, etc.
- It supports default values, mandatory values, dynamic values, and other features that make your script or function more flexible and robust.

However, using parameters also has some drawbacks:

- It may not be convenient or feasible to pass parameters for every configuration value you need.
- It may expose the configuration values in plain text on the command line, which may pose a security risk if they contain sensitive information such as passwords or keys.
- It may require you to write additional code to handle parameter binding, parsing, error handling, etc.

## My favorite approach

For my project I would like to use a typical config file with a key-value-pair for each line.
Something like this:

```
tenantID=this is my tenant
clientID=client id
clientSecret=my secrets
tenantName=Contoso.com
```

There isn't an official way to do that in PowerShell directly.
So, you have to create a small portion of code to load the config file content and set the variable names and values.

```powershell
function Load-Config
{
    Foreach ($i in $(Get-Content local.config)){
        Set-Variable -Name $i.split("=")[0] -Value $i.split("=",2)[1] -Scope global
    }
}
```

I created a function for a better approach and maintenance of the code.
In this foreach, the code set a variable with the same name of the config key and the value with everything in the row after the = character.
In order to use the variables in all the scripts in your project and modules, the script sets the scope as global.

Using the variables is very easy, you just need to add the dollar symbol on a variable with the same name of the config key.
From the previous example you can have:
$tenantID, $clientID and so on.

You can call the function Load-Config at the beginning of your script. In this case you can be sure that all the script and functions have access to the variables.

## Conclusion

In this article, we have discussed three ways to manage variables configuration in a PowerShell project: using a configuration file, using environment variables, and using parameters. Each method has its own pros and cons, and you may need to use a combination of them depending on your needs and preferences. The following table summarizes some of the main differences between the methods:

| Method               | Security | Portability | Flexibility | Complexity |
| -------------------- | -------- | ----------- | ----------- | ---------- |
| Configuration file   | Low      | Medium      | High        | Low        |
| Environment variable | High     | Low         | Medium      | Medium     |
| Parameter            | Medium   | High        | High        | High       |
| Config File          | High     | High        | High        | High       |

As a general guideline, you should follow these best practices when managing variables configuration in a PowerShell project:

- Use descriptive and specific names for your configuration variables.
- Use Pascal case for your configuration variable names.
- Use standard parameter names or aliases for your script or function parameters.
- Use splatting to pass multiple parameter values to your script or function.
- Store sensitive information such as passwords or keys in secure locations such as Windows Credential Manager or Azure Key Vault.

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
