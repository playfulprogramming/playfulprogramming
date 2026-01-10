---
{
title: "Playing with Copilot CLI on top of Warp terminal",
published: "2023-05-23T07:50:00Z",
edited: "2024-04-29T16:39:38Z",
tags: ["terminal", "ai", "github", "productivity"],
description: "I recently got access to the new Copilot CLI, which basically gives you the full power of GitHub...",
originalLink: "https://leonardomontini.dev/copilot-cli-vs-warp-ai/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


I recently got access to the new Copilot CLI, which basically gives you the full power of GitHub Copilot but in your favourite terminal so... time to give it a try!

As of today, the tool is in the **waitlist** stage. If you don't have access yet, you can request it on the [Copilot for CLI](https://githubnext.com/projects/copilot-cli) page on GitHub Next. An active Copilot subscription is required.

## Setup

Did you get access? Yaay! Here's how to get started:

1. Install the CLI as a regular node package: `npm install -g @githubnext/github-copilot-cli`
2. Run the command `github-copilot-cli auth` to authenticate with your GitHub account
3. Setup the aliases with `eval "$(github-copilot-cli alias -- "$0")"`

### Aliases

Why set up aliases? I don't think you want to type `github-copilot-cli` every time you want to use the tool, as easy as that!

If you ran the command on step 3 you will have them available, but only in the current session! To have them globally available make sure to past the command `eval "$(github-copilot-cli alias -- "$0")"` in your `.bashrc` or `.zshrc` file, depending on the shell you're using.

For completeness, there's an extra reason besides having convenient aliases and it's explained in the [documentation](https://www.npmjs.com/package/@githubnext/github-copilot-cli#whats-the-point-of-the-eval-and-alias-stuff), in short, it makes the tool work better.

After all this explanation, here's the list of aliases you'll get:

- `??`: Ask for a generic shell command
- `git?`: Ask for a `git` command
- `gh?`: Ask for a GitHub CLI command

## Test run

Since I recently started using the [Warp](https://www.warp.dev/) terminal which also has an AI assistant, I thought it would be fun to try both at the same time!

These days we're flooded with AI-assisted tools, and they're all great, but at some point, we should find out which one works best for each one of us.

Let's warm up with an easy one, the good old getting rid of the `node_modules` folder.

### Prompt

> delete node modules of this project

### Copilot CLI

After about a second the tool suggested the expected `rm -rf node_modules`, and you can see below the explanation was still pending.

![Delete node modules 1](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jhn92k24h0h5r03sdrtk.png)

One more second later and also the explanation arrived.

It's time to select with the up/down arrows if you want to run the command, revise the query or cancel and get back to the prompt.

![Delete node modules 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n85cdedcvcpedwg06hpa.png)

It's worth noting that after selecting the first option it's still not immediately executed and you get the known (y/N) question with capital N.

At first, this made me think "No" was automatically selected when pressing Enter but looks like it's not the case.

![Delete node modules 3](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bp8p7w34j6fgx3dt2ntb.png)

I pressed `y` and the command was executed. You can see the output here: https://app.warp.dev/block/Yy5mEuxoMJAoq6VScNqTJa

### Warp

The `??` counterpart in Warp is `#`, so let's use it to ask Warp the same question! The first difference I see is that as soon as you type `#` the AI panel appears.

![Delete node modules with Warp 1](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3u371b0ik0l2nws7fdy6.png)

Press Enter and after about a second the command appears under "Suggested command".

![Delete node modules with Warp 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/thihlqhpff97i5spu6cq.png)

With `Cmd+Enter` the command is not executed but actually put into the terminal, so you can still edit it before running it.

Speaking of the explanation, you can request it by clicking on the "Explain how this works" button.

![Warp AI Explain](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ixnclw7uv1pn4rywh495.png)

A side panel will appear and by pressing Enter again you will see the in-depth explanation.

![Warp AI Explain](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/72gkta3gt53qazc7mcfa.png)

## Refining the suggestion

AI tools are far from being perfect, you would not let them run commands by themselves without checking them first and in fact, both tools we tried here have a double step for confirmation and let you refine the command before running it.

It's supposed to be a suggestion after all, not necessarily a command to immediately run.

Speaking of refining the command, Copilot CLI uses an approach that I don't really like. It's not possible to edit the command directly, you can only change the query and get a new suggestion. I mean, it leverages even more the AI power but sometimes you just want to edit the command directly.

But maybe it's just my personal opinion there. Please let me know in the comments which approach you like the most, between having a refined command by the AI or being able to edit it directly.

## Command explanation

Once more, we're talking about suggestions here, so an explanation is always welcome. And again, we see two different approaches.

Copilot CLI gives you the explanation as soon as the suggestion is ready, while Warp gives you the command first and then you can request the explanation manually, if you want.

The explanation isn't at the same depth though! Copilot arrives faster but with a really concise and short explanation, while Warp requires an extra user interaction but goes way more in-depth.

This time I don't have a strong feeling about either approach so I'm once more asking for your opinion.

![Write a comment](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/73224eumnmeixw8dmyy5.png)

## A short command

At the beginning of the article I mentioned you might want to edit your `.bashrc` or `.zshrc` file to have the aliases available globally, but how can you do that? Let's ask the AI!

(well, you need it already up and running before asking, but you get the point!)

### Prompt

> edit default zsh config

### Copilot CLI

At first, it suggested `nano ~/.zshrc` which is a good start, but I wanted to use VS Code instead. This time I went for "Revise query" and asked for vscode instead.

It regenerated the suggestion with `code ~/.zshrc` which is exactly what I wanted.

Full output: https://app.warp.dev/block/mnMviqjfJE2WUsoEXfd4RN

### Warp

The same goes for Warp, the first suggestion was `nano ~/.zshrc`.

I mean, looks like these Artificial Intelligence tools are not subscribed to my [YouTube channel](https://www.youtube.com/@DevLeonardo), otherwise, they would know I use Visual Studio Code!

## A tricky one

Let's level up a little bit!

### Prompt

> find all images inside content/blog and add them to a zip called blogImages

### Copilot CLI

Copilot only includes `png` images and passes them to the `zip` command with the well-known `xargs`.

```bash
find content/blog -name "*.png" | xargs zip blogImages
```

Again, the explanation is really really short but isn't missing anything in particular.


![Zip Copilot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4iq8nfxzpkxl7eqgql1x.png)


### Warp

Warp includes both `png` and `jpg` images and passes them to the `zip` command with a zip-specific flag that is `-@`.

```bash
find content/blog -name "*.jpg" -o -name "*.png" | zip blogImages -@
```

The explanation here as usual is longer and with more "natural language", as if a human was explaining it to you.

> This command finds all files with the extension ".jpg" or ".png" in the directory "content/blog" and pipes the output to the `zip` command. The `zip` command creates a zip file named "blogImages.zip" and adds the files from the standard input (indicated by the `-@` option).
>
> In other words, this command creates a zip file named "blogImages.zip" containing all the ".jpg" and ".png" files in the "content/blog" directory.

![Zip Warp](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7n4a6w97hn8dafndelr2.png)

## Dealing with a husky error

When working on an Open Source project I noticed I had this message after each commit:

```bash
hint: The '.husky/pre-commit' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.
```

### Prompt

> how can I fix this error: hint: The '.husky/pre-commit' hook was ignored because it's not set as executable. hint: You can disable this warning with `git config advice.ignoredHook false`.

### Copilot CLI

```bash
 ──────────────────── Command ────────────────────

chmod +x .husky/pre-commit

 ────────────────── Explanation ──────────────────

○ chmod is used to change the permissions of a file.
  ◆ +x adds the executable permission.
  ◆ .husky/pre-commit is the file whose permissions we want to change.
```

### Warp

```bash
chmod +x .husky/pre-commit
```

Same command, so I asked to explain it:

> The output you received indicates that the commit was successful and a new file `test.txt` was created. However, there is a warning message about the `.husky/pre-commit` hook not being set as executable.
>
> This warning message is related to Git hooks, which are scripts that run automatically before or after certain Git commands. The `.husky/pre-commit` hook is a pre-commit hook that is used by the Husky package to run scripts before each commit.
>
> To fix the warning message, you can make the `.husky/pre-commit` hook executable by running the following command in your terminal:

```
chmod +x .husky/pre-commit
```

> This command sets the executable bit for the `pre-commit` file in the `.husky` directory, which allows Git to run the script before each commit.
>
> After making the `.husky/pre-commit` hook executable, you can continue working with Git as usual.

A really good one, it was exactly what I was looking for!

## Looking for something in natural language

### Prompt

> help me find PII in the blog articles in this folder

### Copilot CLI

I've been quite generic here, I didn't specify what PII is and I didn't specify what I want to do with it. Copilot suggested a `grep` command that looks for `email`, `phone` or `address` in all the `.md` files in the current directory which makes sense.

```bash
 ──────────────────── Command ────────────────────

for file in *.md; do
  grep -E "(email|phone|address)" $file;
done

 ────────────────── Explanation ──────────────────

○ The for loop iterates over a list of items and executes its body for each, using the loop variable $file.
  ◆ The list of items is *.md which means all files ending in .md in the current directory.
○ The loop body executes one command for each file:
  ◆ grep is used to search for a pattern in a file.
    ◇ -E means we want to use extended regular expressions.
    ◇ "(email|phone|address)" is the pattern we search for.
    ◇ $file is the file we search in.
```

### Warp

Warp gave me this long regex and ended up with `path/to/folder` which is not exactly I wanted, but I can just accept the command and change the path manually.

```bash
grep -r -E "\b([0-9]{9}|[0-9]{3}-[0-9]{2}-[0-9]{4}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b" /path/to/folder
```

However, I had no idea what that regex was so it's once again time to ask for an explanation:

> This is a command that uses the `grep` utility to search for a regular expression pattern in all files under the `/path/to/folder` directory recursively.
>
> Here's a breakdown of the command:
>
> - `grep` is a command-line utility that searches for patterns in files.
> - `-r` is an option that tells `grep` to search recursively in all subdirectories under the specified directory.
> - `-E` is an option that tells `grep` to use extended regular expressions.
> - `"\b([0-9]{9}|[0-9]{3}-[0-9]{2}-[0-9]{4}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b"` is the regular expression pattern that `grep` searches for. This pattern matches three types of strings:
> - A 9-digit number
> - A social security number in the format `XXX-XX-XXXX`
> - An email address in the format `username@domain.com`
> - `/path/to/folder` is the directory where `grep` starts searching for files.
>
> So, when you run this command, `grep` searches for all files under the `/path/to/folder` directory recursively and prints out all lines that match the regular expression pattern. The regular expression pattern matches any line that contains a 9-digit number, a social security number, or an email address.

This makes much more sense now!

## Moving files around

For the next test I wanted to actually change some files. I already have a zip with them so let's use the AIs to suggest me the commands to move things around!

### Prompt

> Extract the content of tmp.zip and put it in a new folder called temp in my root directory

### Copilot CLI

```bash
 ──────────────────── Command ────────────────────

unzip tmp.zip -d ~/temp

 ────────────────── Explanation ──────────────────

○ unzip is used to extract files from a zip archive.
  ◆ tmp.zip is the name of the zip archive.
  ◆ -d ~/temp specifies that we want to extract the files to the ~/temp folder.
```

Nice and easy!

### Warp

```bash
unzip ~/Downloads/tmp.zip -d ~/temp
```

Not sure why it assumed the zip was inside download, but again Warp lets me manually edit the command so I just fix the path and that's it!

## Anonymize some data

Now that I've got some files in my temp folder, let's try to anonymize them!

### Prompt

> Find all PII and anonymize them

### Copilot CLI

```bash
 ──────────────────── Command ────────────────────

find . -name "*.py" | xargs sed -i "s/([0-9]{3}) [0-9]{3}-[0-9]{4}/(xxx) xxx-xxxx/g"

 ────────────────── Explanation ──────────────────

○ find is used to list files.
  ◆ -name "*.py" stipulates that we search for files ending in .py.
○ | xargs passes the list of files to the next command.
  ◆ sed is used to search and replace text in files.
    ◇ -i specifies that we want to replace the text in the files themselves.
    ◇ "s/([0-9]{3}) [0-9]{3}-[0-9]{4}/(xxx) xxx-xxxx/g" is the search and replace pattern.
      ▪ s means we want to search and replace.
      ▪ ([0-9]{3}) [0-9]{3}-[0-9]{4} is the search pattern.
        ▫ ([0-9]{3}) means we want to match three digits and capture them in a group.
        ▫   means we want to match a space.
        ▫ [0-9]{3}-[0-9]{4} means we want to match three digits, a dash, and four digits.
      ▪ (xxx) xxx-xxxx is the replacement pattern.
        ▫ (xxx) means we want to insert the string (xxx) into the text.
        ▫   means we want to insert a space.
        ▫ xxx-xxxx means we want to insert the string xxx-xxxx into the text.
      ▪ g means we want to replace all occurrences, not just the first one.
```

This time Copilot did a bold assumption, only looking for `.py` files. I used "Revise Query" to tell him "Files are in markdown" and it updated the first command with `find . -name "*.md"`.

### Warp

Warp's take is consistent to the previous one in using a regex for the search, but by using grep it's not actually changing the files, just printing the lines that match the regex.

```bash
grep -rEIi '([0-9]{3}-[0-9]{2}-[0-9]{4}|[0-9]{3}.[0-9]{2}.[0-9]{4}|[0-9]{9})' . | sed -E 's/([0-9]{3}-[0-9]{2}-)[0-9]{4}/\1XXXX/g; s/([0-9]{3}.[0-9]{2}.)[0-9]{4}/\1XXXX/g; s/([0-9]{9})/XXXXXXXXX/g'
```

This makes me think the prompt wasn't clear enough, so I try to rephrase it:

> Find all PII in this folder and anonymize them in place

```bash
find . -type f -exec sed -i 's/[0-9]\{3\}-[0-9]\{2\}-[0-9]\{4\}/XXX-XX-XXXX/g' {} +
```

I was deliberately vague about what a PII is but it starts to make sense. Let's give it another try with a more specific prompt:

> Find all emails and phone numbers in this folder and anonymize them in place

```bash
find . -type f -exec sed -i -E 's/[[:alnum:]+\.\_\-]+@[[:alnum:]+\.\_\-]+/[ANONYMIZED_EMAIL]/g; s/[0-9]{3}-[0-9]{3}-[0-9]{4}/[ANONYMIZED_PHONE]/g' {} +
```

I ran it and... `sed: RE error: illegal byte sequence` (see https://app.warp.dev/block/31KX08qIi09BN1PS6GtAkA)

Well well well... let's ask Warp AI for an explanation:

> The error message `sed: RE error: illegal byte sequence` indicates that `sed` encountered a byte sequence that it cannot handle. This error can occur when `sed` tries to process a file that contains non-ASCII characters or when the file encoding is not compatible with the current locale.
>
> To fix this error, you can try adding the `-i''` option to the `sed` command to create a backup of the original file before making any changes. This option can help avoid issues with file encoding and non-ASCII characters.
>
> Here's the updated command:
>
> ```
> find . -type f -exec sed -i'' -E 's/[[:alnum:]+\.\_\-]+@[[:alnum:]+\.\_\-]+/[ANONYMIZED_EMAIL]/g; s/[0-9]{3}-[0-9]{3}-[0-9]{4}/[ANONYMIZED_PHONE]/g' {} +
> ```
>
> This command should create a backup of each file before making any changes and replace all email addresses and phone numbers with `[ANONYMIZED_EMAIL]` and `[ANONYMIZED_PHONE]`, respectively.
>
> If the error persists, you can try specifying the file encoding explicitly using the `-e` option. For example, if the file encoding is UTF-8, you can use the following command:
>
> ```
> find . -type f -exec sed -i'' -e 's/[[:alnum:]+\.\_\-]+@[[:alnum:]+\.\_\-]+/[ANONYMIZED_EMAIL]/g; s/[0-9]{3}-[0-9]{3}-[0-9]{4}/[ANONYMIZED_PHONE]/g' {} +
> ```
>
> This command should replace all email addresses and phone numbers with `[ANONYMIZED_EMAIL]` and `[ANONYMIZED_PHONE]`, respectively, while handling non-ASCII characters correctly.

A lot of context there, but actually the first line already made me realize that there are also images in that folder... time for a new prompt to restrict the scope of the search to markdown files only!

> Find all emails and phone numbers in markdown files in this folder and anonymize them in place

And this time I got a working command:

```bash
find . -name "*.md" -type f -exec sed -E -i '' 's/[[:alnum:]+\.\_\-]+@[[:alnum:]+\.\_\-]+/[email]/g; s/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/[phone]/g' {} +
```

## The winner is...

There has to be a winner?

Both tools are really fast and accurate but have a slightly different user experience.

I'm personally still not too confident in letting an AI run commands on my machine without checking them first, so I like that Warp lets me open a chat where I can discuss with the AI about the command and ask for an explanation, whereas Copilot just gives me a brief explanation of the command and that's it.

I also have to mention that [Warp](https://www.warp.dev/) is actually an entire terminal so you can have way more interactions and features while Copilot is just a CLI tool... so you can benefit from both!

Since I'm using Warp anyway, it's just a matter of starting the command with either `#` or `??` depending on the AI experience I'm looking for and I'm already good to go!

What about you? Have you tried any of these tools? What's your experience with them? Let me know in the comments!

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
