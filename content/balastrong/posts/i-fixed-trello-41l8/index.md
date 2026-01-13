---
{
title: "I Fixed Trello",
published: "2023-10-31T14:21:33Z",
tags: ["productivity", "webdev", "chrome", "opensource"],
description: "Having a unique ID on each card is so important to efficiently communicate, but Trello does not show...",
originalLink: "https://leonardomontini.dev/trello-numbers-fixed",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "My Dev Journey",
order: 7
}
---

Having a unique ID on each card is so important to efficiently communicate, but Trello does not show it by default.

However, there are some Chrome extensions to show them! But… they all recently stopped working.

I published a video where I tell a story about how I found myself creating an extension to add numbers on Trello cards and how I fixed it when it stopped working.

You can find the video here:

<iframe src="https://www.youtube.com/watch?v=srva7IEDR9M"></iframe>

If you prefer reading, I share down here the script of the video:

## Fixing Trello

Long story short, last year I wanted to learn how to create a Chrome extension and I used this Trello numbering thing as a playground, because... why not?

I created the repository, published the extension to the Chrome Web Store, and basically since I'm not using Trello that much anymore I forgot about it.

Until recently, when I received a comment on the YouTube presentation video saying that it stopped working. Not just my toy extension, but all of them.

I investigated a little bit and it turned out that Trello did some changes in the DOM, basically it removed the html elements that already had the numbers in them and changed some css classes, which as a result invalidated the selectors used by the extensions.

Not a big deal, I changed the code a little bit, published the new version and that's it, numbers are back!

You can see here I can change the format, the color and a couple other settings.

In case you were wondering, yes, the UI of the popup is ugly, please jump on the repo and open an issue or a PR if you want to improve it, much appreciated!

Anyway, there's a fun catch if you're curious. Trello already had an element in the DOM with the card number in it, but it was hidden with css, so all extensions were simply removing that class or forcing the display value to block and the number was there.

In case you were wondering, yes, IDs are unique and the same for everyone, as they're basically the id assigned by Trello which you can also see in the url of the card.

## Chrome Extensions vs Powerups

Now, a legitimate question you might have is, why do you even need a Chrome extension if Trello has powerups and there's one doing exactly that, showing the card number.

First of all, there's an historical reason, until 2021 you could only have one powerup per board in the free plan, hence having numbers from an extension was a good alternative.

Nowadays you can indeed have unlimited powerups, making the extension less powerful, however there are still some cases in which it still might make sense, for example if you have no direct control of the board and you cannot ask to install the powerup.

One more reason is that with the extension you automatically have numbers on all boards at once, without the need of configuring the powerup on each one individually.

## Alternatives: GitHub Projects

Let me add a plot twist, do you even need Trello anymore? Nowadays there are probably a dozen of similar services that let you create a board and move cards around. To name one: GitHub Projects.

The cool thing is that, as you might expect, it's deeply integrated with GitHub.

The feature I like the most is that you can either create a draft card, or you can convert it to a proper issue which is much more than a simple link to the issue tracker, it's a real enhanced issue that you can assign to people, add labels and some extra fields, always up to date and in sync with the issue tracker.

Are you already using GitHub Projects? Would you be interested in a dedicated video about it? Let me know in the comments!

## Closing

And with that said, this was the story of how I fixed Trello numbers.

If you liked this video don't forget to also let YouTube know by clicking the like button, you can subscribe to my channel if you want my next videos to appear in your homepage.

Thanks for watching and see you soon!

## Links

You can get the extension on the [Chrome Web Store](https://chrome.google.com/webstore/detail/trello-card-numbers-plus/ncibjlmfhjcjnphnpphgphbflpdpliei)

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
