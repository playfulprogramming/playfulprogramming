---
{
title: "How To Add Controllers To A Blazor Server App",
published: "2024-01-23T07:31:57Z",
tags: ["blazor", "aspnet", "csharp", "dotnet"],
description: "In this post, I will show you how to add controllers to a Blazor Server app and how to use them to...",
originalLink: "https://https://dev.to/playfulprogramming/how-to-add-controllers-to-a-blazor-server-app-a9",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In this post, I will show you how to add controllers to a Blazor Server app and how to use them to handle requests from the client side. Controllers are classes that derive from the `Controller` base class and have methods that are decorated with attributes such as `[HttpGet]`, `[HttpPost]`, `[Route]`, etc. These methods are called **action methods** and they define the logic for responding to different types of requests.

## Step 1: Create a controller class

You can create a controller class manually by adding a new class file to the `Controllers` folder and inheriting from the `Controller` base class. For example, here is how I would create the `ProductsController` class manually:

```csharp
using Microsoft.AspNetCore.Mvc;

namespace BlazorServerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        // action methods go here
    }
}
```

Notice that I have added two attributes to the class: `[ApiController]` and `[Route("api/[controller]")]`. The `[ApiController]` attribute indicates that this class is a controller that handles API requests. The `[Route("api/[controller]")]` attribute specifies the default route template for the controller, which is `api/Products` in this case. You can customize the route template by changing the value of the attribute.

## Step 2: Add action methods

Now that we have a controller class, we can add action methods to it. Action methods are methods that have a return type of `IActionResult` or a derived type, such as `OkObjectResult`, `NotFoundResult`, `BadRequestResult`, etc. These types represent the HTTP response that the action method will send back to the client. Action methods can also have parameters that are bound from the request, such as query strings, route values, headers, body, etc.

To add an action method, you need to decorate it with an attribute that specifies the HTTP verb and the optional route template for the method. For example, here is how I would add a `GetAll` action method to the `ProductsController` class that returns a list of products:

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BlazorServerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        // a sample list of products
        private static readonly List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Price = 999.99m },
            new Product { Id = 2, Name = "Mouse", Price = 19.99m },
            new Product { Id = 3, Name = "Keyboard", Price = 29.99m }
        };

        // GET api/Products
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(products);
        }
    }
}
```

Notice that I have added the `[HttpGet]` attribute to the method, which indicates that this method handles GET requests. The route template for this method is the same as the controller's default route template, which is `api/Products`. You can customize the route template by passing a value to the attribute, such as `[HttpGet("all")]`, which would make the route template `api/Products/all`.

## Conclusion

In this post, I have shown you how to add controllers to a Blazor Server app and how to use them to handle requests from the client side. By using controllers, you can leverage the benefits of both Blazor Server and ASP.NET Core in your web development.

I hope you found this post useful and informative. If you have any questions or feedback, please let me know in the comments below. Thank you for reading! 😊.

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
