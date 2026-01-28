---
{
title: "Unleashing Creativity: Gemini Image Generation with Angular",
published: "2025-09-19T20:00:19Z",
edited: "2025-10-08T05:24:24Z",
tags: ["ai", "angular", "webdev", "gemini"],
description: "In the ever-evolving landscape of web development, captivating visuals are no longer a luxury but a...",
originalLink: "https://dev.to/this-is-angular/unleashing-creativity-gemini-image-generation-with-angular-4ola",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In the ever-evolving landscape of web development, captivating visuals are no longer a luxury but a necessity. Imagine being able to dynamically generate stunning images, edit existing ones with natural language, and even weave illustrations seamlessly into your content – all from your web application.

With [Google's Gemini](https://gemini.google.com/) models, this powerful capability is now within reach, empowering developers to build truly immersive and interactive experiences.

## Gemini for Image Generation

Gemini leverages its vast world knowledge to generate contextually relevant images, making your visuals more meaningful. Unlike models that only produce images, Gemini can seamlessly blend text and images in a single response, perfect for illustrated guides, stories, and more. Gemini excels at generating images with accurate and high-quality text, ideal for logos, banners, or captioned illustrations.

## Image Generation with Angular and @google/genai

The most straightforward way to create images is by providing a text prompt.

You can startup an Angular application with the [Angular CLI](https://angular.dev/tools/cli/setup-local#install-the-angular-cli) and install the necessary Google AI:

```bash
pnpm install @google/genai
```

Then, use Google AI in your Angular application.
This is a ready to copy component to start and play with Angular and AI.

```typescript
import { Component, signal } from '@angular/core';
import { GeneratedImage, GoogleGenAI } from '@google/genai';

@Component({
  selector: 'app-root',
  template: `
    <h1>Generate Images</h1>
    <input
      type="text"
      (keydown.enter)="send(input)"
      #input
      value="Teddy bear under the Eiffel Tower"
      style="width: 100%"
    />

    @if (pending()) {
    <div>loading...</div>
    } @for (item of generatedImages(); track item) {
    <img [src]="'data:image/png;base64,' + item.image?.imageBytes" alt="" />
    }
  `,
})
export class App {
  ai = new GoogleGenAI({ apiKey: 'YOUR_API_KEY_HERE' });
  pending = signal(false);
  generatedImages = signal<GeneratedImage[]>([]);

  async send(input: HTMLInputElement) {
    this.generatedImages.set([]);
    this.pending.set(true);

    const response = await this.ai.models.generateImages({
      model: 'imagen-4.0-generate-preview-06-06',
      prompt: input.value,
      config: {
        aspectRatio: '16:9',
        numberOfImages: 1,
      },
    });
    this.generatedImages.set(response.generatedImages || []);

    this.pending.set(false);
    input.value = '';
  }
}
```

This Angular component uses Google's Generative AI to create images from text prompts. It imports necessary modules from `@angular/core` and `@google/genai`. The component initializes a `GoogleGenAI` object with an API key and uses signals for reactive state management: `pending` to indicate loading status and `generatedImages` to store the generated images.

The `send` function is triggered when the user enters a text prompt. It sets `pending` to true, clears any previous images, and calls the `ai.models.generateImages` method with the prompt and configuration like aspect ratio and number of images. The generated images are then stored in the `generatedImages` signal, the loading indicator is stopped, and the input field is cleared. The template displays a loading message while `pending` is true and then iterates through the `generatedImages` to display each image using its base64 encoded data.

---

Real-world use cases for Gemini-powered image generation are diverse and impactful.

E-commerce platforms can use it to dynamically generate product images with customized backgrounds or personalized captions, enhancing the shopping experience. Educational websites can create illustrated guides and interactive learning materials, making complex concepts more accessible and engaging.

Marketing teams can leverage Gemini to generate targeted ad creatives with relevant visuals and compelling text, improving campaign performance. Furthermore, news outlets can use it to create visually appealing summaries of articles, and social media platforms can enable users to generate personalized avatars or visual content for their posts.

> Gemini's ability to understand context and generate accurate, high-quality images empowers developers to build innovative solutions that cater to the specific needs of their users, transforming the way we interact with digital content.

---

In conclusion, Gemini models offer a revolutionary approach to integrating dynamic visuals into web applications. By leveraging Gemini's vast knowledge and ability to blend text and images, developers can create more engaging and interactive user experiences. The seamless integration with frameworks like Angular, through libraries such as `@google/genai`, simplifies the process of generating and manipulating images directly within the application.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

<!-- ::user id="gioboa" -->
