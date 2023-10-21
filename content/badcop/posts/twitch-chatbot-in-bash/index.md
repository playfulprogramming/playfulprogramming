---
{
    title: 'Deep Dive: Writing a Twitch Chat Bot in Bash',
    description: 'bash? You mean the terminal where I do my git commands?',
    published: '2023-03-05T21:07:09.945Z',
    edited: '2023-03-05T21:07:09.945Z',
    tags: ['bash', 'twitch'],
    license: 'cc-by-nc-nd-4',
    originalLink: 'https://sarah.engineer/posts/twitch-chat-bash/'
}
---

One of the rites of passage for a programming Twitch streamer is building your own chat bot. There's a plethora of tools and libraries available to make this task simpler; however, sometimes doing things the hard way is an opportunity to learn.

In this post, I'm going to do a deep dive into the implementation of my twitch chat bot, written in bash.

# Getting Started

My first step into this project was to consult [Twitch's docs](https://dev.twitch.tv/docs/irc/). I was surprised to learn that Twitch chat uses **IRC** (**I**nternet **R**elay **C**hat) as the underlying protocol. *It's an older code, but it checks out.* According to the docs, we can connect to the server at `irc://irc.chat.twitch.tv:6667`.

IRC is a wonderfully simple protocol; you connect via TCP and communicate with plaintext messages. Because of this, we can connect to the server like so:

```
netcat irc.chat.twitch.tv 6667
```

once `netcat` connects to the server, we can send a command:
```
NICK badcop_
```

Twitch sends us a lovely reply:
> :tmi.twitch.tv NOTICE * :Improperly formatted auth

It's a start!

# Authentication

Twitch expects a certain set of commands in order to verify your identity. OAuth is out of scope for this post, but you can use [apps such as this one](https://twitchapps.com/tmi/) to generate an access token.

Once you have the token, you can run the following commands to sign in:

```
CAP REQ :twitch.tv/tags twitch.tv/commands
PASS oauth:{YOUR TOKEN HERE}
NICK {YOUR USERNAME}
```

If successful, you should see a similar response from Twitch:

```
:tmi.twitch.tv CAP * ACK :twitch.tv/tags twitch.tv/commands
:tmi.twitch.tv 001 badcop_ :Welcome, GLHF!
:tmi.twitch.tv 002 badcop_ :Your host is tmi.twitch.tv
:tmi.twitch.tv 003 badcop_ :This server is rather new
:tmi.twitch.tv 004 badcop_ :-
:tmi.twitch.tv 375 badcop_ :-
:tmi.twitch.tv 372 badcop_ :You are in a maze of twisty passages, all alike.
:tmi.twitch.tv 376 badcop_ :>
```

# Bash is a Scripting Language

What we've done so far is interesting, but not very practical. Now's a good time to start turning what we have into a script. Create a new file called `twitch-chat`:

```bash
#!/usr/bin/env bash

TWITCH_TOKEN=    # ...
TWITCH_USERNAME= # ...

function auth() {
  echo "CAP REQ :twitch.tv/tags twitch.tv/commands"
  echo "PASS oauth:${TWITCH_TOKEN}"
  echo "NICK ${TWITCH_USERNAME}"
  echo "JOIN #${TWITCH_USERNAME}"
}

auth | netcat irc.chat.twitch.tv 6667
```

Now run the command `chmod +x twitch-chat` to make the file executable, and execute it with `./twitch-chat`. It should automatically log in!

## Parsing Output

The next step is to write a function that we can pipe the output of netcat to and decide what to do. First, the code:

```bash

# usage: netcat {...} | reqreader
function reqreader() {
  while IFS= read -r line; do
    # Respond to Twitch PINGs with PONGs
    [[ $line == "PING"* ]] && echo "PONG :tmi.twitch.tv";

    # All user messages are 'PRIVMSG' commands
    [[ "$line" == *" PRIVMSG "* ]] && parsecmd "$line"
  done;
}
```

This function reads from stdin using the `read` command, into the variable `$line`. For each line, we test if the line starts with "PING". If it does, we respond with the "PONG" command.

We also test if the line contains " PRIVMSG ". If it does, we call another function, `parsecmd`. Let's define that as well:

```bash
function parsecmd() {
    msg=$(echo -n "$1" \
            | grep -oP "PRIVMSG.*$" \
            | cut -d':' -f2- \
            | tr '[:upper:]' '[:lower:]')

    name=$(echo -n "$1" \
            | grep -oP "display-name=.*?;" \
            | cut -d'=' -f2- \
            | tr -d ';\n')

    # Print the message to stderr
    echo "$name: $msg" 1>&2
}
```

We extract the message from the line by splitting on ':' and returning the 2nd field onwards (`-f2-`). We also extract the username in a similar way. Then we print the message to `stderr` (we're reserving `stdout` for the special magic coming next!)

## Going Full Circle

So far, we've seen a variety of pipelines used in bash. These work by feeding the output of the first command into the input of the second command, and so on. The pipeline goes in order; the data flows from one command to the next, and finally to `stdout`. However... what happens if we connect one end of the pipeline to the other?

This is possible! Enter `mkfifo`:

```bash
mkfifo /tmp/twitch_pipe;

(auth && cat /tmp/twitch_pipe | reqreader) \
    | netcat irc.chat.twitch.tv 6667 \
    > /tmp/twitch_pipe;
```

`mkfifo` creates a *named pipe* that can be written to and read from as though it were a regular file. In the snippet above, we are printing the contents of the pipe using `cat`, piping it through `reqreader` and `netcat`, and then redirecting the `stdout` of `netcat` back into the pipe.

Currently, `reqreader` only emits `PONG` commands on `stdout`. Let's change that by adding this to `parsecmd`:

```bash
function parsecmd() {

  # ... exisiting code

  case $msg in
      "!ping"*)
          reply "pong!"
          ;;
  esac
}
```

We create a case statement and see if the message matches any of our commands. If it matches "!ping", we call the function `reply` with "pong!". Let's create that `reply` function:

```bash
function reply() {
    # Print the message to stderr
    echo "bot: $@" 1>&2

    # Send our response command to stdout
    echo "PRIVMSG #${TWITCH_USERNAME} :$@"
}
```

With that final piece of the puzzle, we should have our first command on the bot!

## The Final Product

```bash
#!/usr/bin/env bash

cd "${0%/*}"

TWITCH_USERNAME=$1

rm -f /tmp/twitch_pipe;
mkfifo /tmp/twitch_pipe;

function reply() {
    # Print the message to stderr
    echo "bot: $@" 1>&2

    # Send our response command to stdout
    echo "PRIVMSG #${TWITCH_USERNAME} :$@"
}

function parsecmd() {
    msg=$(echo -n "$1" | grep -oP "PRIVMSG.*$" | cut -d':' -f2- | tr '[:upper:]' '[:lower:]')
    name=$(echo -n "$1" | grep -oP "display-name=.*?;" | cut -d'=' -f2- | tr -d ';\n')

    # Print the message to stderr
    echo "$name: $msg" 1>&2

    case "$msg" in
        "!ping"*)
            reply "pong!"
            ;;
    esac
}

function reqreader() {
  cat /tmp/twitch_pipe | while IFS= read -r line; do
    [[ $line == "PING"* ]] && echo "PONG :tmi.twitch.tv";
    [[ "$line" == *" PRIVMSG "* ]] && parsecmd "$line"
  done;
  exit 0;
}

function auth() {
  echo "CAP REQ :twitch.tv/tags twitch.tv/commands"
  echo "PASS oauth:${TWITCH_ACCESS_TOKEN}"
  echo "NICK ${TWITCH_USERNAME}"
  echo "JOIN #${TWITCH_USERNAME}"
}

(auth; reqreader) \
    | netcat \
      irc.chat.twitch.tv 6667 \
    >/tmp/twitch_pipe;
```

# Conclusion

Hopefully you learned something from this deep dive! If you want to see the current iteration of my actual bot, you can [check it out on my GitHub](https://github.com/cgsdev0/dotfiles/blob/main/bin/twitch-cmds/twitch-chat).
