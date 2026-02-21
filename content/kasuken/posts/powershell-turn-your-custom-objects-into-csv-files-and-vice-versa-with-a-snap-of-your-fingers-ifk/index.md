---
{
title: "PowerShell: Turn Your Custom Objects into CSV Files (and vice versa) with a Snap of Your Fingers",
published: "2023-08-25T12:01:00Z",
edited: "2023-08-27T08:14:45Z",
tags: ["powershell", "programming", "terminal", "csv"],
description: "PowerShell is a powerful scripting language that can manipulate various types of data, such as...",
originalLink: "https://https://dev.to/playfulprogramming/powershell-turn-your-custom-objects-into-csv-files-and-vice-versa-with-a-snap-of-your-fingers-ifk",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

PowerShell is a powerful scripting language that can manipulate various types of data, such as arrays, objects, and CSV files. In this blog post, I will show you how to export and import a custom object array to a CSV file with PowerShell, using different code examples and exploring all the parameters during the exporting phase.

## What is a Custom Object Array?

A custom object array is an array that contains one or more custom objects. A custom object is an object that has properties and values that you define. For example, you can create a custom object that represents a person, with properties such as name, age, and occupation.

You can create a custom object array in PowerShell by using the **`New-Object`** cmdlet, the **`[PSCustomObject]`** type accelerator, or the **`Select-Object`** cmdlet. Here are some examples:

```powershell
# Using New-Object
$person1 = New-Object -TypeName PSObject -Property @{
    Name = "Alice"
    Age = 25
    Occupation = "Engineer"
}

$person2 = New-Object -TypeName PSObject -Property @{
    Name = "Bob"
    Age = 30
    Occupation = "Teacher"
}

$person3 = New-Object -TypeName PSObject -Property @{
    Name = "John"
    Age = 32
    Occupation = "Developer"
}

# Create an array of custom objects
$people = $person1, $person2, $person3

# Using [PSCustomObject]
$person1 = [PSCustomObject]@{
    Name = "Alice"
    Age = 25
    Occupation = "Engineer"
}

$person2 = [PSCustomObject]@{
    Name = "Bob"
    Age = 30
    Occupation = "Teacher"
}

$person3 = [PSCustomObject]@{
    Name = "John"
    Age = 32
    Occupation = "Developer"
}

# Create an array of custom objects
$people = $person1, $person2, $person3

# Using Select-Object
# Assume that you have a CSV file named people.csv with the following content:

# Name,Age,Occupation
# Alice,25,Engineer
# Bob,30,Teacher
# John,32,Developer

# Import the CSV file and create an array of custom objects
$people = Import-Csv -Path people.csv | Select-Object Name, Age, Occupation
```

## How to Export a Custom Object Array to CSV?

To export a custom object array to a CSV file, you can use the **`Export-Csv`** cmdlet. This cmdlet converts the custom object array into a comma-separated values (CSV) file and saves it in the specified path. The CSV file can then be opened by any application that supports CSV format, such as Excel or Notepad.

The basic syntax of the **`Export-Csv`** cmdlet is:

```powershell
Export-Csv -InputObject <object> -Path <string> [-Parameter <value>]
```

The **`-InputObject`** parameter specifies the custom object array that you want to export. The **`-Path`** parameter specifies the full or relative path of the CSV file that you want to create or overwrite.

Here are some examples of using the **`Export-Csv`** cmdlet:

```powershell
# Export the $people array to a CSV file named people.csv in the current directory
$people | Export-Csv -Path people.csv

# Export the $people array to a CSV file named people.csv in the C:\temp directory
$people | Export-Csv -Path C:\temp\people.csv

# Export the $people array to a CSV file named people.csv in the current directory, without writing the type information header
$people | Export-Csv -Path people.csv -NoTypeInformation

# Export the $people array to a CSV file named people.csv in the current directory, using a semicolon (;) as the delimiter instead of a comma (,)
$people | Export-Csv -Path people.csv -Delimiter ";"

# Export the $people array to a CSV file named people.csv in the current directory, using UTF-8 encoding instead of ASCII encoding
$people | Export-Csv -Path people.csv -Encoding UTF8

# Export only the Name and Occupation properties of the $people array to a CSV file named people.csv in the current directory
$people | Select-Object Name, Occupation | Export-Csv -Path people.csv
```

## Conclusion

In this blog post, I have shown you how to export and import a custom object array to a CSV file with PowerShell, using different code examples and exploring all the parameters during the exporting phase. I hope you have learned something useful and enjoyed reading this post.
