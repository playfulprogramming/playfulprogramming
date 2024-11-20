---
{
  title: "Angular 19: linkedSignal & Resource API",
  description: "Let's learn about Angular19's linkedSignal & Resource APIs!",
  published: '2024-11-19T16:00:00.000Z',
  tags: ["angular" , "javascript"],
  license: 'cc-by-4'
}
---

Angular 19 introduces two powerful features designed to improve reactive programming and data management: the `linkedSignal` function and the Resource API. These enhancements address challenges in state synchronization and asynchronous data handling, providing developers with more efficient tools for building scalable applications.

# linkedSignal: Simplifying Signal Synchronization

In earlier versions of Angular, managing state that was dependent on other signals often required complex workarounds. Developers typically used `computed()` signals to derive values based on other signals. However, `computed()` signals are read-only which limited the ability to create signals that could both derive values from others and be updated independently.



The new `linkedSignal` function in Angular 19 resolves this limitation by providing a way to create writable signals that are automatically updated based on the value of another signal. This feature simplifies signal synchronization, making state management more predictable and maintainable.

## Example:

```typescript
import { signal, linkedSignal } from '@angular/core';

const sourceSignal = signal(0);
const updatedSignal = linkedSignal({
  source: sourceSignal,
  computation: () => sourceSignal() * 5,
});
```

In this example, `updatedSignal` will always be five times the value of `sourceSignal` and will automatically adjust as `sourceSignal` changes.

For more details about Angular `linkedSignal`, check out the official documentation:<a href="https://angular.dev/guide/signals/linked-signal">Angular linkedSignal Guide.</a> 





## Addressing Existing Challenges:

Before the introduction of `linkedSignal`, developers faced difficulties in creating signals that were both dependent on other signals and writable. This often led to convoluted code structures and increased the potential for errors. By providing a straightforward method to create such signals, `linkedSignal` enhances code clarity and reduces the likelihood of bugs related to state management.

## Resource API: Streamlined Data Loading

Handling asynchronous data, especially from HTTP requests, can be cumbersome in Angular. Developers often had to manually manage loading, success, and error states, leading to verbose and error-prone code.

The `Resource API` introduced in Angular 19 takes a reactive approach to data loading, particularly useful for operations like HTTP GET requests. It allows developers to define a loader function that asynchronously fetches data and automatically tracks the loading state, simplifying error handling and status monitoring.

## Example:

```typescript
import { resource } from '@angular/core';

const productResource = resource({
  loader: async () => {
    const response = await fetch('https://api.example.com/products');
    return response.json();
  }
});
```

In this example, updatedSignal will always be five times the value of sourceSignal and will automatically adjust as sourceSignal changes.

Addressing Existing Challenges:

Before the introduction of linkedSignal, developers faced difficulties in creating signals that were both dependent on other signals and writable. This often led to convoluted code structures and increased the potential for errors. By providing a straightforward method to create such signals, linkedSignal enhances code clarity and reduces the likelihood of bugs related to state management.

Resource API: Streamlined Data Loading

Managing asynchronous data loading, especially through HTTP requests, has been a complex task in Angular applications. Developers needed to handle various states of data fetching manually, including loading, success, and error states, which often resulted in verbose and error-prone code.

The Resource API in Angular 19 offers a reactive approach to loading resources, particularly for read operations like HTTP GET requests. It allows developers to define a loader function that asynchronously fetches data and provides signals to monitor the current status and handle errors effectively.

## Example:
```typescript
import { resource } from '@angular/core';

const productResource = resource({
  loader: async () => {
    const response = await fetch('https://api.example.com/products');
    return response.json();
  }
});
```

In this example, `productResource` is initialized with a loader function that fetches data from the specified API. The Resource API takes care of managing the loading state and handling errors, thus streamlining the data-fetching process.

## Key Features of the Resource API:

Status Tracking: Signals such as `status`, `error`, and `isLoading` allow developers to monitor the current state of the data loading process, facilitating better user feedback and error handling. The `status` signal can have the following values:
*  Idle (0): The resource is in its initial state and has not started loading.
*  Error (1): An error occurred during the loading process.
* Loading (2): The resource is currently loading data.
* Reloading (3): The resource is reloading data, typically after a previous load.
* Resolved (4): The resource has successfully loaded data.
* Local (5): The resource's data has been updated locally without a new load.

* **Local Updates:** Developers can use the `update` method to modify the loaded data locally without triggering a new load, providing greater flexibility in managing state.
* **Request Management:** The Resource API automatically restarts the loading process when dependent signals change and can cancel ongoing requests to prevent race conditions, ensuring data consistency.

## Overcoming Previous Hurdles:

Before the Resource API, developers had to manually handle multiple states (loading, success, error) for each HTTP request, which could lead to repetitive and error-prone code. The Resource API abstracts these concerns and offers a more declarative approach, reducing boilerplate code and improving the reliability of data fetching.

For more details about Angular `Resource API`, check out the official documentation:<a href="https://angular.dev/guide/signals/resource">Async reactivity with resources.</a> 


## Conclusion

Angular 19's introduction of `linkedSignal` and the `Resource API` significantly enhances the framework's capabilities for managing reactive state and handling asynchronous data. These features streamline complex tasks and help developers build more maintainable, performant applications. By utilizing these tools, developers can create cleaner, more efficient code while improving the overall user experience.

### For more details, check out the official Angular documentation:  
- [Angular linkedSignal Guide](https://angular.dev/guide/signals)  
- [Angular Resource API](https://angular.dev/guide/signals#resource-api)

