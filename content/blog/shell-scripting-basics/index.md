---
{
    title: "Getting Started With Shell Scripts: The Basics",
    description: 'An introduction to the amazing possibilities offered by shell scripting.',
    published: '2019-09-26T05:12:03.284Z',
    author: 'adueppen',
    tags: ['shell', 'linux'],
    attached: [],
    license: 'cc-by-4'
}
---

#Intro {#intro}

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

##Setup {#intro-setup}

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

#Basic Scripting {#basic-scripting}
---

##A Simple Example {#basic-example}

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

##Conditions and User Input {#basic-conditions-input}

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

Now our script prints out "Hello, world!" even if `cowsay` isn't installed. This is certainly better, but what if you're
not much of a fan of `cowsay` (but still want fun text display)? It's always nice to offer options, so let's make that
happen. We can use the built-in command `read` in order to prompt the user to type something in. This also gives us a
chance to use variables, which are another critical part of any programming language. Conveniently, variables in shell
scripting are very easy to use, so we'll also use them to put the "Hello, world!" text in its own variable so it doesn't
have to be written out so many times.

```shell
echo "1: Print with cowsay"
echo "2: Print with figlet"
echo "3: Print with echo"
echo "Anything else: Exit"

read -p "Enter a number: " input
hello="Hello, world!"

if [[ $input == "1" ]] ; then
  if command -v cowsay > /dev/null; then
    echo $hello | cowsay
  else
    echo "Cowsay is not installed :("
  fi
elif [[ $input == "2" ]] ; then
  if command -v figlet > /dev/null; then
    echo $hello | figlet
  else
    echo "Figlet is not installed :("
  fi
elif [[ $input == "3" ]] ; then
  echo $hello
else
  exit
fi
```

Yes, this is quite the expansion, but I'll explain it. We start with telling the user which options are available to
them (always a good idea), and then ask them to enter something. We store this input in a variable called `input`, along
with storing the text "Hello, world!" in the variable `hello` so we can easily use it later. After that, we check what
the user actually entered in. You've probably noticed by now a few new things in the `if` statements. In this case, we
use double brackets to indicate that we're performing a test, which in this case is the equality of 2 strings of text.
Additionally, we have to use a dollar sign in order to refer to our variables. This is just to make sure that they're
variables, and not commands to be run. After that we once again check to see whether `cowsay` or `figlet` is installed,
depending on what the user chose, and tell them if they don't have it.  We don't need to check if `echo` is installed
since it's a built-in `bash` command. You can also see that using `elif` (short for else-if) makes it possible to check
for a variety of conditions. Lastly, we have an `exit` command in the `else` block to make sure the script exits if the
user puts in anything beyond the 3 options. In this case it's actually not necessary since the script would already
finish and exit automatically, although it's a good idea to include it in case you decide to add more functionality
later.
