---
{
title: "Firebase: Unleashing Hybrid On-Device Inference for Web Applications",
published: "2025-07-04T14:16:18Z",
tags: ["firebase", "webdev", "ai", "programming"],
description: "The realm of Artificial Intelligence (AI) is rapidly evolving, bringing with it exciting new...",
originalLink: "https://dev.to/this-is-learning/firebase-unleashing-hybrid-on-device-inference-for-web-applications-36pb",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

The realm of Artificial Intelligence (AI) is rapidly evolving, bringing with it exciting new possibilities for web application development. Firebase, Google's comprehensive platform for building web and mobile apps, is at the forefront of this revolution with its new experimental feature in the AI Logic client SDK for Web: `hybrid on-device inference`.

This innovative approach marries the power of on-device AI models with the reliability of cloud-hosted models, ensuring AI-powered features are consistently available to users, **regardless of their internet connectivity or device capabilities**.

> This hybrid approach leverages the advantages of on-device inference, falling back to the cloud when necessary, providing a robust and versatile solution for developers.

This capability unlocks a myriad of opportunities for developers to build intelligent applications that operate seamlessly on the user's device.

### Enhanced Privacy

On-device AI ensures sensitive data remains within the user's device, eliminating the need to transmit it to the cloud for processing. This is particularly crucial for applications handling personal or confidential information, such as healthcare apps or financial tools.

### Offline Availability

With on-device models, AI-powered features can function even without an internet connection. This is a game-changer for applications used in areas with limited or unreliable connectivity, like travel apps, educational tools, or field service applications.

### Cost Savings

On-device inference is available at no cost, reducing the application's operational expenses. This is especially beneficial for applications with high usage or those that require frequent AI processing.

## The Power of Hybrid Inference: Best of Both Worlds

The true innovation lies in the hybrid approach, combining on-device inference with cloud-hosted models. The Firebase AI Logic client SDK for Web's hybrid extension intelligently assesses on-device model availability using the proposed W3C Prompt API.

> If an on-device model like Gemini Nano is available, the SDK utilizes it for inference. If not, it seamlessly falls back to using Gemini models on the server. This ensures a consistent user experience across a wide range of devices and browsers.

## Code Implementation

Here is a clear and concise code example demonstrating how to implement hybrid inference in a web application:

```javascript
// Initialize the Gemini Developer API backend service
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance
// Set the mode, for example to use on-device model when possible
const model = getGenerativeModel(ai, { mode: "prefer_on_device" });

// run inference and log result
const result = await model.generateContent(
  "Write a story about a magic backpack."
);
console.log(result.response.text());
```

This code snippet highlights the simplicity of using the hybrid inference feature. By setting the `mode` parameter to `"prefer_on_device"`, the SDK automatically handles the logic of checking for on-device model availability and falling back to the cloud when necessary.

You can run inference only on device using `only_on_device`, this does not fallback to cloud-hosted models. On the other hand you can use `only_in_cloud` to do the opposite, only on the cloud-hosted models.

This granular control allows developers to tailor the AI processing behavior to their specific application requirements and user preferences.

---

Firebase AI Logic's hybrid on-device inference represents a significant leap forward in the development of AI-powered web applications. By combining the benefits of on-device models with the reliability of cloud-hosted services, developers can create intelligent applications that are more private, accessible, and cost-effective.
The future of web development is intelligent.
Firebase is paving the way!

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

<!-- ::user id="gioboa" -->
