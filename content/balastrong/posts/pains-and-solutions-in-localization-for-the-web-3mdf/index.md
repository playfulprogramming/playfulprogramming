---
{
title: "Pains and solutions in localization for the web",
published: "2023-12-13T18:22:29Z",
tags: ["webdev", "react", "javascript"],
description: "There's nothing wrong in writing plain text in your HTML/JSX code, it renders nicely on the browser...",
originalLink: "https://leonardomontini.dev/localization",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Web Development",
order: 15
}
---

There's nothing wrong in writing plain text in your HTML/JSX code, it renders nicely on the browser and that's it.

Until... your customer asks you to translate the website from your native language to English. Seems like a boring job to track all the texts here and there in your code but at least it's not a difficult task.

Wait a moment, the request is not to change language but actually to support multiple languages at the same time.

Luckily it's not a new thing, there are plenty of solutions and libraries to help you with that... but it's not all that easy.

Let me share here some of the pain points I've experienced and how I've tried to solve them, I'm quite sure you'll find yourself in some of these situations.

## The common solution

Dealing with multiple languages is usually done by using a key-value approach, with the so-called "loca keys" being the identifier of the text and the "value" being the localized text.

In a recent project I've been using [react-i18next](https://react.i18next.com/) so I'll use its syntax for the examples, but pretty much every library works similarly.

### Defining the keys and values

First of all, you need to define the keys and values somewhere... like in a JSON file:

```json
{
  "welcome": "Welcome to my website!",
  "hello": "Hello, {{name}}!"
}
```

This one above might be your `en.json` and probably on the same folder, you'll have an `it.json` with the same keys but different values.

```json
{
  "welcome": "Benvenuto nel mio sito!",
  "hello": "Ciao, {{name}}!"
}
```

You can do even more, like having separate folders for each language and then as many json files as you want, so you can split the keys in different files and have a better organization. Make sure to not have missing keys in one of the files though!

### Using the keys

Now that you have your keys and values, you can use them in your code. With `react-i18next` you can use the `useTranslation` hook to get the `t` function that will translate the keys for you.

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      {t('welcome')}
      {t('hello', { name: 'Leonardo' })}
    </div>
  );
};
```

The `t` function will return the value for the given key, and if you pass an object as the second parameter it will replace the placeholders with the values you passed.

Other libraries might have a different syntax, but the concept is the same.

## Pain points

This is one of the quickest and easiest ways to deal with multiple languages, but it comes with some drawbacks.

The following are some of the pain points I've experienced personally and how I've tried to solve them.

### Finding the right words

In small teams, this is still manageable, often times it's the frontend developer that has to deal with the translations and it's not a big deal to update the keys and values when something changes.

Your customer will probably ask you to change some words here and there, and you'll have to update the values accordingly.

However, in large projects or in case there's a dedicated person for the translations the situation might be different, especially if we're not talking about a developer or in general someone who can read the code.

Sure you can send around the JSON files and ask for the translations, but the other person is likely missing the context and it's not easy to understand where the text is used.

What if it was possible to edit the translations directly on the website, without having to deal with the code?

Open your favourite browser's devtools and type this in the console:

```js
document.designMode = 'on';
```

Have you ever seen this before? It's a cool feature that allows you to edit the content of the page directly in the browser, without having to open the code editor.

Cool but... it's obviously only happening in your browser.

Well, some tools can help you do something similar with localized texts and one I found recently is [Tolgee](https://tolgee.io/) (which by the way is also [Open Source ⭐️](https://github.com/tolgee/tolgee-platform), bonus points for that!)

If you're using it to handle your localization, there's a feature that lets you edit the translations directly on the website by holding the `Alt` key and clicking on the text you want to edit. It will open a modal where you can edit the text and save it.

I wish I had known this before!

### Storing the translations

Sure, having all translations in a JSON file is easy to manage, but what if you want to have a better overview of the translations?

Again the project I'm using as an example wasn't too big and most of the translations were on me as it was only in English and Italian, but relying on a single person to handle all the translations is not a good idea.

There are tools managing all translations and for example letting you know if there are missing keys, or if there are some keys that are not used anymore.

My approach was to make sure the structure of the JSON files was always the same, so I could easily spot missing keys by looking at the line numbers, but doesn't sound like a bulletproof solution at all!

### Frontend or Backend?

A common situation you might find yourself in is to have *some* texts translated on the frontend and *some* on the backend.

Once again this works fine if you're the only one working on the project, but if you have a team and you're not the one handling the translations, you might want to have a single place where to handle everything.

A few possible approaches:

A) Everything on the frontend: Static texts in your code, we already saw how to do that. Everytime the backend has to show a text, you can pass a key instead so that it will be the responsiblity of the frontend to translate it.

B) Everything on the backend: The frontend has the keys but doesn't know by itself how to translate them. Definition files matching keys and values are all stored on the backend and sent to the frontend when needed, be it at the start of the application or on demand.

C) Everything on an external service: Similar to the previous one, but instead of having the translations in your own backend app, you can use an external service to handle everything for you. The advantage is that you can follow a dedicated workflow specifically designed for translations.

## Conclusion

Dealing with localization can be easy at the beginning, but it can become quite painful as the project or the team grows.

There are quite some tools out there that can help you with that, but it's important to understand the needs of your project and choose the right one for you.

Happy localizing! 🌍

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
