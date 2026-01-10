---
{
title: "How to avoid Microsoft Graph API throttling and optimize network traffic",
published: "2023-10-13T11:16:47Z",
tags: ["azure", "microsoftgraph"],
description: "In the last few months I received a lot of requests from customers about avoiding Microsoft Graph API...",
originalLink: "https://dev.to/this-is-learning/how-to-avoid-microsoft-graph-api-throttling-and-optimize-network-traffic-5c2g",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In the last few months I received a lot of requests from customers about avoiding Microsoft Graph API throttling or in general how to optimize the network traffic for the Graph API.

## How Microsoft Graph throttling works

Throttling is a mechanism that Microsoft Graph uses to prevent overuse of resources and maintain service health. When an application makes too many requests in a short period of time, or exceeds the service-specific limits for certain resources or operations, Microsoft Graph may limit or block any further requests from that application for a period of time. When this happens, Microsoft Graph returns an HTTP status code 429 (Too many requests), along with a Retry-After header that indicates how long the application should wait before retrying the request.

Throttling behavior can depend on various factors, such as the request type (GET, POST, PATCH, etc.), the scope of the limit (per app, per tenant, per user, etc.), the service or resource involved (Outlook, OneDrive, Teams, etc.), and the current load and health of the service. Therefore, **it is not possible to predict exactly when and how throttling will occur for a given application**.

## How to avoid throttling

The best way to avoid throttling is to design your application in a way that minimizes the number and frequency of requests to Microsoft Graph API. Here are some best practices that you can apply to achieve this goal:

- **Apply least privilege principle**. Request only the permissions that your application needs to perform its functionality, and use the least privileged permission type for each scenario. For example, if your application only needs to read the profile of the signed-in user, request the User.Read delegated permission instead of the User.ReadBasic.All or User.Read.All application permissions. This will reduce the impact of your application on the service and other applications or tenants.
- **Use batching**. If your application needs to make multiple requests to Microsoft Graph API, consider using the [JSON batching] feature to combine them into a single request. This will reduce the number of HTTP connections and improve the network efficiency. You can batch up to 20 requests in a single batch request, as long as they are not interdependent and do not exceed 20 KB in size.
- **Use pagination**. If your application needs to retrieve a large amount of data from Microsoft Graph API, such as a list of users or messages, use the [pagination] feature to get the data in smaller chunks instead of requesting all of it at once. This will reduce the load on the service and avoid timeouts or incomplete responses. You can use the top query parameter to specify the page size (up to 1000 items per page), and use the nextLink or deltaLink property in the response to get the next page or delta changes.
- **Use filtering, sorting, and projection**. If your application only needs a subset of data or a specific order of data from Microsoft Graph API, use the [filtering], [sorting], and [projection] features to reduce the amount of data returned by the service. This will improve the performance and bandwidth usage of your application. You can use the filter query parameter to apply logical operators or functions on the properties of the resources, use the orderby query parameter to sort the results by one or more properties, and use the select query parameter to specify only the properties that you need in the response.
- **Retrieve only the information that you need**. If your application only needs two or three fields for an entity, use the [select] parameter to retrieve only that fields. It reduces the response time and of course the network traffic.

## How to implement throttling strategies

Even if you follow the best practices above, there is still a chance that your application may encounter throttling from Microsoft Graph API due to various reasons beyond your control. Therefore, it is important to implement some strategies in your application code to handle throttling gracefully and retry failed requests appropriately. Here are some strategies that you can implement:

- **Use exponential backoff**. When your application receives a 429 response from Microsoft Graph API, it should wait for the duration specified in the Retry-After header before retrying the request. However, since there is no guarantee that the request will succeed after that duration, it is recommended to use an exponential backoff algorithm to increase the wait time exponentially after each subsequent failure, up to a maximum limit. This will reduce the chance of overwhelming the service and improve the probability of success. You can also add some randomness or jitter to the wait time to avoid synchronization issues with other applications or requests.
- **Use adaptive throttling**. In some cases, your application may not receive a 429 response from Microsoft Graph API, but may still experience some signs of throttling, such as increased latency, partial results, or service errors. This may indicate that the service is under high load or degraded health, and is applying some adaptive throttling mechanisms to cope with the situation. In this case, your application should monitor the performance and quality of the responses, and adjust its request rate accordingly. For example, you can use the [Retry-After] or [X-Ms-Retry-After-Ms] headers, the [X-Ms-Resource-Quota] and [X-Ms-Resource-Usage] headers, or the [Diagnostics] header to get some hints on the service status and recommended actions.
- **Use Microsoft Graph SDKs**. If you are using one of the [Microsoft Graph SDKs] to access Microsoft Graph API, you can benefit from some built-in features that handle throttling automatically or provide some options to customize your retry policy. For example, the Microsoft Graph SDK for .NET has a [RetryHandler] middleware that implements an exponential backoff algorithm with jitter and respects the Retry-After header. You can also configure the number of retries, the delay between retries, and the HTTP status codes that trigger a retry.

## Conclusion

Microsoft Graph API throttling is a feature that helps maintain the optimal performance and reliability of the service for all applications and users. By following the best practices and strategies described in this blog post, you can avoid or handle throttling effectively and optimize your network traffic with Microsoft Graph API. This will improve your application's functionality and user experience.

If you are facing these issues or do you want to have a deeper look at it, I recommend to you the Learn documentation about this topic: https://learn.microsoft.com/en-us/training/modules/optimize-network-traffic/

---

![Dev Dispatch](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!