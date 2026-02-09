---
{
title: "How to Enhance the API Response with a Wrapper Class with Additional Information with .NET Minimal API",
published: "2025-01-16T20:04:11Z",
tags: ["dotnet", "api"],
description: "One of the challenges of using API (minimal or not) is how to customize the response format and...",
originalLink: "https://https://dev.to/playfulprogramming/how-to-enhance-the-api-response-with-a-wrapper-class-with-additional-information-with-net-minimal-45ea",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

One of the challenges of using API (minimal or not) is how to customize the response format and include additional information such as metadata, pagination, error messages, etc.
In this article, we will explore how to use a wrapper class to achieve this goal.

## What is a Wrapper Class?

A wrapper class is a class that wraps another object or value and provides some additional functionality or properties. For example, we can create a wrapper class for our API response that contains the following properties:

- `Data`: The actual data returned by the API.
- `StatusCode`: The HTTP status code of the response.
- `Message`: A message that describes the result or error of the operation.
- `Metadata`: A dictionary that stores any additional information we want to include in the response.

Here is an example of how such a wrapper class can be defined in C#:

```csharp
public class ApiResponse<T>
{
    public T Data { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public Dictionary<string, object> Metadata { get; set; }

    public ApiResponse(T data, int statusCode, string message)
    {
        Data = data;
        StatusCode = statusCode;
        Message = message;
        Metadata = new Dictionary<string, object>();
    }
}

```

## How to Use the Wrapper Class in Minimal API?

To use the wrapper class in Minimal API, we need to do two things:

- Create an instance of the wrapper class and populate it with the appropriate data and metadata in our endpoint handlers.
- Configure the JSON serializer options to ignore null values and use camel case naming.

Here is an example of how we can do this in our `Program.cs` file:

```csharp
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

// Configure JSON serializer options
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.IgnoreNullValues = true;
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

var app = builder.Build();

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

var products = new List<Product>
{
    new Product { Id = 1, Name = "Apple", Price = 0.99m },
    new Product { Id = 2, Name = "Banana", Price = 1.29m },
    new Product { Id = 3, Name = "Carrot", Price = 0.49m },
};

// Define a GET endpoint that returns all products
app.MapGet("/products", () =>
{
    // Create an instance of the wrapper class and populate it with data and metadata
    var response = new ApiResponse<List<Product>>(products, StatusCodes.Status200OK, "Success");
    response.Metadata.Add("totalCount", products.Count);
    response.Metadata.Add("pageSize", 10);
    response.Metadata.Add("pageNumber", 1);

    // Return the wrapper class as the response
    return response;
});

// Define a GET endpoint that returns a product by id
app.MapGet("/products/{id}", (int id) =>
{
    // Find the product by id
    var product = products.FirstOrDefault(p => p.Id == id);

    // Check if the product exists
    if (product == null)
    {
        // Create an instance of the wrapper class and populate it with an error message
        var response = new ApiResponse<Product>(null, StatusCodes.Status404NotFound, "Product not found");
        // Return the wrapper class as the response
        return response;
    }
    else
    {
        // Create an instance of the wrapper class and populate it with data and metadata
        var response = new ApiResponse<Product>(product, StatusCodes.Status200OK, "Success");
        // Return the wrapper class as the response
        return response;
    }
});

app.Run();

```

## How Does the Response Look Like?

If we run the application and test the endpoints using a tool like Postman, we can see how the response looks like. Here are some examples:

- GET `/products`:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Apple",
      "price": 0.99
    },
    {
      "id": 2,
      "name": "Banana",
      "price": 1.29
    },
    {
      "id": 3,
      "name": "Carrot",
      "price": 0.49
    }
  ],
  "statusCode": 200,
  "message": "Success",
  "metadata": {
    "totalCount": 3,
    "pageSize": 10,
    "pageNumber": 1
  }
}

```

- GET `/products/1`:

```json
{
  "data": {
    "id": 1,
    "name": "Apple",
    "price": 0.99
  },
  "statusCode": 200,
  "message": "Success"
}

```

- GET `/products/4`:

```json
{
  "statusCode": 404,
  "message": "Product not found"
}

```

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
