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

At its core, a shell script is simply a sequence of commands, one per line - if you've used a bash command line before,
you already know a lot of the syntax it uses. Each line of the file is interpreted as a single command, and bash will
run each line sequentially until it reaches the end of the file, or it gets to an `exit` command. If you're ever
confused about how part of a script works, you can try running it individually outside of the script to see how it
behaves.

Let's start out with a simple example: create a file somewhere on your computer called `simple.sh` and start editing it.
In most text editors, you can combine both steps into one by running `{editor} simple.sh` - `nano simple.sh`, for
example. All you need to put into the file is the text `pwd`. This is a standard Linux/Unix command that prints out the
directory you're currently in. If you save and exit your editor and then run `bash simple.sh`, it should print out your
current directory. In my case, it looks like this:

```
$ bash pwd.sh
/home/adueppen/scripts
```

Congratulations! You've just written your first shell script! Sure, it just does the same thing that running `pwd` in
the terminal normally would do, but the real power of shell scripting comes in when using these standard commands along
with the scripting features in order to add things like interactivity, loops, and conditions. Now, let's move on to some
of those more advanced features.

## Cowsay, Part 1: The `if` Command {#cowsay-if-command}

Conditional execution is one of the most important parts of any programming language. If you couldn't choose whether or
not to execute something, things would be ...difficult, to say the least. Thankfully, bash includes `if` as a built-in
command. Note that this is _technically_ different from a typical programming language's `if` statement, and that's why
I've been referring to it as the "`if` command". In practice, however, it functions basically the same way.

A common way that conditions are used in shell scripts is to check if a particular program is installed before running
it. Here's a simple example of it in use:

```shell
if command -v cowsay > /dev/null
then
  cowsay "Hello, world!"
fi
```

Here, an `if` construct is used with the built-in `command` command in order to check if the `cowsay` command exists.
It's generally not installed by default (even if it perhaps should be), so we can't assume that it's going to be there.
The `> /dev/null` part is used to throw away the output of `command` since we don't actually need to know where `cowsay`
is, just that it exists. If it's there, we run `cowsay` with the argument "Hello, world!", which prints a funky looking
cow in the shell.

Although the use of redirection (`>`) might seem a bit confusing now, we'll get into that later. Right now, if you run
this script, it'll either print out ASCII art of a cow saying "Hello, world!", or ...nothing. That's not exactly ideal,
so let's add an alternative case for when `cowsay` isn't available:

```shell
if command -v cowsay > /dev/null
then
  cowsay "Hello, world!"
else
  echo "Hello, world! (PS: install cowsay for more fun!)"
fi
```

Now our script prints out "Hello, world!" even if `cowsay` isn't installed. If you don't have `cowsay` on your computer,
try installing it to see the output change!

## Cowsay, Part 2: User Input {#cowsay-user-input}

Let's make this script a little more interactive - what about asking the user what they want the cow to say? One way to
do that is to use the `read` command. Here's an excerpt from the command's help text, which can be accessed by running
`read --help` in your command line.

> read: read [-ers] [-a array] [-d delim] [-i text] [-n nchars] [-N nchars] [-p prompt] [-t timeout] [-u fd] [name ...]
> 
> Reads a single line from the standard input, or from file descriptor FD if the -u option is supplied.  The line is
> split into fields as with word splitting, and the first word is assigned to the first NAME, the second word to the
> second NAME, and so on, with any leftover words assigned to the last NAME.  Only the characters found in $IFS are
> recognized as word delimiters.
> 
> -p prompt - output the string PROMPT without a trailing newline before attempting to read

A lot of this isn't useful to us, but we can extract a bit of helpful information:

- The (simplified) syntax of the command we want to run is `read -p [prompt] [name]`
- `read` will allow the user to enter a single line, and store its result in whatever variable we specify as `[name]`
- By passing `-p [prompt]`, we tell the command to output the prompt text before accepting any input.

Now, let's try putting this together - if we want to ask the user a question, we could write something like this:

```shell
read -p "What should the cow say? " input
```

Running this will prompt the user for a line of text and store its result in a variable named `input` - but how do we
use that variable in our code?

The syntax for accessing variables in bash is to prefix their name with a dollar sign (`$`). With this, variables can be
embedded in nearly any bash command or argument - they will simply be replaced with the content of the variable when the
command is run. With this knowledge, let's rewrite our example of the `if` command from before...

```shell
read -p "What should the cow say? " input

if command -v cowsay > /dev/null
then
  cowsay "$input"
else
  echo "The cow says $input (PS: install cowsay for more fun!)"
fi
```

_Optionally, the variable can be formatted as `${input}`, with curly brackets around the name - this is sometimes useful
to make it distinctly separate from the rest of the string, if it's surrounded by other text._

Try running this! Your script should now ask you to enter a line of text, which will then be passed to the `cowsay`
command, generating a fun ASCII cow that says whatever you want.

## Cowsay, Part 3: Command Substitution {#cowsay-command-substitution}

`read` obviously works a little bit differently from most bash commands, in a "pass-by-reference" design - this isn't
unusual, and we'll cover how this works in a future post, but there are more common ways to assign a variable to the
result of a command. Namely, using the `variable=value` syntax...

<!-- I say "pass-by-reference design" here, but it doesn't feel quite right to me - is it... a syntax? a trend? I feel
like there's a better word for this sort of thing but I can't think what it could possibly be. -->

_For a hint to why `read` needs to do this, try running `read -p "Type something: "` in your command line. You'll notice
that, after prompting you for input, it doesn't write anything else to the console. Most other commands (such as `pwd`)
 will print their results to the "standard output" - which this next feature makes use of._

Let's say that we want our cow to greet the user at the start of our script. The `whoami` command is a fairly standard
Linux tool that prints the name of the current user - running this in your command line, you should see that it prints
your username. We now know the command we want to run to get the information we need, but how can we use this in our
script?

For this, we need to capture the output of the command and store it in a variable. Bash allows us to do that using the
"command substitution" construct - by enclosing our command in `$(...)`. All we need to do is assign that to a variable,
then use that variable to template it into our greeting.

```shell
username=$(whoami)
echo "Hello, $username!"
```

If you guessed that we could shorten this to a single line, you'd be right! Just like how we can template variables in
a double-quoted string, command substitution can be templated as well - making our command `echo "Hello, $(whoami)!"`.

Now that we've got this working, all we have to do is run `cowsay` instead of `echo` - and we have a very creepy cow
that somehow knows what my name is. Oh no. I could have nightmares about this.

Err, let's forget about that for now and add this to the start of our program - enclosing it in the `if` statement we
wrote before, to make sure that `cowsay` actually exists before using it.

```shell
if command -v cowsay > /dev/null
then
  cowsay "Hello, $(whoami)!"
else
  echo "Hello, $(whoami)! You should really install cowsay. It's a lot of fun."
fi

read -p "What should the cow say? " input

if command -v cowsay > /dev/null
then
  cowsay "$input"
else
  echo "The cow says $input (PS: install cowsay for more fun!)"
fi
```

## Cowsay, Part 4: Test Constructs {#cowsay-test-constructs}

Now that we've added a couple features to our program, we have the ability to get our cow to say some pretty crazy
things. I've gotten mine to say "woof," for example - a noise that no real cow should ever be making. Perhaps we should
add an extra case in this script to prevent our cow from making such a terrifying sound? In order to accomplish this, we
need to learn about _test constructs,_ and how the `if` command really works.

When any shell command is executed, it implicitly sets a variable named `$?`, called its "exit code". This is always an
integer, and can be seen as a sort of "return value" in bash. Normally, most exit codes should be 0 - by Unix
convention, this indicates that the command was a success. Some commands do fail, though - and their exit code can be
used to communicate that information to the program that started it.

As an example of this, the `command` command has the potential to fail if the argument it is given doesn't exist.
Running `command thiscommanddoesntexist` followed by `echo $?` should print the number `127` in your shell - while
running `command echo` followed by `echo $?` will print `0`. This is how the `if` statement evaluates its condition - if
it returns an exit code of zero, it is interpreted as a success.

With this in mind, we're going to introduce "test constructs" - a shell syntax that evaluates its arguments as a
comparison, and returns an exit status indicative of the result (0 for true, 1 for false). Similarly to how `if` is
_secretly a command of its own_, test constructs are also a command... which is named... "left square bracket" (`[`).
No, I'm not joking.

Here, we want to compare two variables for equality - we want to check whether our `$input` variable is equal to
`"woof"`. The "left square bracket" equivalent of this should then be `[ "$input" == "woof" ]`. If the comparison is a
success (meaning that `$input` is "woof"), the exit status will be `0`, which should be interpreted by an `if` command
as "true." Inside our if statement, we can `echo` a message to the user, then use `exit 1` to terminate the script and
indicate a failure - if another script wanted to determine the result of ours, it could use this exit code to do so.

```shell
if command -v cowsay > /dev/null
then
  cowsay "Hello, $(whoami)!"
else
  echo "Hello, $(whoami)! You should really install cowsay. It's a lot of fun."
fi

read -p "What should the cow say? " input

if [ "$input" == "woof" ]
then
  echo "Your cow sounds like it has a cold! Take it to the vet."
  exit 1
fi

if command -v cowsay > /dev/null
then
  cowsay "$input"
else
  echo "The cow says $input (PS: install cowsay for more fun!)"
fi
```

One **important thing** to note about these test constructs: _the space between the square brackets and the condition is
mandatory._ The `[` command is interpreted as, well, a command - leaving out that space between `[` and `"$input"` would
tell bash to look for a program named `["$input"` instead; the same thing would happen if you were to write `exit1`
instead of `exit 1`.

Another thing we didn't quite cover here - the "if" construct also supports `elif`. It can be used the same as an `else`
case, in the form of `elif [condition]; then ...`.

## 

## Looping Control Structures {#basic-loops}

Bash also includes a few commands for looping or repeatedly performing a task: `for`, `while`, and `until`.

`while` loops have a similar syntax to the `if` command, with a few key differences...

```shell
i=5
while [ $i > 0 ]
do
    i=$(expr $i - 1)
done
    
```



<!-- TODO: while, foreach, etc -->

# Executable Scripts {#installation}
---



<!-- I'm thinking that the cowsay examples should end here - I think we've
exhausted it of its usefulness by now. We should perhaps demonstrate the other
types of control structures and positional arguments in this post, but I think
functions and variable scopes are more advanced features that we should cover in
a future post -->

---

<!-- Below this line is stuff I haven't managed to fit in yet - the examples
are getting a bit too heavy IMO and might need to be replaced. -->

This is certainly better, but what if you don't always want to use `cowsay` to print it out? Two more programs available
for printing out text in fun ways are `figlet` and `toilet`, so let's make it so that the script will randomly use
either `cowsay`, `figlet`, or `toilet`. This time we'll want to use a variable to store the random number we generate.
Conveniently, variables in shell scripting are very easy to use. Declaring them doesn't require any special syntax at
all, just a value of some sort for the variable. However, when referring to the variable, it has to be prefixed with a
dollar sign in order to indicate that it's not a command to be run.

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

## Interactivity and input {#basic-user-input}

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

## Positional Arguments {#arguments}

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
