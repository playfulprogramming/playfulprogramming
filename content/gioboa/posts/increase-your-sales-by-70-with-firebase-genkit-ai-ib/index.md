---
{
title: "Increase Your Sales by 70% with Firebase Genkit AI",
published: "2025-05-16T10:12:48Z",
tags: ["firebase", "webdev", "programming", "ai"],
description: "Imagine your online store as a giant warehouse. You've got tons of cool stuff, but customers are...",
originalLink: "https://https://dev.to/playfulprogramming/increase-your-sales-by-70-with-firebase-genkit-ai-ib",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Imagine your online store as a giant warehouse. You've got tons of cool stuff, but customers are wandering around aimlessly, hoping to stumble upon something they like. Without a decent recommendation system, that's basically what they're doing. They might use the search bar, but unless they know exactly what they want, they're probably missing out on hidden gems.

## The Classic Method: A Lot of Guesswork and Manual Labor

"Customers who buy socks also buy shoes", is that really helpful?
But what if they're into hiking and need special socks with arch support? The generic recommendation misses the mark.

Another approach is doing a manual categorisation. You'd spend ages tagging products with categories, hoping that a customer browsing "hiking boots" will somehow see those awesome arch-support socks.
It's a lot of work, and the connections are still pretty superficial.

You can count on bestsellers, but just because something is popular doesn't mean it's right for that specific customer.

## Personalized Recommendations with Genkit AI

It's like giving to your site a super-smart brain that understands your customers' needs and desires.

Your platform has a goldmine of data. You should extract those information from your site to know everything about past user interaction in your app. Who bought what, when, where, their demographics, their payment method, their return behavior... All the juicy details.

Then you can use Genkit AI, here is a good starting point to create a great recommendation system.

### FILE: .env

```javascript
GEMINI_API_KEY="your-api-key-here"
```

### FILE: dataset.csv

(this is an example, you should extract more data)

```csv

user_id,age,gender,location,date,product_id,product_category,product_name,brand,price,quantity,rating,payment_method,shipping_country,marketing_channel,returned,purchase_value,conversion
1,46,Other,New York,2023-05-09 02:46:38,288,Food,Artisan Cheese,BrandB,33.723858743763415,1,4.0,Credit Card,US,Social Media,False,33.723858743763415,False
2,65,Male,Sydney,2023-05-23 00:04:01,359,Haircare,Hair Spray,BrandA,20.20147327393537,1,3.0,Other,AU,Social Media,False,20.20147327393537,True
3,36,Female,New York,2023-04-05 03:32:17,283,Tech,Phone Case,BrandE,103.18632501714615,2,2.0,Credit Card,US,Social Media,False,206.3726500342923,True
4,37,Other,Los Angeles,2023-05-29 19:46:28,253,Haircare,Conditioner,BrandC,22.715738548774425,2,4.0,PayPal,US,Email,False,45.43147709754885,False
```

### FILE: index.ts

```typescript
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { genkit } from 'genkit';
import * as z from 'zod';

const OutputSchema = z.object({
	products: z.array(z.object({ productId: z.string(), name: z.string(), reason: z.string() })),
});

const ai = genkit({ plugins: [googleAI()], model: gemini20Flash });

(async () => {
	const personalInfo = {
		location: 'Berlin',age: '15',gender: 'Female',
		interests: 'Tv Series', prevOrders: 'Premium Olive Oil, Exotic Spices',
	};
	const dataset = readFileSync('./data/dataset.csv', 'utf-8');

	const { output } = await ai.generate({
		system: `You are an e-commerce personal assistant. And these are the data you collected ${dataset}.`,
		prompt: [{text: `Here is my info ${personalInfo}. Can you suggest me at least five product to buy?`,},],
		output: { schema: OutputSchema },
	});
	console.log(output);
})();


// OUTPUT BASED ON MY DATASET

{
  products: [
    {
      name: 'Lipstick',
      productId: '312',
      reason: 'Popular makeup item, adds color and definition to lips'
    },
    {
      name: 'Scented Candle',
      productId: '114',
      reason: 'Creates a relaxing and pleasant ambiance at home'
    },
    {
      name: 'Hair Mask',
      productId: '215',
      reason: 'Deeply conditions and nourishes hair for added shine and health'
    },
    {
      name: 'Sunscreen',
      productId: '478',
      reason: 'Protects skin from harmful UV rays, preventing sun damage'
    },
    {
      name: 'Smart Watch',
      productId: '436',
      reason: 'Combines technology and convenience, tracks fitness and provides notifications'
    }
  ]
}
```

The `system prompt` is where you define the AI's "persona". In this case, it's an "e-commerce personal assistant" that is getting its data from the `dataset.csv` file.

The `prompt` takes the customer's information (location, age, gender, interests, past orders) and asks the AI to suggest products.

The `Output Schema` ensures that the AI gives you the information in a structured format, so you can use it easily in your e-commerce system. This is also useful for avoiding hallucinations because you are providing guidance to the AI. (I wrote about this [here](https://https://dev.to/playfulprogramming/a-special-secret-to-prevent-ai-hallucinations-with-a-practical-google-genkit-ai-example-3d0o))

The AI can then suggest products based on a holistic view of the customer and products. Based on the customer's interest.

> It's not just "people who bought X also bought Y." It's about understanding individual needs and desires.

This way saves time and effort, no more endless tagging and manual rule-setting. The AI does the heavy lifting and when customers find products they actually want, they're more likely to buy.

---

Genkit AI revolutionizes recommendations by moving beyond generic suggestions. By analyzing customer data and product attributes, it creates personalized experiences. This leads to increased sales, customer satisfaction, and efficient use of resources, making online shopping feel less like a warehouse and more like a curated boutique.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

<!-- ::user id="gioboa" -->
