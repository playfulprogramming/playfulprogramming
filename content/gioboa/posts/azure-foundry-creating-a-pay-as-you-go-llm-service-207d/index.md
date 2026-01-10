---
{
title: "Azure Foundry: Creating a Pay-As-You-Go LLM Service",
published: "2025-08-01T10:52:24Z",
edited: "2025-08-01T10:52:41Z",
tags: ["azure", "ai", "microsoft", "programming"],
description: "Large Language Models (LLMs) offer incredible potential for businesses, but managing the costs...",
originalLink: "https://dev.to/this-is-learning/azure-foundry-creating-a-pay-as-you-go-llm-service-207d",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Large Language Models (LLMs) offer incredible potential for businesses, but managing the costs associated with these powerful tools can be complex.

[Azure Foundry](https://ai.azure.com/) provides a robust platform to not only deploy and manage LLMs, but also to create a pay-as-you-go service model for your customers.

This approach allows you to offer flexible access to various LLMs while ensuring cost transparency and control.

## Real world scenario

Imagine you want to offer your customers a series of APIs.
Azure Foundry allows you to expose different LLMs through distinct endpoints. This means you can offer a variety of models, each potentially suited for different tasks or use cases, and price them accordingly.

## Accurate tracking of LLM usage

The key to a successful pay-as-you-go model is accurate tracking of LLM usage.

> Azure Foundry provides detailed information about token usage for each request.

By analysing the LLM's response, specifically the `usage` section of the response, you can determine the cost associated with each API call. So you can define your pricing based on these values.

```JSON
{
  [...]
  "usage": {
    "completion_tokens": 148,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 128,
      "rejected_prediction_tokens": 0
    },
    "prompt_tokens": 54,
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0
    },
    "total_tokens": 202
  }
  [...]
}
```

You could charge based on the `total_tokens` used, or create more granular pricing based on the type of tokens (e.g., charging differently for `completion_tokens` vs. `prompt_tokens`).


## Custom Pricing Plans

With the token usage data, you can create various pricing plans to cater to different customer needs. For example, you might offer a basic plan with a lower price per token but limited access to specific models, and a premium plan with higher per-token cost but access to more powerful LLMs.

Azure offers flexibility, allowing customers to only pay for the resources they consume and helps you with a robust infrastructure ensures `scalability`, so your service can adapt to fluctuating demand without compromising performance.

All these features make Azure the perfect solution for your business.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

{% embed https://dev.to/gioboa %}

