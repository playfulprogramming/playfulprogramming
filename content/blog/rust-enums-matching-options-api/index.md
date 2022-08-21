---
{
    title: "Rust Enums, Matching, & Options API",
    description: "Rust allows you to build super-fast and flexible applications. Let's build one leveraging enums, pattern matching, and the Options API.",
    published: '2021-04-16T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['rust'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/rust-enums-matching-options-api/'
}
---

If you’ve been active in the programming community within the past few years, you’ve undoubtedly heard of [Rust](https://www.rust-lang.org/). Its technical foundation and vibrant community have proven themselves to be a good benchmark for quick language growth.

But what does Rust do that has garnered such a positive response from the community? Not only does Rust provide a great deal of memory safety (something that’s rare in low-level languages in the past), but also includes powerful features that make development much nicer.

One of the many features that highlights Rust’s capabilities is its handling of enums and matching.

# Enums

Like many languages with strict typings, Rust [has an enum feature](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html). To declare an enum is simple enough, start with `pub enum` and name the values.

```rust
pub enum CodeLang {
    Rust,
    JavaScript,
    Swift,
    Kotlin,
    // ...
}
```

To create a variable with the type of that enum, you can use the name of the enum with the value:

```rust
fn main() {
   let lang = CodeLang::Rust;
}
```

Likewise, you can use the `enum` as a type in places like function params. Let’s say that you want to detect which version of a programming language supported in CoderPad. We’ll start by hard-coding the version of Rust:

```rust
fn get_version(_lang: CodeLang) -> &'static str {
   return "1.46";
}
```

While this code _works_, it’s not very functional. If you pass in “CodeLang::JavaScript”, the version number isn’t correct. Let’s take a look at how we can fix that in the next section.

# Matching

While you _could_ use `if` statements to detect which enum is passed in, like so:

```rust
fn get_version(lang: CodeLang) -> &'static str {
    if let CodeLang::Rust = lang {
        return "1.46";
    }
    
    if let CodeLang::JavaScript = lang {
        return "2021";
    }
    
    return ""
}

fn main() {
    let lang = CodeLang::Rust;

    let ver = get_version(lang);

    println!("Version {}", ver);
}
```

This easily becomes unwieldy when dealing with more than one or two values in the enum. This is where Rust’s `match` operator comes into play. Let’s match the variable with all of the existing values in the enum:

```rust
fn get_version(lang: CodeLang) -> &'static str {
   match lang {
       CodeLang::Rust => "1.46",
       CodeLang::JavaScript => "2021",
       CodeLang::Swift => "5.3",
       CodeLang::Python => "3.8"
   }
}
```

If you’re familiar with a programming language that has a feature similar to “[switch/case](https://www.tutorialspoint.com/cprogramming/switch_statement_in_c.htm)”, this example is a close approximation of that functionality. However, as you’ll soon see, `match` in Rust is significantly more powerful than most implementations of switch/case.

# Pattern Matching

While most implementations of `switch/case` only allow simple primitives matching, such as strings or numbers, Rust’s `match` allows you to have more granular control over what is matched and how. For example, you can match anything that isn’t matched otherwise using the `_` identifier:

```rust
fn get_version(lang: CodeLang) -> &'static str {
   match lang {
       CodeLang::Rust => "1.46",
       _ => "Unknown version"
   }
}
```

You are also able to match more than a single value at a time. In this example, we’re doing a check on versions for more than one programming language at a time.

```rust
fn get_version<'a>(lang: CodeLang, other_lang: CodeLang) -> (&'a str, &'a str) {
   match (lang, other_lang) {
       (CodeLang::Rust, CodeLang::Python) => ("1.46", "3.8"),
       _ => ("Unknown", "Unknown")
   }
}
```

This shows some of the power of `match` . However, there’s more that you’re able to do with enums.

# Value Storage

Not only are enums values within themselves, but you can also store values within enums to be accessed later.

For example, CoderPad supports two different versions of Python. However, instead of creating a `CodeLang::Python` and `CoderLang::Python2` enum values, we can use one value and store the major version within.

```rust
pub enum CodeLang {
   Rust,
   JavaScript,
   Swift,
   Python(u8),
   // ...
}

fn main() {
   let python2 = CodeLang::Python(2);

   let pythonVer = get_version(python2);
}
```

We’re able to expand our `if let` expression from before to access the value within:

```rust
if let CodeLang::Python(ver) = python2 {
    println!("Python version is {}", ver);
}
```

However, just as before, we’re able to leverage `match` to unpack the value within the enum:

```rust
fn get_version(lang: CodeLang) -> &'static str {
   match lang {
       CodeLang::Rust => "1.46",
       CodeLang::JavaScript => "2021",
       CodeLang::Python(ver) => {
           if ver == 3 { "3.8" } else { "2.7" }
       },
        _ => "Unknown"
   }
}
```

Not all enums need to be manually set, however! Rust has some enums built-in to the language, ready for use.

# Option Enum

While we’re currently returning the string `”Unknown”` as a version, that’s not ideal. Namely, we’d have to do a string comparison to check if we’re returning a known version or not, rather than having a value dedicated to a lack of value.

This is where Rust’s `Option` enum comes into play. `Option<T>` describes a data type that either has `Some(data)` or `None` to speak of.

For example, we can rewrite the above function to:

```rust
fn get_version<'a>(lang: CodeLang) -> Option<&'a str> {
   match lang {
       CodeLang::Rust => Some("1.46"),
       CodeLang::JavaScript => Some("2021"),
       CodeLang::Python(ver) => {
           if ver == 3 { Some("3.8") } else { Some("2.7") }
       },
        _ => None
   }
}
```

By doing this, we can make our logic more representative and check if a value is `None`

```rust
fn main() {
    let swift_version = get_version(CodeLang::Swift);

    if let None = swift_version {
        println!("We could not find a valid version of your tool");
        return;
    }
}
```

Finally, we can of course use `match` to migrate from an `if` to check when values are set:

```rust
fn main() {
    let code_version = get_version(CodeLang::Rust);

    match code_version {
        Some(val) => {
            println!("Your version is {}", val);
        },
        None => {
            println!("We could not find a valid version of your tool");
            return;
        }
    }
}
```

# Operators

While the above code functions as intended, if we add more conditional logic, we may find ourselves wanting to make abstractions. Let’s look at some of these abstractions Rust provides for us

## Map Operator

What if we wanted to convert `rust_version` to a string, but wanted to handle edge-cases where `None` was present.

You might write something like this:

```rust
fn main() {
    let rust_version = get_version(CodeLang::Rust);

    let version_str = match rust_version {
        Some(val) => {
            Some(format!("Your version is {}", val))
        },
        None => None
    };
    
    if let Some(val) = version_str {
        println!("{}", val);
        return;
    }
}
```

This `match` of taking `Some` and mapping it to a new value and leaving `None` s to resolve as `None` still is baked into the Option enum as a method called `.map` :

```rust
fn main() {
    let rust_version = get_version(CodeLang::Rust);

    let version_str = rust_version.map(|val| {
      format!("Your version is {}", val)
    });
    
    if let Some(val) = version_str {
        println!("{}", val);
        return;
    }
}
```

How close is the implementation of `.map` to what we were doing before? Let’s take a look at [Rust’s source code implementation of `.map` ](https://github.com/rust-lang/rust/blob/8dc0ae24bcafeb52259ae20fcad29185acf31fcc/library/core/src/option.rs#L485-L490):

```rust
pub fn map<U, F: FnOnce(T) -> U>(self, f: F) -> Option<U> {
   match self {
       Some(x) => Some(f(x)),
       None => None,
   }
}
```

As you can see, we matched our implementation very similarly, matching `Some` to another `Some` and `None` to another `None`

## And Then Operator

While the automatic wrapping of the `.map` function return value into a `Some` can be useful in most instances, there may be times where you want to conditionally make something inside the `map`

Let’s say that we only want version numbers that contain a dot (indicating there’s a minor version). We could do something like this:

```rust
fn main() {
    let rust_version = get_version(CodeLang::JavaScript);

    let version_str = match rust_version {
        Some(val) => {
            if val.contains(".") {
                Some(format!("Your version is {}", val))
            } else {
                None
            }
        },
        None => None
    };
    
    if let Some(val) = version_str {
        println!("{}", val);
        return;
    }
}
```

Which we can rewrite using Rust’s `and_then` operator:

```rust
fn main() {
    let rust_version = get_version(CodeLang::JavaScript);

    let version_str = rust_version.and_then(|val| {
        if val.contains(".") {
            Some(format!("Your version is {}", val))
        } else {
            None
        }
    });
    
    if let Some(val) = version_str {
        println!("{}", val);
        return;
    }
}
```

If we look at [Rust’s source code for the operator](https://github.com/rust-lang/rust/blob/8dc0ae24bcafeb52259ae20fcad29185acf31fcc/library/core/src/option.rs#L722-L727), we can see the similarity to the `.map` implementation, simply without wrapping `fn` in `Some` :

```rust
pub fn and_then<U, F: FnOnce(T) -> Option<U>>(self, f: F) -> Option<U> {
        match self {
            Some(x) => f(x),
            None => None,
        }
    }
```

# Putting it Together

Now that we’re familiar with the Option enum, operators, and pattern matching let’s put it all together!

Let’s start with the same `get_version` function baseline we’ve been using for a few examples:

```rust
use regex::Regex;

pub enum CodeLang {
   Rust,
   JavaScript,
   Swift,
   Python(u8),
   // ...
}

fn get_version<'a>(lang: CodeLang) -> Option<&'a str> {
   match lang {
       CodeLang::Rust => Some("1.46"),
       CodeLang::JavaScript => Some("2021"),
       CodeLang::Python(ver) => {
           if ver == 3 { Some("3.8") } else { Some("2.7") }
       },
        _ => None
   }
}

fn main() {
    let lang = CodeLang::JavaScript;

    let lang_version = get_version(lang);
}
```

Given this baseline, let’s build a semver checker. Given a coding language, tell us what the major and minor versions of that language are.

For example, Rust (1.46) would return “**Major: 1. Minor: 46**”, while JavaScript (2021) would return **“Major: 2021. Minor: 0**”

We’ll do this check using a Regex that parses any dots in the version string.

```
(\d+)(?:\.(\d+))?
```

This regex will match the first capture group as anything before the first period, then optionally provide a second capture if there is a period, matching anything after that period. Let’s add that Regex and the captures in our `main` function:

```rust
let version_regex = Regex::new(r"(\d+)(?:\.(\d+))?").unwrap();

let version_matches = lang_version.and_then(|version_str| {
    return version_regex.captures(version_str);
});
```

In the code sample above, we’re using `and_then` in order to flatten `captures` into a single-layer `Option` enum - seeing as `lang_version` is an Option itself and `captures` returns an Option as well.

While `.captures` sounds like it should return an array of the capture strings, in reality it returns [a structure with various methods and properties](https://docs.rs/regex/1.1.9/regex/struct.Captures.html). To get the strings for each of these values, we’ll use `version_matches.map` to get both of these capture group strings:

```rust
let major_minor_captures = version_matches
        .map(|caps| {
            (
                caps.get(1).map(|m| m.as_str()),
                caps.get(2).map(|m| m.as_str()),
            )
        });
```

While we’d expect capture group 1 to always provide a value (given our input), we’d see “None” returned in capture group 2 if there’s no period (like with JavaScript’s version number of “2021”). Because of this, there are instances where `caps.get(2)` may be `None` . As such, we want to make sure to get a `0` in the place of `None` and convert the `Some<&str>, Option<&str>` into `Some<&str, &str>` . To do this, we’ll use `and_then` and a `match` :

```rust
let major_minor = major_minor_captures
    .and_then(|(first_opt, second_opt)| {
        match (first_opt, second_opt) {
            (Some(major), Some(minor)) => Some((major, minor)),
            (Some(major), None) => Some((major, "0")),
            _ => None,
        }
    });
```

Finally, we can use an `if let` to deconstruct the values and print the major and minor versions:

```rust
if let Some((first, second)) = major_minor {
    println!("Major: {}. Minor: {}", first, second);
}
```

The final version of the project should look something like this:

```rust
use regex::Regex;

pub enum CodeLang {
   Rust,
   JavaScript,
   Swift,
   Python(u8),
   // ...
}

fn get_version<'a>(lang: CodeLang) -> Option<&'a str> {
   match lang {
       CodeLang::Rust => Some("1.46"),
       CodeLang::JavaScript => Some("2021"),
       CodeLang::Python(ver) => {
           if ver == 3 { Some("3.8") } else { Some("2.7") }
       },
        _ => None
   }
}

fn main() {
    let lang = CodeLang::JavaScript;

    let lang_version = get_version(lang);

    let version_regex = Regex::new(r"(\d+)(?:\.(\d+))?").unwrap();

    let version_matches = lang_version.and_then(|version_str| {
        return version_regex.captures(version_str);
    });
    
    let major_minor_captures = version_matches
        .map(|caps| {
            (
                caps.get(1).map(|m| m.as_str()),
                caps.get(2).map(|m| m.as_str()),
            )
        });


    let major_minor = major_minor_captures
        .and_then(|(first_opt, second_opt)| {
            match (first_opt, second_opt) {
                (Some(major), Some(minor)) => Some((major, minor)),
                (Some(major), None) => Some((major, "0")),
                _ => None,
            }
        });


    if let Some((first, second)) = major_minor {
        println!("Major: {}. Minor: {}", first, second);
    }
}
```

# Conclusion & Challenge

All of these features are used regularly in Rust applications: enums, matching, option operators. We hope that you can take these features and utilize them in your applications along your journey to learn Rust.

Let’s close with a challenge. If you get stuck anywhere along the way or have comments/questions about this article, you can join our[ public chat community where we talk about general coding topics as well as interviewing](http://bit.ly/coderpad-slack).

Let’s say that we have the “patch” version of a software tracked. We want to expand the logic of our code to support checking “5.1.2” and return “2” as the “patch” version. Given the modified regex to support three optional capture groups:

```
(\d+)(?:\.(\d+))?(?:\.(\d+))?
```

How can you modify the code below to support the match version being listed out properly?

<iframe src="https://app.coderpad.io/sandbox?question_id=175664" loading="lazy"></iframe>

You’ll know the code is working when you’re able to output the following:

```
Major: 2021. Minor: 0, Patch: 0
Major: 1. Minor: 46, Patch: 0
Major: 5. Minor: 1, Patch: 2
```
