---
{
title: "How to Unleash the Power of Multithreading in JavaScript with Web Workers",
published: "2023-05-16T13:04:52Z",
tags: ["javascript", "webdev"],
description: "As I mentioned in my two previous articles, JavaScript is a single-threaded language, which means it...",
originalLink: "https://dev.to/this-is-learning/how-to-unleash-the-power-of-multithreading-in-javascript-with-web-workers-20m5",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

As I mentioned in my two previous articles, **JavaScript is a single-threaded language**, which means it can only execute one task at a time. This can lead to performance issues and unresponsive user interfaces when dealing with complex or long-running computations.

But with **Web Workers**, a feature of HTML5 that allows you to create and **manage separate threads of execution** for your JavaScript code. Web Workers can communicate with the main thread and each other through messages, and they have access to a subset of the browser's APIs, such as XMLHttpRequest, IndexedDB, and WebSockets.

In this article, I will show you how to use Web Workers to create a multithreaded JavaScript application that can perform heavy calculations in the background, while keeping the user interface responsive and interactive.

## What are Web Workers?

Web Workers are objects that represent independent threads of execution for your JavaScript code. They run in a separate environment from the main thread, which means they don't have access to the DOM, the window object, or any global variables. They also **don't share any memory or state with the main thread**, which prevents race conditions and data corruption.

To create a Web Worker, you need to pass the URL of a JavaScript file to the Worker constructor:

```javascript
// main.js
var worker = new Worker('worker.js');

```

This will create a new worker thread and load the worker.js file in it. The worker.js file should contain the code that you want to run in parallel with the main thread.

To communicate with the worker, you can use the **postMessage()** method and the onmessage event handler. The postMessage() method allows you to send data to the worker as an argument, and the onmessage event handler allows you to receive data from the worker as an event object.

For example, let's say we want to send a number to the worker and receive its factorial as a result:

```javascript
// main.js
var worker = new Worker('worker.js');

// send a number to the worker
worker.postMessage(5);

// receive the result from the worker
worker.onmessage = function(event) {
  // event.data contains the data sent by the worker
  console.log('The factorial is ' + event.data);
};

```

```javascript
// worker.js
// receive data from the main thread
onmessage = function(event) {
  // event.data contains the data sent by the main thread
  var number = event.data;

  // calculate the factorial of the number
  var result = 1;
  for (var i = 1; i <= number; i++) {
    result *= i;
  }

  // send the result back to the main thread
  postMessage(result);
};

```

The postMessage() method and the onmessage event handler can handle any type of data that can be serialized as JSON, such as strings, numbers, arrays, objects, etc. However, they cannot handle circular references, functions, or DOM elements.

To terminate a worker, you can use the **terminate()** method on the main thread or call **close()** inside the worker. This will stop the execution of the worker and free up its resources.

```javascript
// main.js
var worker = new Worker('worker.js');

// do some work with the worker

// terminate the worker when done
worker.terminate();

```

```javascript
// worker.js
// do some work

// close the worker when done
close();

```

## How to Use Web Workers for Multithreading

Web Workers are useful for offloading intensive or time-consuming tasks from the main thread **to avoid blocking it** and affecting the user experience. For example, you can use Web Workers for:

- Image processing
- Data manipulation
- Encryption/decryption
- Machine learning
- Simulation

To use Web Workers for multithreading, you need to follow these steps:

1. Identify the tasks that can be parallelized and split them into smaller subtasks.
2. Create one or more workers and assign them different subtasks.
3. Send data to and receive data from the workers using postMessage() and onmessage.
4. Combine or process the results from the workers as needed.
5. Terminate or reuse the workers when done.

Let's see an example of how to use Web Workers for multithreading. Suppose we want to calculate the sum of squares of all numbers from 1 to n. This is a simple task that can be easily parallelized by dividing it into smaller subtasks.

For instance, if n is 100 we can split it into four subtasks: calculate the sum of squares of numbers from 1 to 25, from 26 to 50, from 51 to 75, and from 76 to 100. Then we can create four workers and assign them each one subtask. Finally, we can add up the results from the workers and get the final answer.

Here is the code for the main thread:

```javascript
// main.js
// create an array of numbers from 1 to 100
var numbers = [];
for (var i = 1; i <= 100; i++) {
  numbers.push(i);
}

// create an array of workers
var workers = [];

// create a variable to store the final result
var sumOfSquares = 0;

// create a function to handle the results from the workers
function handleResult(event) {
  // add the result from the worker to the final result
  sumOfSquares += event.data;

  // terminate the worker
  event.target.terminate();

  // remove the worker from the array
  workers.splice(workers.indexOf(event.target), 1);

  // check if all workers are done
  if (workers.length === 0) {
    // log the final result
    console.log('The sum of squares is ' + sumOfSquares);
  }
}

// create four workers and assign them different subtasks
for (var j = 0; j < 4; j++) {
  // create a new worker
  var worker = new Worker('worker.js');

  // add the worker to the array
  workers.push(worker);

  // send a slice of numbers to the worker
  worker.postMessage(numbers.slice(j * 25, (j + 1) * 25));

  // listen for the result from the worker
  worker.onmessage = handleResult;
}

```

Here is the code for the worker thread:

```javascript
// worker.js
// receive a slice of numbers from the main thread
onmessage = function(event) {
  // get the slice of numbers
  var numbers = event.data;

  // calculate the sum of squares of the numbers
  var result = 0;
  for (var i = 0; i < numbers.length; i++) {
    result += Math.pow(numbers[i], 2);
  }

  // send the result back to the main thread
  postMessage(result);
};

```

This code will output:

```
The sum of squares is 338350

```

It should be correct 😀

## Benefits and Limitations of Web Workers

Web Workers offer several benefits for creating multithreaded JavaScript applications, such as:

- Improving performance and responsiveness by distributing work across multiple cores or processors.
- Avoiding blocking or freezing the main thread and the user interface.
- Isolating and securing data and code in separate environments.
- Simplifying concurrency and synchronization by using message passing instead of shared memory.

However, Web Workers also have some limitations that you should be aware of, such as:

- Creating and terminating workers can be expensive in terms of time and resources.
- Communicating with workers can incur serialization and deserialization overheads.
- Workers have limited access to browser APIs and features, such as DOM manipulation, localStorage, cookies, etc.
- Workers cannot directly access or modify variables or functions in the main thread or other workers.
- Workers may not be supported by older browsers or environments.

## Conclusion

In this post we learned how to create a simple Web Workers but you can use the same approach for your business logic as well.
Web Workers are also one of the fundamental feature for creating Progressive Web Applications. We will see this topic in the next series on my blog.

---

Are you interested in learning GitHub but don't know where to start? Try my course on LinkedIn Learning: [Learning GitHub](https://bit.ly/learninggithub).

![LinkedIn Learning](./sdc2bpiftpadibi4h51c.gif)

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

{% embed https://dev.to/kasuken %}
