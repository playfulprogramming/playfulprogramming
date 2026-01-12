---
{
title: "JavaScript FinalizationRegistry Unraveled: Memory Management Magic Explained!",
published: "2023-10-25T06:21:41Z",
tags: ["javascript", "memory", "leak"],
description: "Introduction   JavaScript's memory management can be tricky, especially when it comes to...",
originalLink: "https://blog.delpuppo.net/javascript-finalizationregistry-unraveled-memory-management-magic-explained",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "The JavaScript you don't know",
order: 6
}
---

## Introduction

JavaScript's memory management can be tricky, especially when it comes to handling objects that are no longer needed. As developers, we often need to deal with memory leaks and other issues that arise from improper garbage collection. Fortunately, JavaScript has introduced a new feature called the FinalizationRegistry to help us manage memory more efficiently. In this blog post, we'll dive deep into the world of FinalizationRegistry, exploring its purpose, how to use it, and real-world scenarios where it can come in handy.

## A Simple Example

To begin, let's take a look at a simple example to understand how FinalizationRegistry works. The FinalizationRegistry is an object that enables you to register a callback function that will be invoked when an object is garbage collected. Here's a basic example:

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Clean up: ${heldValue}`);
});

function createObject() {
  const obj = {id: 1};
  registry.register(obj, "Object 1");
}

createObject();
// After some time, when the object is garbage collected, the console will log: "Clean up: Object 1"
```

In this example, we create a new FinalizationRegistry and provide a callback function that logs a message when the registered object is garbage collected. We then create an object and register it with the registry.

## Real-World Scenario

Now, let's explore a more realistic scenario where FinalizationRegistry can be beneficial. Imagine we have a web application that allows users to upload and manipulate images. We use a third-party library to handle the image manipulation, and this library creates large objects that consume a significant amount of memory. To prevent memory leaks, we can use FinalizationRegistry to ensure that these objects are properly cleaned up when they are no longer needed.

```js
const imageRegistry = new FinalizationRegistry((imageData) => {
  console.log(`Cleaning up image data: ${imageData}`);
  // Perform additional cleanup tasks, such as releasing resources associated with imageData
});

function loadImage(imageUrl) {
  return fetch(imageUrl)
    .then((response) => response.blob())
    .then((imageBlob) => {
      const imageData = new ImageData(imageBlob);
      imageRegistry.register(imageData, `Image: ${imageUrl}`);
      return imageData;
    });
}

function manipulateImage(imageData) {
  // Use the third-party library to manipulate the image
}

loadImage('https://example.com/image.jpg')
  .then((imageData) => {
    manipulateImage(imageData);
    // After manipulation, the imageData object will eventually be garbage collected
  });
```

In this example, we create an imageRegistry using FinalizationRegistry and register the ImageData objects when they are loaded. When an ImageData object is garbage collected, the provided callback function will log a message and perform any additional cleanup tasks required.

## Considerations

While the FinalizationRegistry is a powerful tool for managing memory, there are some important considerations to keep in mind:

1. The timing of garbage collection is not guaranteed, and the callback function may not be invoked immediately after an object becomes unreachable.

2. FinalizationRegistry should not be used to manage critical resources, as it only provides a best-effort cleanup mechanism.

3. The held values in the registry should not be used to access the registered objects, as it may prevent them from being garbage collected.

To find out more don't waste my YouTube video on my [YouTube channel](https://www.youtube.com/@Puppo_92)

{% embed https://www.youtube.com/watch?v=3sgIFrjA61U %}

## Conclusion

The JavaScript FinalizationRegistry is a valuable addition to the language that can help developers manage memory more efficiently and prevent memory leaks. By understanding how it works and knowing when to use it, you can create more performant and memory-efficient applications. Keep in mind the considerations mentioned above, and happy coding!

*You can find the code of this article* [*here*](https://github.com/Puppo/javascript-you-dont-know/tree/06-finalizationregistry)*.*

{% embed https://dev.to/puppo %}
