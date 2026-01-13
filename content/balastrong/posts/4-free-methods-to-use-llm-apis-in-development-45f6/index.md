---
{
title: "4 Free Methods to use LLM APIs in Development",
published: "2025-09-09T10:16:55Z",
tags: ["ai", "llm", "node", "github"],
description: "You might be in the situation I was the other day: I wanted to develop a small AI feature for...",
originalLink: "https://leonardomontini.dev/free-llm-api/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

You might be in the situation I was the other day: I wanted to develop a small AI feature for learning purposes on my [side project](confhub.tech), but I didn’t want to pay for an api key.

So I did some research: let me show you 4 different ways I found to do that for free, with also the possibility of switching between a wide range of models, so you can pick the best for your usecase.

My first attempt obviously went to Ollama to run models locally, then I had a go at the free tiers of some hosted providers.

You can hear me talking about those and showing some steps and demos in this [YouTube video](https://youtu.be/87HrBpOZeUE) or you can keep reading below.

<iframe src="https://www.youtube.com/watch?v=87HrBpOZeUE"></iframe>

## Code setup

Let's begin with some good news: all the four methods work with the exact same code as luckily they all support the OpenAI SDK. The only change will be setting the right values in your environment variables.

If you're curious you can find [here the actual code](https://github.com/Balastrong/confhub/blob/main/src/services/ai.api.ts) I'm using in my demo, including the system prompt and my silly attemps to force the model to behave and answer as I want.

Anyway, I don't want to add any unnecessary complexity to this article so I'll just show a summary that you can use as a starting point:

```ts
import OpenAI from 'openai';

const token = process.env.LLM_TOKEN!;
const endpoint = process.env.LLM_ENDPOINT!;
const model = process.env.LLM_MODEL!;

export async function prompt(userPrompt: string) {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userPrompt },
    ],
    model: model,
  });

  console.log(response.choices[0].message.content);
}
```

## 1. Ollama - Run models locally

- **Homepage**: https://ollama.com/

That's the first thing I tried as I wanted to see how it works to run models locally. Long story short: they made it so easy it's like pulling docker images. There's literally a `ollama pull` command.

You can install the app from the website then you'll find the `ollama` command line tool in your path. Actually when I did it a couple of weeks ago the app was almost empty, now I see they started adding features like a UI where you can chat with your installed models (in addition to talking with the in the terminal) and some other nice touches.

At this point you might want to have some models, right? You can find a list in their [Models](https://ollama.com/search) page then open a terminal and run `ollama pull <model-name>` to download it. Before picking a model have a look at the size (might be many GB) and get ready to have slow responses if your machine is not powerful enough.

You can see at any time what models you have with `ollama ls`.

Back to our quest of learning how to use LLMs in our code, now that you have Ollama up and running with at least a model downloaded, you can set these values for your environment variables:

```bash
LLM_TOKEN=ollama
LLM_ENDPOINT=http://localhost:11434/v1
LLM_MODEL=<your_downloaded_model>
```

You're good to go!

## 2. GitHub Models - Hosted

- **Homepage**: https://github.com/marketplace?type=models
- **Free Tier**: https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models#rate-limits

Ollama was fun but I wasn't using really smart models and at some point I wanted to push my AI feature to production so... I couldn't just say "works on my machine with Ollama", I had to find a hosted solution. For free.

The first service I tried was GitHub Models. It basically offers some of the most recent models with a free tier (you don't even need a Copilot subscription) that you can test already in the browser.

You can also use them in your app and you just need a single API key: a GitHub Personal Access Token (PAT).

You can generate one from your developer settings, but on the Models marketplace you'll find a direct link to make it literally one click. It should also work from here: [https://github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new?description=Used+to+call+GitHub+Models+APIs+to+easily+run+LLMs%3A+https%3A%2F%2Fdocs.github.com%2Fgithub-models%2Fquickstart%23step-2-make-an-api-call\&name=GitHub+Models+token\&user_models=read)

Once you have the token, set it in your environment variables and again you're good to go!

```bash
LLM_TOKEN=<your_github_pat>
LLM_ENDPOINT=https://models.github.ai/inference
LLM_MODEL=<model_name>
```

In my app I just set these variables on Netlify to make the AI feature work on my production site.

## 3. Open Router - Hosted

- **Homepage**: https://openrouter.ai/
- **Free Tier**: https://openrouter.ai/docs/api-reference/limits

I was happy with GitHub Models but for the sake of a good research I wanted to try multiple providers. Open Router is another hosted solution that offers a free tier but on some selected models.

You can find them all by [filtering the list](https://openrouter.ai/models?q=%3Afree) for `:free` in the model name.

Once you sign up you can get your API Key from the [settings](https://openrouter.ai/settings/keys) and put it in your environment variables as usual:

```bash
LLM_TOKEN=<your_open_router_api_key>
LLM_ENDPOINT=https://openrouter.ai/api/v1
LLM_MODEL=<model_name:free>
```

## 4. Groq - Hosted

- **Homepage**: https://groq.com/
- **Free Tier**: https://console.groq.com/docs/rate-limits#rate-limits

The first thing I said when a colleague told me about Groq is "wait isn't it called Grok?" and no it wasn't a typo, they're two very different things.

Groq is a hardware company that runs LLMs on their own chips.

Similarly to Open Router, with a Groq API key you can access a selection of supported models and switch between them by changing the model name in your environment variables.

You can get the key after signing up, but you shouldn't be surprised now after reading the previous sections. Luckily, most of these providers work in a very similar way.

```bash
LLM_TOKEN=<your_groq_api_key>
LLM_ENDPOINT=https://api.groq.com/openai/v1
LLM_MODEL=<model_name>
```

## Bonus

These approaches I tried were all giving the possiblity to switch between different models, which is great to find the best one for your usecase.

In any case, all LLMs providers usually have their own free tiers. There's plenty of options you can pick directly from the vendor, be it OpenAI, Anthropic, Google, etc.

When it's time to go to production... well, that's another story.

What are you using for development? And what are you using in production? Let's discuss in the comments!

---

Thanks for reading this article, I hope you found it interesting!

Let's connect more: https://leonardomontini.dev/newsletter

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
