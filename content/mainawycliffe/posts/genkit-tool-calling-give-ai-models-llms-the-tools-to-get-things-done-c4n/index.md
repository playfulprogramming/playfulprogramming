---
{
title: "Genkit Tool Calling: Give AI Models (LLMs) the Tools to Get Things Done",
published: "2025-06-16T13:27:38Z",
tags: ["ai", "tutorial", "javascript", "gemini"],
description: "AI Models are taking over the world, and we are all looking for ways to use them to solve different...",
originalLink: "https://newsletter.unstacked.dev/p/genkit-tool-calling-give-your-ai",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

AI Models are taking over the world, and we are all looking for ways to use them to solve different problems. One common issue with **Large Language Models** (LLMs) is their training data, in that they only know what they were trained on. This is great when we want them to answer general questions, but not so useful when we want them to answer questions based on private data, i.e., customer data.

There are a number of ways to solve this issue other than training your own AI models. One of the options is **Retrieval-Augmented Generation** **(RAG)**, where we ground the LLMs based on external data to improve the accuracy and relevance of the responses.

The other option is **Function Calling**, which is the subject of today’s article. **Function calling**—known as **tool calling** in Genkit—involves giving AI Models a structured way to interact with your application/system or external data sources (APIs) to accomplish various tasks and ensuring it has up-to-date data. The AI Model will then call those functions we provide to accomplish various tasks, such as to fetch user data, create a ticket for the user, and so on.

To demonstrate this, we will be building a simple customer support agent that will answer questions from customers, and the AI Model will use the tools we provide to determine which tools it needs to call to accomplish the customer’s goal.

If you are new to Genkit, please check out the official [docs](https://genkit.dev/docs/get-started/) on how to get started, as this is beyond the scope of this post.

**Please subscribe for future posts like this:**

Subscribed

## Defining Genkit Tools

In Genkit, tools are special functions that contain information about what they are meant to accomplish and the means to accomplish the intended task — a function.

A tool in Genkit is defined using the `defineTool` method which accepts two arguments: a config object and a function.

```ts
ai.defineTool(
  {
    name: 'toolName',
    description: 'Tool Description',
  },
  async ({ customerId }) => {
    // implementation to fetch customer details
  },
);
```

> **Please Note:**
>
> The `ai` instance is created by calling genkit function, passing in a number of configurations such as plugins for the AI Model you want to use, and the default model. For more information, checkout the Genkit documentation, [here](https://genkit.dev/).
>
> ```ts
> import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
> import { genkit } from 'genkit';
>
> const ai = genkit({
>   plugins: [googleAI()],
>   model: gemini20Flash,
> });
> ```

**IMPORTANT!**

Genkit tool calling support depends on the model, the model API, and the Genkit plugin for the model. Not all models support tool calling. Please consult the documentation to ensure that the model you intend to use supports Genkit tool calling.

For this post, we will be using **Gemini 2.0 Flash**, which supports tool calling.

A config is where we describe what the tool does; we give a descriptive name and a description that describes the tool's intended purpose. We can also include input and output JSON schemas (supports [zod](https://zod.dev/) out of the box) among other options. Only the description and name are required.

The second argument is the function where we implement the tool’s objective. For instance, inside the function, we can make a DB call, an API call or any other deterministic operation, based on the tool’s intended objective.

For instance, in our case, we might want to define a tool to fetch customer information, given a customer ID. In this case, we would define a `GetCustomerDetails` tool that looks up the customer details from our database.

Please note we are providing an input and output schema to ensure data is returned in a very specific format, all the time, and we will ensure we provide a good description of our tool.

```ts
const getCustomerDetailsTool = ai.defineTool(
  {
    name: 'GetCustomerDetails',
    description: 'Fetches details of a customer by ID',
    inputSchema: z.object({
      customerId: z.string().describe('The ID of the customer to fetch details for'),
    }),
    outputSchema: customerSchema,
  },
  async ({ customerId }) => {
    // This could be a database call or an API request in a real application.
    const customer = customers.find((customer) => customer.id === customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    return customer;
  },
);
```

Now that we have created our first tool, we will need to pass it to the AI Model so it can use it, if need be, based on the customer’s question. In Genkit, there are several ways of achieving this, depending on whether we are using a flow, a prompt, or we are invoking the generate method directly inside the function.

When calling the `generate` method, passing the tool, in the tools’ options, alongside the prompt as shown below:

```ts
const { text } = await ai.generate({
  prompt: `
  You are an eCommerce Customer Service AI.
  You can answer questions about customers and their orders.
  You have access to the following tools:
  - Get Customer Details: Fetches details of a customer by ID.
  - Get Customer Orders: Fetches orders for a specific customer, by customer ID.
  Use the tools to answer questions about customers and their orders.
  If you need to fetch customer details, use the Get Customer Details tool.
  If you need to fetch customer orders, use the Get Customer Orders tool.
  If you cannot answer a question, respond with "I don't know" or "I cannot answer that question".

  When answering questions, use the following format:
  - If the question is about customer details, provide the customer's name, email, and phone number.
  - If the question is about customer orders, provide the number of orders placed and details of the most recent order.
  - If the question is about a product, provide the product name, price, and description.

  Use all tools to fetch the necessary information, do not return IDs, instead return the relevant details the user is interested in.

  Example questions:
  - What is the email address of customer with ID 1?
  - How many orders has customer with ID 2 placed?
  
  The customer id is ${customerID} and the question is: ${question}
  `,
  tools: [getCustomerDetailsTool],
  toolChoice: 'auto',
});
```

> As you can see, our prompt is rather detailed, as we have to clearly instruct the AI Model to behave exactly the way we want, and reduce instances of it hallucinating. In cases where it has no answer, we want the AI model to say it doesn’t know, instead of hallucinating.

We can put the above `generate` method call in a function, and call it as shown below. On top of that, we are passing our tool — `getCustomerDetailsTool` — in the tools section.

```ts
async function run() {
  const { text } = await ai.generate(...);
  // log our response
  console.log(text);
}

run();
```

However, running the above can be very difficult, as you need to pass in the inputs in the correct format and almost impossible to debug. This is where **Genkit Developer UI** comes in.

### Genkit Developer UI

Genkit provides a developer UI where you can view, invoke and test your flows, prompts, tools, among others, in a very user-friendly UI, which enhances the developer experience.

> To launch the Genkit Developer UI, you can do so by running the following command:
>
> ```bash
> npx genkit start -- npx tsx --watch index.ts
> ```
>
> In the above command, genkit is the genkit cli, and [tsx](https://tsx.is/getting-started) is an NPM package for executing TypeScript files, without needing to transpile to Javascript first. `index.ts` is the file which contains our code, and the entry file of our project.

Since we have already defined our tool, running the above command, we should be able to see it in the UI and even interact with it, as shown below:

#### Defining a Genkit Flow

For our case, we are going to switch to a flow. We will define a flow using the `defineFlow` method, which takes two arguments — a config object and a function to be executed when the flow is called.

For the flow config object, we will set the name of the flow, the input and output schema, keeping things simple for now. In the function, we will call the generate method, just like we previously did. We will return the text, so we can see the response of the AI Model in the UI.

```ts
const assistant = ai.defineFlow(
  {
    name: 'eCommerceCustomerServiceAI',
    inputSchema: z.object({
      customerID: z.string().describe('The ID of the customer to fetch details for'),
      prompt: z.string().describe('The question or request for customer service'),
    }),
    outputSchema: z.string().describe('The response from the AI assistant'),
  },
  async ({ customerID, prompt }) => {
    const { text } = await ai.generate({
      prompt: `
      You are an eCommerce Customer Service AI.
      You can answer questions about customers and their orders.
      You have access to the following tools:
      - Get Customer Details: Fetches details of a customer by ID.
      - Get Customer Orders: Fetches orders for a specific customer, by customer ID.
      Use the tools to answer questions about customers and their orders.
      If you need to fetch customer details, use the Get Customer Details tool.
      If you need to fetch customer orders, use the Get Customer Orders tool.
      If you cannot answer a question, respond with "I don't know" or "I cannot answer that question".

      When answering questions, use the following format:
      - If the question is about customer details, provide the customer's name, email, and phone number.
      - If the question is about customer orders, provide the number of orders placed and details of the most recent order.
      - If the question is about a product, provide the product name, price, and description.

      Use all tools to fetch the necessary information, do not return IDs, instead return the relevant details the user is interested in.
  
      Example questions:
      - What is the email address of customer with ID 1?
      - How many orders has customer with ID 2 placed?
      
      The customer id is ${customerID} and the question is: ${prompt}
      `,
      tools: [getCustomerDetailsTool],
      toolChoice: 'auto',
    });

    return text;
  },
);
```

Our input schema will accept a customer ID and a question from the customer. The customer ID would likely come from the user session, while the question would be what the prompt the user entered in the chat input or system-generated, doesn't matter that much for this article.

Next, we can use the developer UI to test the flow and see if we can get some user details from our database (I know it’s fake).

You may be wondering, how do we know it’s working? The developer UI provides a stack trace to show you what exactly when during the execution, as shown below:

As you can see, this can be very helpful when troubleshooting your Genkit application and trying to figure out where things are going wrong. It will show you all the calls it made to the tools, including the inputs and outputs of each step.

### Finalising the Agent

As it currently stands, no customer will be asking about their names, but hopefully, you get the idea. The customer would likely want to know the status of their orders, among other things. We will add more tools for getting order information and product information, following the template we have seen earlier, as shown below:

```ts
const getCustomerOrdersTool = ai.defineTool(
  {
    name: 'GetCustomerOrders',
    description: 'Fetches orders for a specific customer, by customer ID',
    inputSchema: z.object({
      customerId: z.string().describe('The ID of the customer to fetch orders for'),
    }),
    outputSchema: z.array(orderSchema),
  },
  async ({ customerId }) => {
    return orders.filter((order) => order.customerId === customerId);
  },
);

const getProductDetailsTool = ai.defineTool(
  {
    name: 'GetProductDetails',
    description: 'Fetches product details by product ID',
    inputSchema: z.object({
      productId: z.string().describe('The ID of the product to fetch details for'),
    }),
    outputSchema: productSchema,
  },
  async ({ productId }) => {
    const product = products.find((product) => product.id === productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return product;
  },
);
```

And then, we will add the above tools to the tools section, in the generate method, next to the one we already have, as shown below:

```ts
const assistant = ai.defineFlow(
  {
    // ... nothing changes here
  },
  async ({ customerID, prompt }) => {
    const { text } = await ai.generate({
      prompt: `...`,
      tools: [
        getCustomerDetailsTool, 
        // we add the tools here
        getCustomerOrdersTool, 
        getProductDetailsTool
      ],
    });

    return text;
  },
);
```

And finally, we can use the Genkit Developer UI to test whether our flow and tools work.

As you can see, the AI model — in our case, Gemini — figures out the status of the customers’ orders and associates them with products by utilising the different tools we provided. While the prompt can be improved to allow the customer not to be very specific, and still accomplish the same goals, hopefully, you get the idea of how we can give LLMs the ability to interact with our systems to accomplish different goals.

If you are interested, you can find the above source code [here](https://github.com/mainawycliffe/genkit-tool-calling).

## Conclussion

In this post, we discussed **function calling** that allows you to give AI models access to your applications and system, so that they can get things done. We also looked at the Genkit Developer UI, for the purpose of testing and debugging our flows, tools and applications we are building on top of AI models.

I hope this article gave you ideas on how you can use Genkit to build AI agents to help accomplish various tasks on behalf of customers, and if you have any questions, please feel free to put them in the comment section below.

Until next time, keep on learning.

---

## **Ready to Move From AI Hype to Real-World Results?**

At Unstacked Labs, we specialise in building practical AI agents, like the one in this article, that automate complex workflows and solve real business problems.

[Let's discuss your company needs](https://unstacked.dev/)
