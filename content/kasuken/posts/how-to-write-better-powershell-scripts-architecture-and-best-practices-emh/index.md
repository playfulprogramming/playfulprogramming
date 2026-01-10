---
{
title: "How to Write Better PowerShell Scripts: Architecture and Best Practices",
published: "2023-05-23T08:22:56Z",
edited: "2023-05-23T08:23:52Z",
tags: ["powershell", "bestpractices", "cleancode"],
description: "PowerShell is a powerful scripting language that can automate tasks, manage configuration, and...",
originalLink: "https://dev.to/this-is-learning/how-to-write-better-powershell-scripts-architecture-and-best-practices-emh",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

PowerShell is a powerful scripting language that can automate tasks, manage configuration, and interact with various systems and services. However, writing good PowerShell scripts requires more than just knowing the syntax and commands. It also involves following some best practices and principles that can make your scripts more readable, maintainable, secure, and reusable.

In this blog post, I will share some tips and guidelines on how to design and write better PowerShell scripts, focusing on the following aspects:

- Script architecture: how to structure your script files and modules
- Script parameters: how to define and validate input parameters for your scripts
- Script output: how to handle and format output data from your scripts
- Script error handling: how to catch and handle errors and exceptions in your scripts
- Script testing: how to write and run unit tests for your scripts

## Script Architecture

One of the first decisions you need to make when writing a PowerShell script is how to organize your code into files and modules. A good script architecture can help you keep your code modular, reusable, and easy to debug.

### Script Files

A script file is a file with the .ps1 extension that contains PowerShell code. You can run a script file by invoking it with the dot sourcing operator (.) or the call operator (&), or by using the Invoke-Command cmdlet.

A script file can contain any PowerShell code, such as variables, functions, classes, commands, expressions, etc. However, it is recommended to follow some conventions when writing a script file:

- Use a descriptive name for your script file that reflects its purpose or functionality
- Use the #Requires statement at the beginning of your script file to specify the minimum version of PowerShell or any modules or snap-ins that your script depends on
- Use comment-based help to document your script file with a synopsis, description, parameters, examples, etc.
- Use regions to group related code blocks within your script file
- Use indentation and whitespace to make your code more readable
- Use consistent naming conventions for your variables, functions, classes, etc.
- Use splatting to pass parameters to commands that have many arguments
- Use the Write-Verbose cmdlet to write informative messages that can be displayed when the -Verbose switch is used
- Use the Write-Debug cmdlet to write diagnostic messages that can be displayed when the -Debug switch is used

Here is an example of a well-written script file:

```powershell
#Requires -Version 7.3
<#
.SYNOPSIS
    A script that performs some task.

.DESCRIPTION
    A detailed description of what the script does.

.PARAMETER InputFile
    The path to the input file.

.PARAMETER OutputFile
    The path to the output file.

.EXAMPLE
    .\\MyScript.ps1 -InputFile C:\\input.txt -OutputFile C:\\output.txt

    Runs the script with the specified input and output files.
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateScript({Test-Path $_})]
    [string]$InputFile,

    [Parameter(Mandatory=$true)]
    [ValidateScript({-not (Test-Path $_)})]
    [string]$OutputFile
)

#region Variables

$ErrorActionPreference = 'Stop'

#endregion

#region Functions

function Get-SomeData {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string]$Input
    )

    process {
        # Some code that gets some data from the input
        Write-Output $Data
    }
}

function Set-SomeData {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string]$Output,

        [Parameter(ValueFromPipelineByPropertyName=$true)]
        [string]$Data
    )

    process {
        # Some code that sets some data to the output
        Write-Output $Result
    }
}

#endregion

#region Main

Write-Verbose "Starting the script"

$Params = @{
    Path = $InputFile
    Encoding = 'UTF8'
}

$InputData = Get-Content @Params | Get-SomeData

$Params = @{
    Path = $OutputFile
    Encoding = 'UTF8'
}

$OutputData = $InputData | Set-SomeData | Set-Content @Params

Write-Verbose "Ending the script"

#endregion

```

### Script Modules

A script module is a file with the .psm1 extension that contains PowerShell code that can be imported and reused by other scripts or modules.

A script module can contain any PowerShell code, such as variables, functions, classes, commands, expressions, etc. However, it is recommended to follow some conventions when writing a script module:

- Use a descriptive name for your script module that reflects its purpose or functionality
- Use the #Requires statement at the beginning of your script module to specify the minimum version of PowerShell or any modules or snap-ins that your script module depends on
- Use comment-based help to document your script module with a synopsis, description, parameters, examples, etc.
- Use regions to group related code blocks within your script module
- Use indentation and whitespace to make your code more readable
- Use consistent naming conventions for your variables, functions, classes, etc.
- Use splatting to pass parameters to commands that have many arguments
- Use the Write-Verbose cmdlet to write informative messages that can be displayed when the -Verbose switch is used
- Use the Write-Debug cmdlet to write diagnostic messages that can be displayed when the -Debug switch is used
- Use the Export-ModuleMember cmdlet to specify which variables, functions, classes, etc. are exported and visible to other scripts or modules that import your script module
- Use the Module Manifest file (.psd1) to provide additional metadata and configuration for your script module

Here is an example of a well-written script module:

```powershell
#Requires -Version 7.3
<#
.SYNOPSIS
    A script module that provides some functionality.

.DESCRIPTION
    A detailed description of what the script module does.

.PARAMETER Input
    The input parameter for the Get-SomeData function.

.PARAMETER Output
    The output parameter for the Set-SomeData function.

.EXAMPLE
    Import-Module .\\MyModule.psm1

    Get-SomeData -Input C:\\input.txt | Set-SomeData -Output C:\\output.txt

    Imports the script module and runs the Get-SomeData and Set-SomeData functions with the specified input and output files.
#>

#region Variables

$ErrorActionPreference = 'Stop'

#endregion

#region Functions

function Get-SomeData {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [ValidateScript({Test-Path $_})]
        [string]$Input
    )

    begin {
        Write-Verbose "Starting the Get-SomeData function"
    }

    process {
        # Some code that gets some data from the input
        Write-Output $Data
    }

    end {
        Write-Verbose "Ending the Get-SomeData function"
    }
}

function Set-SomeData {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [ValidateScript({-not (Test-Path $_)})]
        [string]$Output,

        [Parameter(ValueFromPipeline=$true)]
        [string]$Data
    )

    begin {
        Write-Verbose "Starting the Set-SomeData function"
    }

    process {
        # Some code that sets some data to the output
        Write-Output $Result
    }

    end {
        Write-Verbose "Ending the Set-SomeData function"
    }
}

#endregion

#region Export

Export-ModuleMember -Function Get-SomeData, Set-SomeData

#endregion

```

## Script Parameters

One of the most important aspects of writing a PowerShell script is how to define and validate input parameters for your scripts. Parameters allow you to pass arguments to your scripts and control their behavior. Parameters also make your scripts more flexible and reusable by allowing different inputs and outputs.

### Parameter Attributes

To define parameters for your scripts, you need to use the param keyword followed by a list of parameter names and optional attributes. Parameter attributes are enclosed in square brackets (\[ ]) and provide additional information and validation for your parameters.

Some of the most common parameter attributes are:

- Mandatory: specifies whether the parameter is required or optional. If set to $true, the parameter must be provided when calling the script; otherwise, an error will occur. If set to $false (default), the parameter is optional and can be omitted.
- Position: specifies the position of the parameter in the argument list when calling the script without using parameter names. If set to a positive integer (starting from 0), the parameter can be specified by its position; otherwise, it must be specified by its name. If not set (default), the parameter must be specified by its name.
- ValueFromPipeline: specifies whether the parameter can accept input from the pipeline. If set to $true, the parameter can take values from objects passed through the pipeline; otherwise, it cannot. If

If not set (default), the parameter cannot take values from the pipeline.

- ValueFromPipelineByPropertyName: specifies whether the parameter can accept input from the pipeline by property name. If set to $true, the parameter can take values from properties of objects passed through the pipeline that have the same name as the parameter; otherwise, it cannot. If not set (default), the parameter cannot take values from the pipeline by property name.
- ValidateSet: specifies a set of valid values for the parameter. If set to an array of strings or numbers, the parameter can only take values from that array; otherwise, an error will occur. If not set (default), the parameter can take any value.
- ValidateScript: specifies a script block that validates the parameter value. If set to a script block, the parameter value is passed to the script block and evaluated as a boolean expression; if it returns $true, the parameter value is valid; otherwise, an error will occur. If not set (default), the parameter value is not validated by a script block.
- ValidateRange: specifies a range of valid values for the parameter. If set to two numbers or strings, the parameter value must be greater than or equal to the first number or string and less than or equal to the second number or string; otherwise, an error will occur. If not set (default), the parameter value is not validated by a range.
- ValidatePattern: specifies a regular expression pattern that matches valid values for the parameter. If set to a string, the parameter value must match the regular expression pattern; otherwise, an error will occur. If not set (default), the parameter value is not validated by a pattern.
- ValidateLength: specifies a range of valid lengths for the parameter value. If set to two integers, the parameter value must have a length greater than or equal to the first integer and less than or equal to the second integer; otherwise, an error will occur. If not set (default), the parameter value is not validated by its length.
- ValidateNotNull: specifies that the parameter value cannot be null. If set to $true, the parameter value must not be null; otherwise, an error will occur. If not set (default), the parameter value can be null.
- ValidateNotNullOrEmpty: specifies that the parameter value cannot be null or empty. If set to $true, the parameter value must not be null or empty; otherwise, an error will occur. If not set (default), the parameter value can be null or empty.
- Alias: specifies one or more aliases for the parameter name. If set to an array of strings, the parameter can be specified by any of those strings in addition to its original name; otherwise, it cannot. If not set (default), the parameter has no aliases.

Here is an example of how to use some of these attributes:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('Red', 'Green', 'Blue')]
    [string]$Color,

    [Parameter(Position=0)]
    [ValidateScript({Test-Path $_})]
    [Alias('Path', 'FilePath')]
    [string]$File,

    [Parameter(ValueFromPipeline=$true)]
    [ValidateRange(1, 10)]
    [int]$Number
)

```

### Parameter Types

In addition to parameter attributes, you can also specify the type of your parameters by using a type name before the parameter name. This can help you enforce the data type of your parameters and avoid errors or unexpected results.

PowerShell supports various types of data, such as strings, numbers, booleans, arrays, hashtables, objects, etc. You can use any of these types as your parameter types, or you can use custom types defined by classes or enums.

Here is an example of how to use parameter types:

```powershell
param(
    [string]$Name,
    [int]$Age,
    [bool]$Married,
    [string[]]$Hobbies,
    [hashtable]$Options,
    [System.IO.FileInfo]$File,
    [MyClass]$Object,
    [MyEnum]$Enum
)

```

### Parameter Sets

Sometimes, you may want to have different sets of parameters for your scripts depending on the scenario or functionality. For example, you may want to have one set of parameters for creating a file and another set of parameters for deleting a file. In this case, you can use parameter sets to group your parameters and specify which ones are valid for each set.

To use parameter sets, you need to use the ParameterSetName attribute for your parameters and assign them a name that identifies the set they belong to. You can also use the DefaultParameterSetName attribute for your script or function to specify which parameter set is used by default when no other set is specified.

Here is an example of how to use parameter sets:

```powershell
[CmdletBinding(DefaultParameterSetName='Create')]
param(
    [Parameter(ParameterSetName='Create', Mandatory=$true)]
    [Parameter(ParameterSetName='Delete', Mandatory=$true)]
    [string]$Name,

    [Parameter(ParameterSetName='Create', Mandatory=$true)]
    [string]$Content,

    [Parameter(ParameterSetName='Delete', Mandatory=$true)]
    [switch]$Force
)

switch ($PSCmdlet.ParameterSetName) {
    'Create' {
        # Some code to create a file with the specified name and content
        break
    }
    'Delete' {
        # Some code to delete a file with the specified name and force option
        break
    }
}

```

## Script Output

Another important aspect of writing a PowerShell script is how to handle and format output data from your scripts. Output data is any information that your script produces and returns to the caller or the pipeline. Output data can be useful for displaying results, logging messages, passing values to other commands, etc.

### Output Streams

PowerShell uses different output streams to handle different types of output data. Each output stream has a number and a name that identifies it. The main output streams are:

- Output stream (1): this is the default stream for normal output data, such as objects, values, strings, etc. You can write to this stream by using the Write-Output cmdlet or simply by placing a value or expression at the end of a line or a script block. You can also redirect this stream to a file or a variable by using the redirection operator (>). For example:

```powershell
Write-Output "Hello world" # writes to the output stream
"Hello world" # also writes to the output stream
"Hello world" > C:\\output.txt # redirects the output stream to a file
$Output = "Hello world" # redirects the output stream to a variable

```

- Error stream (2): this is the stream for error data, such as exceptions, errors, warnings, etc. You can write to this stream by using the Write-Error cmdlet or by throwing an exception. You can also redirect this stream to a file or a variable by using the redirection operator (2>). For example:

```powershell
Write-Error "Something went wrong" # writes to the error stream
throw "Something went wrong" # also writes to the error stream
Write-Error "Something went wrong" 2> C:\\error.txt # redirects the error stream to a file
$Error = Write-Error "Something went wrong" # redirects the error stream to a variable

```

- Warning stream (3): this is the stream for warning data, such as non-critical errors, potential issues, etc. You can write to this stream by using the Write-Warning cmdlet. You can also redirect this stream to a file or a variable by using the redirection operator (3>). For example:

```powershell
Write-Warning "This might not work" # writes to the warning stream
Write-Warning "This might not work" 3> C:\\warning.txt # redirects the warning stream to a file
$Warning = Write-Warning "This might not work" # redirects the warning stream to a variable

```

- Verbose stream (4): this is the stream for verbose data, such as informative messages, progress updates, etc. You can write to this stream by using the Write-Verbose cmdlet. You can also redirect this stream to a file or a variable by using the redirection operator (4>). However, this stream is only displayed when the -Verbose switch is used when calling the script or function. For example:

```powershell
Write-Verbose "Starting the script" # writes to the verbose stream
Write-Verbose "Starting the script" 4> C:\\verbose.txt # redirects the verbose stream to a file
$Verbose = Write-Verbose "Starting the script" # redirects the verbose stream to a variable
.\\MyScript.ps1 -Verbose # displays the verbose stream
```

- Debug stream (5): this is the stream for debug data, such as diagnostic messages, breakpoints, etc. You can write to this stream by using the Write-Debug cmdlet. You can also redirect this stream to a file or a variable by using the redirection operator (5>). However, this stream is only displayed when the -Debug switch is used when calling the script or function. For example:

```powershell
Write-Debug "Checking some condition" # writes to the debug stream
Write-Debug "Checking some condition" 5> C:\\debug.txt # redirects the debug stream to a file
$Debug = Write-Debug "Checking some condition" # redirects the debug stream to a variable
.\\MyScript.ps1 -Debug # displays the debug stream
```

### Output Formatting

PowerShell uses different output formatting options to display output data in different ways. Output formatting can affect how output data is presented on the screen or in a file, but it does not affect how output data is stored in memory or passed through the pipeline.

The main output formatting options are:

- Format-Table: this option displays output data in a table format with columns and rows. You can use this option by piping output data to the Format-Table cmdlet or by using the -Format parameter of some cmdlets. You can also specify which

You can also specify which properties to display, how to sort and group them, how to adjust the column width, etc. For example:

```powershell
Get-Process | Format-Table -Property Name, Id, CPU -AutoSize # displays output data in a table format with specified properties and auto-sized columns
Get-ChildItem -Format Table # displays output data in a table format using the -Format parameter

```

- Format-List: this option displays output data in a list format with one property per line. You can use this option by piping output data to the Format-List cmdlet or by using the -Format parameter of some cmdlets. You can also specify which properties to display, how to sort and group them, etc. For example:

```powershell
Get-Process | Format-List -Property * # displays output data in a list format with all properties
Get-ChildItem -Format List # displays output data in a list format using the -Format parameter

```

- Format-Wide: this option displays output data in a wide format with one property per line and multiple items per column. You can use this option by piping output data to the Format-Wide cmdlet or by using the -Format parameter of some cmdlets. You can also specify which property to display, how many columns to use, etc. For example:

```powershell
Get-Process | Format-Wide -Property Name -Column 4 # displays output data in a wide format with the name property and four columns
Get-ChildItem -Format Wide # displays output data in a wide format using the -Format parameter

```

- Format-Custom: this option displays output data in a custom format that you can define using XML files or script blocks. You can use this option by piping output data to the Format-Custom cmdlet or by using the -Format parameter of some cmdlets. You can also specify which XML file or script block to use, how to group and filter output data, etc. For example:

```powershell
Get-Process | Format-Custom -View MyView # displays output data in a custom format using the MyView XML file
Get-ChildItem -Format Custom # displays output data in a custom format using the default XML file

```

## Script Error Handling

Another important aspect of writing a PowerShell script is how to catch and handle errors and exceptions in your scripts. Errors and exceptions are unexpected or undesired events that occur during the execution of your scripts and may cause them to fail or behave incorrectly.

### Error Types

PowerShell distinguishes between two types of errors: terminating errors and non-terminating errors.

- Terminating errors are severe errors that stop the execution of your script or function and return control to the caller. Terminating errors are usually caused by invalid syntax, missing parameters, incorrect logic, etc. You can generate a terminating error by using the throw keyword or by setting the $ErrorActionPreference variable to 'Stop'.
- Non-terminating errors are minor errors that do not stop the execution of your script or function and continue with the next statement. Non-terminating errors are usually caused by invalid input, missing files, network issues, etc. You can generate a non-terminating error by using the Write-Error cmdlet or by setting the $ErrorActionPreference variable to 'Continue' (default).

Here is an example of how to generate different types of errors:

```powershell
$ErrorActionPreference = 'Continue' # sets the default error action preference to continue

Write-Error "This is a non-terminating error" # generates a non-terminating error

throw "This is a terminating error" # generates a terminating error

Write-Error "This is another non-terminating error" # this statement is not executed because of the previous terminating error

```

### Error Handling

PowerShell provides various ways to handle errors and exceptions in your scripts. The main error handling options are:

- Try-Catch-Finally: this option allows you to enclose a block of code that may generate errors in a try block, and then specify one or more catch blocks that handle different types of errors, and optionally a finally block that executes regardless of whether an error occurs or not. You can use this option by using the try, catch, and finally keywords. For example:

```powershell
try {
    # Some code that may generate errors
}
catch [System.IO.FileNotFoundException] {
    # Some code that handles file not found errors
}
catch [System.DivideByZeroException] {
    # Some code that handles divide by zero errors
}
catch {
    # Some code that handles any other errors
}
finally {
    # Some code that executes in any case
}

```

- Trap: this option allows you to specify a block of code that handles any errors that occur within a script or function. You can use this option by using the trap keyword followed by a script block. For example:

```powershell
trap {
    # Some code that handles any errors
}

# Some code that may generate errors

```

- Error Variable: this option allows you to store the error information in a variable for further analysis or processing. You can use this option by using the -ErrorVariable parameter of some cmdlets or by accessing the $Error automatic variable. For example:

```powershell
Get-Content -Path C:\\input.txt -ErrorVariable MyError # stores the error information in the MyError variable

$Error[0] # accesses the most recent error information from the $Error variable

```

- Error Action: this option allows you to control how PowerShell responds to non-terminating errors. You can use this option by using the -ErrorAction parameter of some cmdlets or by setting the $ErrorActionPreference variable. The possible values for this option are:
  - Continue: the default value, which displays the error message and continues with the next statement.
  - Stop: which converts the non-terminating error into a terminating error and stops the execution of the script or function.
  - SilentlyContinue: which suppresses the error message and continues with the next statement.
  - Inquire: which displays the error message and prompts the user to choose whether to continue or stop.
  - Ignore: which ignores the error and does not display any message or store any information.

For example:

```powershell
Get-Content -Path C:\\input.txt -ErrorAction Stop # converts the non-terminating error into a terminating error

$ErrorActionPreference = 'SilentlyContinue' # sets the default error action preference to silently continue

Get-Content -Path C:\\input.txt # suppresses the error message
```

## Script Testing

Another important aspect of writing a PowerShell script is how to write and run unit tests for your scripts. Unit tests are small pieces of code that verify the functionality and behavior of your scripts under different conditions and inputs. Unit tests can help you ensure the quality and reliability of your scripts and detect any bugs or errors before they cause problems.

### Pester

PowerShell provides a built-in testing framework called Pester that allows you to write and run unit tests for your scripts. Pester is based on a simple syntax that uses keywords such as Describe, Context, It, Should, etc. to define test cases and assertions.

To use Pester, you need to import the Pester module by using the Import-Module cmdlet or by installing it from the PowerShell Gallery. You also need to write your test scripts in files with the .Tests.ps1 extension and place them in the same folder as your script files.

Here is an example of how to write and run a simple test script using Pester:

```powershell
# This is MyScript.ps1

function Add-Numbers {
    param(
        [int]$a,
        [int]$b
    )

    return $a + $b
}

```

```powershell
# This is MyScript.Tests.ps1

Import-Module Pester

Describe "Add-Numbers" {

    Context "When both parameters are positive" {

        It "Should return their sum" {

            $Result = Add-Numbers -a 2 -b 3

            $Result | Should -Be 5
        }
    }

    Context "When one parameter is negative" {

        It "Should return their difference" {

            $Result = Add-Numbers -a -2 -b 3

            $Result | Should -Be 1
			    }
			}

Context "When both parameters are zero" {

    It "Should return zero" {

        $Result = Add-Numbers -a 0 -b 0

        $Result | Should -Be 0
			}
		}
}
```

## To run the test script, use the Invoke-Pester cmdlet

```powershell
Invoke-Pester -Script .\MyScript.Tests.ps1
```

## Folder structure for a big PowerShell project

- Use a root folder to contain all your script files and modules related to the project. You can name this folder after your project name or use a generic name like PowerShell.
- Use a subfolder to store your script modules. You can name this folder Modules or something similar. A script module is a file with the .psm1 extension that contains PowerShell code that can be imported and reused by other scripts or modules.
- Use another subfolder to store your script files. You can name this folder Scripts or something similar. A script file is a file with the .ps1 extension that contains PowerShell code that can be run directly or invoked by other scripts or modules.
- Use additional subfolders to organize your script files and modules by functionality, purpose, or category. For example, you can have subfolders for public and private functions, classes, tests, resources, documentation, etc.
- Use descriptive and consistent names for your folders, files, and modules that reflect their content and functionality. Avoid using spaces or special characters in your names and use PascalCase or camelCase conventions.
- Use the #Requires statement at the beginning of your script files and modules to specify the minimum version of PowerShell or any modules or snap-ins that they depend on.
- Use comment-based help to document your script files and modules with a synopsis, description, parameters, examples, etc.
- Use regions to group related code blocks within your script files and modules.
- Use indentation and whitespace to make your code more readable.

Here is an example of a possible folder structure for a big PowerShell script project:

```
PowerShell
├── Modules
│   ├── MyModule1.psm1
│   ├── MyModule2.psm1
│   └── MyModule3.psm1
├── Scripts
│   ├── Public
│   │   ├── Get-Something.ps1
│   │   ├── Set-Something.ps1
│   │   └── Remove-Something.ps1
│   ├── Private
│   │   ├── Invoke-Something.ps1
│   │   ├── Test-Something.ps1
│   │   └── Write-Something.ps1
│   └── Main.ps1
├── Tests
│   ├── MyModule1.Tests.ps1
│   ├── MyModule2.Tests.ps1
│   └── MyModule3.Tests.ps1
├── Resources
│   ├── Images
│   │   ├── Image1.png
│   │   ├── Image2.png
│   │   └── Image3.png
│   └── Data
│       ├── Data1.csv
│       ├── Data2.csv
│       └── Data3.csv
└── Documentation
    ├── Readme.md
    ├── License.md
    └── Pages
        ├── Page1.md
        ├── Page2.md
        └── Page3.md

```

## Conclusion

In this blog post, I have shared some tips and guidelines on how to write better PowerShell scripts, focusing on the following aspects:

- Script architecture: how to structure your script files and modules
- Script parameters: how to define and validate input parameters for your scripts
- Script output: how to handle and format output data from your scripts
- Script error handling: how to catch and handle errors and exceptions in your scripts
- Script testing: how to write and run unit tests for your scripts
- How to structure a big PowerShell project folders
