---
{
    title: "Joining Freenode IRC: A Guide",
    description: 'Basic (but detailed) instructions for setting up a Freenode IRC account through various clients',
    published: '2019-08-22T05:12:03.284Z',
    authors: ['fennifith'],
    tags: ['irc'],
    attached: [],
    license: 'publicdomain-zero-1'
}
---

Internet Relay Chat is a difficult thing to get used to, especially for people who were born into this world of full graphical interfaces and messaging web apps that handle user interaction seamlessly. IRC is a little bit different, though it still has a lot of the functionality that conventional messengers do: group chats / channels, admin (operator) permissions, user ban lists, private messages, and _quite a bit more_. However, a lot of this functionality may seem obscured to new users, as most IRC clients don't have the fancy menus, dropdowns, or simple toggles and check box elements that are often taken for granted - they use more of a command line-like interface, having users remember the commands to execute a specific action instead, like `/motd` or `/whois fennifith`.

## Choosing a Client

The first thing that you'll want to do before logging into freenode is choose an IRC client to connect with. I've compiled a list of the ones that I have tried below.

- **Android**
  - [Revolution IRC Client](https://play.google.com/store/apps/details?id=io.mrarm.irc)
  - [Riot IM](https://about.riot.im/)
  - [AndroIRC](https://play.google.com/store/apps/details?id=com.androirc)
  - [IRCCloud](https://play.google.com/store/apps/details?id=com.irccloud.android)
- **Linux**
  - **CLI**
    - [WeeChat](https://weechat.org/)
    - [Irssi](https://irssi.org/)
  - **GUI**
    - [HexChat](https://hexchat.github.io/)
    - [XChat](http://xchat.org/)
- **Windows**
  - [HexChat Windows](https://www.microsoft.com/en-us/p/hexchat/9nrrbgttm4j2)
- **Web**
  - [Riot IM](https://riot.im/app/)
  - [Freenode Webchat](https://webchat.freenode.net/)
  - [Kiwi IRC](https://kiwiirc.com/)
  - [The Lounge](https://demo.thelounge.chat/)

## Connecting to Freenode

Connect to the freenode servers by specifying `chat.freenode.net` as the server, and either port `6697` if your client supports SSL/TLS connections, or `6667` if it does not. Many clients have a preset option for connections to freenode, for example in `irssi` you can simply type `/CONNECT Freenode` to connect to a freenode server without needing to configure anything else.

For a more detailed explanation of connecting to freenode, [Freenode's documentation](https://freenode.net/kb/answer/chat) might be useful.

## Registering a Nickname

First, you'll want to choose a nick. This will be something that all users will see and address you by, so it should be easy to remember. If you have a twitter or github handle, it is best to make it as similar as possible to that in order to stay consistent. In the following steps, replace the information surrounded by `<>` with the relevant data.

1. Send the command `/nick <username>`, followed by a message to `NickServ` by running `/msg NickServ REGISTER <password> <email@example.com>`. 
2. You should receive an email with another command to run, along the lines of `/msg NickServ VERIFY REGISTER <username> <code>`. This will confirm your identity to freenode and reserve the nickname for your use.
3. If you plan to use your account from multiple devices simultaneously, you will need to have one username for each. You can join them to your current account by:
  - Setting your nick to a new username: `/nick <username2>`
  - Identifying with your existing credentials: `/msg NickServ IDENTIFY <username> <password>`
  - Grouping the nick with your account: `/msg NickServ GROUP`

Each time you reconnect to freenode, you will need to log in. [Freenode's registration docs](https://freenode.net/kb/answer/registration) have more information on this, but it is possible to simply run `/msg NickServ IDENTIFY <username> <password>` each time you connect.

## Joining a Channel

On most IRC servers, you can run `/list` to display a list of all of the channels on the server that you can join. However, as freenode has just shy of 50000 channels, this command will generate quite a large output that may not be to your liking. Two options here: you can either use a web index, such as [irc.netsplit.de](http://irc.netsplit.de/channels/?net=freenode), to view a list of channels in a more usable format, or you can use freenode's [alis tool](https://freenode.net/kb/answer/findingchannels) to search through the list with a query such as `/msg alis LIST programming`. Alis has quite a few other options to trim down the search results, and I reccomend taking a look at `/msg alis HELP LIST` before you start scrolling through 1000+ search results to look for a particular topic.

## General Use

By now, you've probably gotten a decent feel for how IRC chat works - most commands handle faulty input fairly gracefully and let you know what they're doing and how to use them properly. Most commands and usernames are case insensitive, and help can usually be found by simply adding `help` after the root command, ex: `/msg NickServ HELP VERIFY`. If you haven't come across them already, here is a list of various useful commands and what they do:

- `/info`: display information about the server
- `/names`: show the usernames of members in the current channel
- `/whois <username>`: looks up information about a particular user's connection
- `/msg <username> <message>`: sends a private message to a user
- `/join <channel>`: joins a particular channel
- `/me <action>`: invoke a virtual action, such as `/me takes a humongous bite of their pie` to create a notice such as "fennifith takes a humongous bite of their pie"
- `/describe <username> <description>`: similar to `/me`, using the username of someone else on the network, ex: `/describe steve012 crashes through the wall`
- `/notify <username>`: tells the server to send you a notification when another user logs on
- `/ping <username|channel>`: displays information about the distance between your computer and other users on the network
- `/quit <message>`: quits the server, sending a final comment to any chats you may be involved with

More commands, along with basic descriptions of how they work and examples of their use, can be found [here](https://www.livinginternet.com/r/r.htm).

## Policies

Last, but certainly not least, I recommend that you scroll through [freenode's policies](https://freenode.net/policies) to get an idea of the purpose of the project and what is deemed acceptable use of their servers. Most channels have their own code of conduct to go along with these policies, which you should review to make sure that you aren't unknowingly violating any rules when contributing to a discussion. The [channel guidelines](https://freenode.net/changuide) also list more definitions of what is considered to be acceptable behavior on IRC (and really any social network).

And, most importantly, have fun!
