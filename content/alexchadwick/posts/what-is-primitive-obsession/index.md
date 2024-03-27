---
{
	title: "What is Primitive obsession and how to fix it",
	description: "Primitive obsession is an extremely common code smell, and when identified and fix, it greatly helps to reduce the amount of bugs that you may find in your code.",
	published: '2022-07-19T14:52:03.000Z',
	tags: ['opinion', 'csharp', 'computer science'],
	license: 'cc-by-nc-sa-4',
	originalLink: 'https://alexchadwick.com/what-is-primitive-obsession-and-how-do-you-fix-it'
}
---

Primitive obsession is an extremely common code smell, and when identified and fix, it greatly helps to reduce the amount of bugs that you may find in your code. This code smell is one that most developers can't intuitively identify.

# What are primitive types?
In order to know what primitive obsession is about, it's useful to firstly define primitive types. Primitive types are essentially the **basic building blocks** of a language. These are integers, strings, chars, floating-point numbers etc.

# What is Primitive obsession?
Primitive obsession is when your codebase relies on primitive types more than it should, and this results in them being able to control the logic of your application to some extent.

For example, you may have the following in C#:


```cs
class User {
  public int Id { get; set; }
  public string Name { get; set; }
}
```

And this may look like a perfectly good type. However it is flawed in various ways. For example, we're not able to easily enforce any sort of constraints.

Here we've got an `Id` that is an integer. But an ID is unlikely to be for example a negative number. However number can hold negative values, so it's not really fully representing our ID.

However let's have a look at the following example:

# How to fix Primitive Obsession

```cs
class Id {
  public int Value { get; set; }
  public Id(int value) {
    if (value < 0) throw new ArgumentException("An ID cannot be negative");

    Value = value;
  }
}

class User {
  public Id UserId { get; set; }
  public string Name { get; set; }
}
```

Now we know for certain that `UserId` will never be an invalid value. Never in our code will we have to check whether it's a negative number.

This is a very simplified example, so it may look a bit weird, but it's enough to show off the gist of what Primitive Obsession is.

Another example could be for example a password field.

```cs
class Credentials {
  public string Password { get; set; }
} 
```

If this was an actual class, then it could pose many problems. For starters, it's difficult to know whether a `Password` will pass all validation checks, and so we'll need to perform an operation every time we need this information. However what would happen if we made a custom type that ensures that the value will be validated?

```cs
class ValidPassword {
  public string Value { get; }

  public ValidPassword(string password) {
    if (!isValidPassword(password)) throw new ArgumentException("The password did not pass validation");

    Value = password;
  }

  public void ChangePassword(string newPassword) {
    if(!isValidPassword(password)) throw new ArgumentException("The new password did not pass validation");

    Value = newPassword;
  }

  private static bool isValidPassword(string password) {
    /* ... Code to make sure a password follows a certain set of rules ... */
  }
}

class User {
  public ValidPassword Password { get; set; }
}
```

Now we know for absolute certain that the `Password` of a `User` is always going to be valid. In fact we can also use the `ChangePassword` function to make sure that any new values are also valid. It will always be valid.

You could even go a step further and make it immutable, but I'll leave that for another time!

# Conclusion
Primitive Obsession is one of the least identified code smells, and for some reason isn't as popular as others.

A good way I've found to identify primitive obsession is to see if you often find yourself checking if a variable satisfies a set of rules. If that's the case then you're better of making a custom type for it, with a constructor that is able to validate the input of the value you're trying to assign to it.

I hope you've enjoyed the article. If so, I'd appreciate it if you shared and left feedback!
