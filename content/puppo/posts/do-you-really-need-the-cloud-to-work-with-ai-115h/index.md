---
{
title: "Do you really need the Cloud to work with AI?",
published: "2025-06-25T06:27:11Z",
tags: ["aisprint", "gemini", "ai", "chrome"],
description: "We are in the AI era. New models emerge daily, and many applications have already integrated AI into...",
originalLink: "https://blog.delpuppo.net/do-you-really-need-the-cloud-to-work-with-ai",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

We are in the AI era. New models emerge daily, and many applications have already integrated AI into their workflows.

[Gemini](https://gemini.google.com/), [OpenAI](https://openai.com/), [Copilot](https://copilot.microsoft.com/), [Deepseek](https://www.deepseek.com/), [Llama](https://www.llama.com/), and many others enable AI in your applications or help you write code, but they all need an internet connection to be accessible. You need the Cloud or to connect to a managed service to get an answer from the model. In some scenarios, this approach exposes you to security issues or the risk of sharing data with another service, and you may want to avoid it.

To help the team and companies benefit from AI and avoid these issues, the Chrome team is working to make Gemini (nano) part of the Chrome browser. The idea is to download the models in the browser when you have connectivity and use them directly from the browser, offline, if needed.

So let's see how it works 🚀

*These features are on the building; most are available only under the Canary version and feature flag. If you are interested, you can find all the info at this* [*link*](https://developer.chrome.com/docs/ai/built-in)*.*

## Features available

As you've already understood, only limited features are available; some are stable, and some are not.

Let's start by listing the features, and later, we will look at some of them.

The available API are:

- [Translator API](https://developer.chrome.com/docs/ai/translator-api)

- [Language Detector](https://developer.chrome.com/docs/ai/language-detection)

- [Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)

- [Writer API](https://developer.chrome.com/docs/ai/writer-api)

- [Rewriter API](https://developer.chrome.com/docs/ai/rewriter-api)

- [Prompt API](https://developer.chrome.com/docs/ai/prompt-api)

- [Proofreader API](https://developer.chrome.com/docs/ai/built-in-apis#proofreader_api)

Some are stable from Chrome 138, and some are available for local experiments; you can check out the status of the APIs [here](https://developer.chrome.com/docs/ai/built-in-apis#proofreader_api) so you can be sure about the current situation when you read this post.

As you can see, the APIs' names are fantastic, and they explain their behaviour.

If you want to try these features, start from [this documentation](https://developer.chrome.com/docs/ai/get-started) section. Unfortunately, you must enable the features through the configurations, so follow these steps to get a Chrome instance ready to run AI models directly from your laptop.

Before closing this chapter, here is a quick reflection on these APIs. As you can notice, all of them work with text; some produce, some detect, some translate, and so on. So, for now, you can work with text and not produce images or videos from the browser, but it's a great starting point!

## Let's talk about features

### Language Detector

The language detector API is one of the features available from Chrome 138. It allows you to detect the language of a specific word or phrase.

It returns a list of possible languages with the confidence score for that language. This means that we need to make a strategy to choose the best language for our application, but in most cases, the language with the best score is the best one for our application!

**How it works!**

One thing to do is check if the API is available or not to prevent errors.

To do that, you must check the `self` object.

```typescript
if ('LanguageDetector' in self) {
  // Language Detector Available
}
```

Then, you must check if the model is already available in your browser or if you need to download it.

```typescript
const availability = await LanguageDetector.availability();
```

This result can have four possible values:

- `"unavailable"`: The requested options are unsupported, or the model cannot be prompted.

- `"downloadable"`: The request is supported, but you need to download additional files before creating a session. These downloads may include the language model or fine-tuning.

- `"downloading"`: The request is supported and a download is ongoing, which must be completed before creating a session..

- `"available"`: The request is supported, and you can create a session.

*This method is pretty much the same for all APIs. Following this flow, you can check if a specific API is available.*

When you reach the `available` status, you are finally ready to work with the **LanguageDetector** API, and you can create an instance of it by following the next code.

```typescript
const instance = await LanguageDetector.create();
const result = await instance.detect('Hello world!');

// result = [{
//   detectedLanguage: 'en',
//   confidence: 0.9973934888839722
// }];
```

As you can see, this API is straightforward and pretty easy to learn.\
With that, you have completed your first learning about AI in Chrome with Gemini Nano, and it’s time to move on to another fantastic API!

*N.B. If you are working with* [*TypeScript*](https://www.typescriptlang.org/) *and want to get the best DX possible, a types package that simplifies your work and enables IntelliSense for these APIs exists.* `@types/dom-chromium-ai` *This is the name of the package, and we have to thank you,* [*Christian Liebel*](https://github.com/christianliebel) *and* [*Thomas Steiner*](https://github.com/tomayac)*, for it.*

### Translator API

Translator API is one of the most common features for an AI. It's pretty simple: you send a text, and you will receive the text translated. This API is available from Chrome 138.\
But let’s see how it works.

**How it works!**

First, you must check if the API is available in the browser.

```typescript
if ('Translator' in self) {
  // Translator API available
}
```

If the API is enabled, you must check if the languages you need for source and target are available.\
To do that, you must use the `availability` method exposed by the `Translator` object.

```typescript
const translatorCapabilities = await Translator.availability({
  sourceLanguage: 'en',
  targetLanguage: 'it',
});
```

The result of this method can have four different values:

- `"unavailable"`: The implementation does not support translation of the given languages.

- `"downloadable"`: The implementation supports translation of the given languages, but a download is required to proceed. The download may be the browser model.

- `"downloading"`: The implementation supports translation of the given languages. The browser is finishing an ongoing download, as part of creating the associated object.

- `"available"`: The implementation supports translation of the given languages, and any required downloads are already complete.

Now, if you don’t receive `"unavailable"`, you can create the translator instance. This method will download the model for you if it hasn’t already been downloaded.

```typescript
const translator = await Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'it',
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  },
});
```

As you can see, using the `create` method, you can create your instance and pass your source and target languages. Then, using the `monitor` method, you can listen to the download progress and maybe create a loader for the user to provide feedback and create a better UX experience. Obviously, the promise will fail if something goes wrong during the download, and you must handle it.\
But if everything is okay, you can use the new `translator` instance to translate the text by using the `translate` method.

```typescript
await translator.translate('Where is the next bus stop, please?');
// Dov'è la prossima fermata dell'autobus, per favore?
```

One important thing to know about this API is that it processes messages sequentially. So, if you have many messages, you must keep this limitation in mind. Then, if you need to translate large amounts of text, it’s better to chunk it and create a [loading interface](https://web.dev/articles/building/a-loading-bar-component) as feedback for the user.

As is evident, this API is also straightforward. There are some methods to learn, and you can integrate this API into your applications by using them.

*Also, for this API, you can use the* `@types/dom-chromium-ai` *package to get a better experience with* [*TypeScript*](https://www.typescriptlang.org/)*.*

### Summarizer API

The last API you will meet in this article is the Summarizer API.\
This API enable you to summarise small or large text. Also, this API is available from Chrome 138 stable.

**How it works!**

First, you must check if the API is available in the browser.

```typescript
if ('Summarizer' in self) {
  // Summarizer API available
}
```

If the API is enabled, then you must check if the model is available.

```typescript
const summarizerCapabilities = await Summarizer.availability();
```

Also, for this method, the possible results can be:

- `"unavailable"` means that the implementation does not support the requested options.

- `"downloadable"` means that the implementation supports the requested options, but first, the browser has to download something, such as a model (in Chrome's case, Gemini Nano) or fine-tuning for the model.

- `"downloading"` means that the implementation supports the requested options, but it has to finish an ongoing download before it can proceed.

- `"available"` means that the implementation supports the requested options and the summarizer can proceed.

Now, if everything is okay, it’s time to create an instance of the Summarizer API.

```typescript
const summarizer = await Summarizer.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});
```

This `create` method exposes the `monitor` function to listen to the download progress and create a better experience for the user as well.\
This `create` method has different parameters you can pass to get different types of summaries or drive the summary's length.

These parameters are:

- `sharedContext`: Additional shared context that can help the summarizer.

- `type`: The type of summarisation, with the allowed values `key-points` (***default***), `tldr`, `teaser`, and `headline`. To learn more about them, follow this [link](https://developer.chrome.com/docs/ai/summarizer-api).

- `format`: The format of the summarisation, with the allowed values `markdown` (default) and `plain-text`.

- `length`: The length of the summarisation, with the allowed values `short`, `medium` (default), and `long`. The meanings of these lengths vary depending on the requested `type`.

It's important to know that parameters can’t be changed. So, once you create a new instance, if you need to modify the parameters, you must create a new instance.

Now that you have the summarizer instance, you can use it to summarise the text.

```typescript
const longText = 'Blah blah blah......';
const summary = await summarizer.summarize(longText, {
  context: 'This is a recipe.',
});
```

This API also exposes another method, just in case you want to stream the summary result and make it available “faster.”\
To do that, you need to use the `summarizeStreaming` method instead of the `summarize` one.

```typescript
const longText = 'Blah blah blah......';
const summary = await summarizer.summarizeStreaming(longText, {
  context: 'This is a recipe.',
});
```

And with that, you learnt the last AI API for Browsers available in this article 😃

Like the others, this API is straightforward too. There are just some methods to know, and you can integrate this API into your applications.

## Recipe Radar with AI App

I wrote a lot in this article, I know, but to let you know how these APIs work. I created a sample app with some recipes. On the detail page, you can see the Language Detector and Translator API in action. Therefore, on the search page, you can see the Summarizer API in action to summarise the recipe and return a summary of the recipe to the user.\
If you are interested in it, here is the link to the repo and to the website:

- *Github Repo*: <https://github.com/Puppo/recipe-radar-with-ai>

- *GitHub Page Website:* <https://puppo.github.io/recipe-radar-with-ai/>

Please don’t take too much care of the code structure. I vibe-coded the application's structure to reduce the time it took to create, and I spent more time on the AI feature and its integration.

By the way, this application example implements and runs all these APIS on a website. It’s important to test in a Chrome version with these APIs available.

## Conclusion

Okay, it’s time to wrap up!\
In this article, you learn how to integrate AI inside the Browser without relying on any services or cloud providers.\
You learnt how to use Language Detector, Translator, and Summarizer API on the Web and what they look like.\
Remember that these new features are not available in all browsers, so please be careful when using them in production.

That’s it, folks. I hope you enjoyed the content. If so, please leave a comment or a reaction!

See you soon with other awesome content 🚀

Bye Bye 👋

*Google Cloud credits are provided for this project.* #AISprint
