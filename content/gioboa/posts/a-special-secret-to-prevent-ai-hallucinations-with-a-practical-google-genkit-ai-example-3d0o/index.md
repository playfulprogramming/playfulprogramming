---
{
title: "A special secret to prevent AI hallucinations with a practical Google genkit-ai example!",
published: "2025-05-08T12:08:22Z",
tags: ["ai", "node", "firebase", "programming"],
description: "Generative AI models possess the remarkable ability to generate human-quality text, code, images, and...",
originalLink: "https://dev.to/this-is-learning/a-special-secret-to-prevent-ai-hallucinations-with-a-practical-google-genkit-ai-example-3d0o",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Generative AI models possess the remarkable ability to generate human-quality text, code, images, and more, opening up a vast array of possibilities across diverse industries.
However, this power comes with a significant caveat:
the potential for "hallucinations".

> AI hallucinations refer to instances where these models produce outputs that are factually incorrect, nonsensical, or completely fabricated, despite appearing coherent and plausible.

This phenomenon poses a major challenge to the reliability and trustworthiness of generative AI, hindering its widespread adoption in critical applications.

## The Problem of AI Hallucinations

LLMs are trained on massive datasets of text and code, learning to identify patterns and relationships between words and concepts.  While this training enables them to generate impressive text, it doesn't necessarily equip them with a true understanding of the real world.

Here's a breakdown of the factors contributing to AI hallucinations:

- `Lack of Grounded Knowledge`: LLMs primarily learn from the statistical relationships within their training data. They don't possess real-world experience or access to a comprehensive knowledge base. This limitation can lead them to generate outputs that are internally consistent but factually incorrect.

- `Bias in Training Data`: The training data used to develop LLMs often contains biases, reflecting the prejudices and stereotypes present in the real world. These biases can inadvertently influence the model's output, leading to biased or discriminatory hallucinations.

- `Overfitting`: LLMs can sometimes overfit to their training data, memorizing specific patterns and examples rather than learning generalizable rules. This overfitting can result in the model generating outputs that are highly specific to the training data but not applicable to new or unseen situations.

- `Uncertainty and Ambiguity`: LLMs often struggle with uncertainty and ambiguity. When faced with a question or prompt that lacks clear information, they may resort to generating plausible but incorrect answers.

- `Probabilistic Nature`: LLMs operate on probabilistic principles. They predict the next word in a sequence based on the preceding words. This inherent uncertainty can lead to deviations from factual accuracy.

> The consequences of AI hallucinations can be significant, ranging from the spread of misinformation and the erosion of trust to financial losses and reputational damage. Therefore, developing strategies to mitigate hallucinations is crucial for the responsible and effective use of generative AI.

## Genkit-AI: Enhanced Reliability with Schemas

[Genkit-AI](https://firebase.google.com/docs/genkit) takes a proactive approach to addressing AI hallucinations by emphasizing the importance of structured outputs. Instead of allowing LLMs to generate free-form text, Genkit-AI encourages developers to define specific schemas for the desired output format. These schemas act as constraints, guiding the LLM to generate outputs that adhere to a predefined structure and data types.

By specifying the data types (e.g., string, number, boolean) and formats (e.g., date, email address, JSON) of the output fields, Genkit-AI ensures that the generated data conforms to the expected structure.

This constraint reduces the likelihood of the model generating invalid data and helps the LLM focus on extracting the relevant information and avoids generating irrelevant or speculative content.

By enforcing data types and formats, Genkit-AI helps ensure the integrity of the generated data. This is particularly important in applications where data accuracy is critical, such as financial analysis or medical diagnosis.

## Practical Node.js Example of Genkit-AI in Action

```
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import * as z from "zod";

const RecipeSchema = z.object({ ingredients: z.array(z.string()) });

const ai = genkit({ plugins: [googleAI()], model: gemini20Flash });
const { text } = await ai.generate({
  prompt: [{ text: "Can you describe me the ingredients for an italian carbonara?" },],
  output: { schema: RecipeSchema },
});
console.log(text);

// OUTPUT
// {
//   "ingredients": [
//     "Guanciale",
//     "Eggs",
//     "Pecorino Romano cheese",
//     "Black pepper",
//     "Pasta (Spaghetti or Rigatoni)"
//   ]
// }
```

The code uses Genkit and the Google AI plugin to interact with the Gemini 2.0 Flash model. It asks the model for the ingredients for a carbonara and then validates and returns the response in the specified JSON format using Zod. This approach ensures a structured and predictable output from the AI, making it easier to process the results in your application.

---

AI hallucinations are a significant challenge in the field of generative AI. However, by embracing structured outputs and schema definitions, frameworks like Genkit-AI offer a powerful solution. By constraining the behavior of LLMs and providing clear guidelines, output schemas help mitigate hallucinations, improve the reliability of AI-powered applications, and unlock the true potential of generative AI.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

<!-- ::user id="gioboa" -->
