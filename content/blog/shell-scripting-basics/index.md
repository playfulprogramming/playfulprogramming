---
{
    title: "Getting Started With Shell Scripts: The Basics",
    description: 'An introduction to the amazing possibilities offered by shell scripting.',
    published: '2019-09-26T05:12:03.284Z',
    authors: ['adueppen', 'fennifith'],
    tags: ['shell', 'linux'],
    attached: [],
    license: 'cc-by-4'
}
---

# Intro {#intro}

Since the days of the first digital computers, interacting with them has been a rather fundamental aspect. Even though
we've advanced far past the humble days of [thousands of switches](https://en.wikipedia.org/wiki/ENIAC#Programming), 
[massive control panels](https://commons.wikimedia.org/wiki/File:Control_Panel_for_UNIVAC_1232_Computer.jpg), and 
[hundreds of punchcards](https://commons.wikimedia.org/wiki/File:Punched_card_program_deck.agr.jpg) into an era of
smooth, sleek graphical user interfaces (GUIs), the venerable command line interface (CLI) still remains quite useful.

On Unix and Unix-like OSs, such as Linux and macOS, a program known as a shell is responsible for providing the CLI. The
most common one today is [`bash`](https://www.gnu.org/software/bash/), and it can be found on the majority of Unix-like
systems. It supports a shell scripting language dating back to the 
[Thompson shell](https://en.wikipedia.org/wiki/Thompson_shell) from 1971, although much of the scripting functionality
available in modern shells comes from the [Bourne shell](https://en.wikipedia.org/wiki/Bourne_shell).

Compared to many other scripting languages, shell scripting is a bit odd because all of the keywords found in it (such
as `for`, `if`, `while`, etc) are actually commands built into the shell, and not special keywords being interpreted
separately from the other commands in the script. This means that it's possible to use these commands anywhere, even
outside of a script. For years, I didn't even know that common commands like `echo` were actually being run directly in
the shell and not with a separate program!

Before we start, I'd like to say that this post is geared more towards people who already have some prior programming
experience, and some existing Linux/Unix command-line experience helps as well.

## Setup {#intro-setup}

In order to follow this post, you'll want to make sure that you have access to a Linux shell of some sort. Thankfully,
this is easier than ever to find nowadays. Everything should work the same whether it's running in a Linux VM, macOS, 
[WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10), [Termux](https://termux.com/), or
[Crostini](https://www.reddit.com/r/Crostini/wiki/getstarted/crostini-setup-guide). All of these include `bash` by 
default, but to make sure, run the command `which bash`. This will print out the location of `bash` on your system,
and as long as the message gives some sort of location, such as `/bin/bash`, you should be fine.

Although not strictly necessary, you'll probably want to make sure you have a text editor with support for shell script
syntax highlighting installed. [`nano`](https://www.nano-editor.org/) or [`micro`](https://micro-editor.github.io/) are
good options on the command-line, especially if you're new to CLI text editors. With that out of the way, let's get to
the actual shell scripting part of this post!

# Basic Scripting {#basic-scripting}
---

## A Simple Example {#basic-example}

Let's start out with a simple example: create a file somewhere on your computer called `simple.sh` and start editing it.
In most CLI text editors, you can combine both steps into one by running `{editor} simple.sh`. All you need to put into
the file is `pwd`. This is a standard Linux/Unix command that prints out the directory you're currently in. If you save
and exit your editor and then run `bash simple.sh`, it should print out your current directory. In my case, it looks 
like this:

```
$ bash pwd.sh
/home/adueppen/scripts
```

Congratulations! You've just written your first shell script! Sure, it just does the same thing that running `pwd` in
the terminal normally would do, but the real power of shell scripting comes in when using these standard commands along
with the scripting features in order to add things like interactivity, loops, and conditions. Now, let's move on to some
of those more advanced features.

## Conditions With the `if` Command {#basic-if-usage}

Conditional execution is one of the most important parts of any programming language. If you couldn't choose whether or
not to execute something, things would be ...difficult, to say the least. Thankfully, shells includes `if` as a built-in
command. Note that this is _technically_ different from a typical programming language's `if` statement, and that's why
I've been referring to it as the "`if` command". In practice, however, it functions basically the same way. A common way
that conditions are used in shell scripts is to check if a particular program is installed before running it. Here's a
simple way in which it can be used:

```shell
if command -v cowsay > /dev/null; then
  echo "Hello, world!" | cowsay
fi
```

Here, an `if` statement is used with the built-in `command` command in order to check if the command `cowsay` is 
installed. It's generally not installed by default (even if it perhaps should be), so we can't assume that it's going to
be there. The `> /dev/null` part is used to throw away the output of `command` since we don't actually need to know
where `cowsay` is, just that it exists. If it's there, we use `echo`, which prints out any input given to it, and then
pipe (`|`) its output ("Hello, world!") to `cowsay`. Although the use of redirection (`>`) and piping might seem a bit
confusing now, I'll get into them more later. Right now, if you run this script, it'll either print out ASCII art of a
cow saying "Hello, world!", or ...nothing. That's not exactly ideal, so let's add an alternative path for when `cowsay`
isn't available:

```shell
if command -v cowsay > /dev/null; then
  echo "Hello, world!" | cowsay
else
  echo "Hello, world! (PS: install cowsay for more fun!)"
fi
```

Now our script prints out "Hello, world!" even if `cowsay` isn't installed. This is certainly better, but what if you
don't always want to use `cowsay` to print it out? Two more programs available for printing out text in fun ways are 
`figlet` and `toilet`, so let's make it so that the script will randomly use either `cowsay`, `figlet`, or `toilet`. 
This time we'll want to use a variable to store the random number we generate. Conveniently, variables in shell 
scripting are very easy to use. Declaring them doesn't require any special syntax at all, just a value of some sort for
the variable. However, when referring to the variable, it has to be prefixed with a dollar sign in order to indicate
that it's not a command to be run.

```shell
rand=$((RANDOM%3))

if [[ $rand == 0 ]] ; then
  if command -v cowsay > /dev/null; then
    echo "Hello, world!" | cowsay
  else
    echo "cowsay is not installed :("
  fi
elif [[ $rand == 1 ]] ; then
  if command -v figlet > /dev/null; then
    echo "Hello, world!" | figlet
  else
    echo "figlet is not installed :("
  fi
else
  if command -v toilet > /dev/null; then
    echo "Hello, world!" | toilet -t
  else
    echo "toilet is not installed :("
  fi
fi
```

This time the script uses `$RANDOM`, which is a "variable" that `bash` includes as a built-in. Although it looks like a
variable, it's actually a function instead (more on that later). It generates a random integer from 0-32767, which isn't
quite what we're looking for. Thankfully, we can use the modulo operator (`%`) to force the value down to either 0, 1, 
or 2. You've probably noticed by now a few new things in the `if` statements. In this case, we use double brackets to 
indicate that we're performing a test, which in this case is the equality of 2 strings of text. We're also now using the
`elif` command (short for else-if) so that we can check for more than just a single condition. Finally, the `-t` option
for `toilet` is just a way to make sure the text won't wrap too early if your terminal window is wide. Anyway, it's nice
that our script has a number of possibilities now, but wouldn't it be nice if it was possible for us to choose the way
to print the text ourselves?

##Interactivity and input {#basic-user-input}

We can use the built-in command `read` in order to prompt the user to type something in. This gives us another chance to
use variables, this time to store both the user's input as well as the text "Hello, world!" so we don't have to keep 
writing it out manually. Conveniently, the read command has a handy second argument we can use to store the response in
a variable.

```shell
echo "1: Print with cowsay"
echo "2: Print with figlet"
echo "3: Print with toilet"
echo "4: Print with echo"
echo "Anything else: Exit"

read -p "Enter a number: " input
hello="Hello, world!"

if [[ $input == "1" ]] ; then
  if command -v cowsay > /dev/null; then
    echo $hello | cowsay
  else
    echo "cowsay is not installed :("
  fi
elif [[ $input == "2" ]] ; then
  if command -v figlet > /dev/null; then
    echo $hello | figlet
  else
    echo "figlet is not installed :("
  fi
elif [[ $input == "3" ]] ; then
  if command -v toilet > /dev/null; then
    echo $hello | toilet -t
  else
    echo "toilet is not installed :("
  fi
elif [[ $input == "4" ]] ; then
  echo $hello
else
  exit
fi
```

This time, we start with telling the user which options are available to them (always a good idea), and then ask them to
enter something. We store this input in a variable called `input`. After that, we check what the user actually entered.
After that we once again check to see whether `cowsay`, `figlet`, or `toilet` is installed, depending on what the user
chose, and tell them if they don't have it.  We don't need to check if `echo` is installed since it's a built-in `bash`
command. Lastly, we have an `exit` command in the `else` block to make sure the script exits if the user puts in 
anything beyond the 3 options. In this case it's actually not necessary since the script would already finish and exit
automatically, although it's a good idea to include it in case you decide to add more functionality later.

##Positional Arguments {#arguments}

(find a way to integrate this with the script?)

| Variable        | Type   | Description                               |
|-----------------|--------|-------------------------------------------|
| `$0`, `$1`, ... | String | Argument at a specific position.          |
| `$#`            | Int    | The total number of arguments.            |
| `$@`            | Array  | All of the arguments passed.              |
| `$*`            | String | All arguments passed, as a single string. |

Every bash command returns an exit code which can be used to determine a measure of success or state of a script. In
this example, we check the exit code of `command -v toilet` to determine whether `toilet` is installed. Generally, an
exit code of zero implies success, and anything else represents some form of error. There are a few standards for using
different error codes for specific purposes, but in this situation we only need to know if it equals zero.

There are a few different ways to use these exit codes in a script. After a command is executed, the `$?` variable is
set to its exit code, which can be used to reference it in later comparisons. Another interesting use is in fail-fast
programming; beginning a script with `set -e` will tell bash to exit the script immediately if any command returns a
non-zero exit code.

## Functions {#basic-functions}

In order to write more abstract functionality that can be reused in a script, portions of functionality can be separated
into a function. Functions within a script are given the same scope as the rest of the script, but are created with
their own positional arguments and can return their own exit code.

```bash
function runpipe() {
  if command -v $2 > /dev/null; then
    echo $1 | ${@:2}
  else
    echo "$2 is not installed :("
	return 1
  fi
}
```

This recreates the functionality in the if statements of the previous script. We can now simplify it as follows:

```shell
echo "1: Print with cowsay"
echo "2: Print with figlet"
echo "3: Print with toilet"
echo "4: Print with echo"
echo "Anything else: Exit"

read -p "Enter a number: " input
hello="Hello, world!"

function runpipe() {
  if command -v $2 > /dev/null; then
    echo $1 | ${@:2}
  else
    echo "$2 is not installed :("
  fi
}

if [[ $input == "1" ]] ; then
  runpipe $hello cowsay
elif [[ $input == "2" ]] ; then
  runpipe $hello figlet
elif [[ $input == "3" ]] ; then
  runpipe $hello toilet -t
elif [[ $input == "4" ]] ; then
  echo $hello
else
  exit
fi
```

## Variables and Scope {#basic-scope}

- reference `$hello` from `runpipe()`
- `local VARIABLE=5`
- `export VARIABLE=5`
