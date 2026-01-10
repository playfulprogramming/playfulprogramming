---
{
title: "Firebase hybrid on-device with Angular",
published: "2025-07-11T13:18:03Z",
edited: "2025-07-11T13:19:22Z",
tags: ["firebase", "angular", "ai", "programming"],
description: "Some of you asked me to create an example of integration between Angular and one of Firebase's latest...",
originalLink: "https://dev.to/this-is-angular/firebase-hybrid-on-device-with-angular-50o9",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Some of you asked me to create an example of integration between [Angular](https://angular.dev/) and one of Firebase's latest features: "hybrid on-device".

The core idea is to leverage the power of both cloud-based AI models and on-device (local) AI processing within a single application. The [Firebase](https://firebase.google.com/) AI SDK provides this capability, allowing you to prioritize running AI tasks directly on the user's device whenever possible, while seamlessly falling back to cloud processing if the on-device model is unavailable or insufficient.

## The Advantages

- **Reduced Latency**: On-device processing eliminates network latency, leading to faster response times and a more responsive user experience. Imagine a situation where the user has a slow or unstable internet connection. On-device AI ensures the application can still function and provide value.

- **Offline Functionality**: When the application is entirely offline, on-device AI models can still operate, providing a core set of AI features.

- **Privacy**: Processing data locally minimizes data transfer to the cloud, which can be beneficial in applications dealing with sensitive information.

- **Cost Savings**: Offloading processing to the device can reduce cloud costs associated with AI inference.

## Let's jump to the code

This is an example of an Angular service that will allow us to use the Firebase API.

> *Important:* Replace the placeholder configuration with your actual Firebase project credentials.

```typescript
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private model: any;

  constructor() {
    const firebaseConfig = {
      // your Firebase config here
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
    this.model = getGenerativeModel(ai, {
      mode: 'prefer_on_device',
      model: 'gemini-2.5-flash',
    });
  }

  async generateTextFromImage(prompt: string, file: File): Promise<string> {
    try {
      const imagePart = await this.fileToGenerativePart(file);
      const result = await this.model.generateContentStream([
        prompt,
        imagePart,
      ]);

      let aggregatedResponse = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        aggregatedResponse += chunkText;
      }
      return aggregatedResponse;
    } catch (err: any) {
      console.error(err.name, err.message);
      throw err;
    }
  }

  private async fileToGenerativePart(file: File): Promise<any> {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve((reader.result as string).split(',')[1] || '');
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }
}
```

## Usage

Here is the code to use the AI service.

```html
[...]
<input type="file" (change)="imageRecognition($event)" />
[...]
```

```typescript
[...]
async imageRecognition(event: any) {
  this.imageResponse = '';
  const file: File = event.target.files[0];
  if (file) {
    try {
      this.imageResponse = await this.aiService.generateTextFromImage(
        "Can you describe this image?",file
      );
    } catch (error: any) {
      this.imageResponse = `Error: ${error.message}`;
    }
  }
}
[...]
```

The service initializes Firebase with your project's configuration.  `getAI()` and `getGenerativeModel()` are the entry points to Firebase AI functionality.  `getAI()` initializes the AI service with options to specify the backend, and `getGenerativeModel()` creates a model instance.  The `mode: 'prefer_on_device'` configuration is *crucial*. It instructs the SDK to try to use the on-device model if it's available.
`generateTextFromImage()` wraps the calls to the GenerativeModel (Gemini) to process text and images, respectively. They handle the core AI processing logic and manage the streaming responses from the model.

**How it Works in Practice**

When `imageRecognition()` is called, the `AiService` attempts to use the on-device Gemini model first. If the model is available and meets the processing requirements, the AI generation happens locally. If the on-device model is not available (e.g., due to device limitations, model not yet downloaded, or the feature being unavailable), the SDK automatically falls back to using the cloud-based Gemini model.

---

This example provides a foundational understanding of hybrid on-device AI with Firebase and Angular. By combining the strengths of both cloud and on-device processing, you can create more responsive, robust, and user-friendly applications. Remember to handle API keys securely, implement thorough error handling, and monitor resource usage to optimize performance and costs.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

{% embed https://dev.to/gioboa %}
