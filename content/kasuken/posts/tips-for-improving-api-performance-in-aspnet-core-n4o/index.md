---
{
title: "Tips for Improving API Performance in ASP.NET Core",
published: "2025-06-01T20:23:55Z",
edited: "2025-06-03T19:23:11Z",
tags: ["aspnet", "dotnet", "performance", "webperf"],
description: "APIs are the backbone of modern applications, but even the cleanest code can drag if performance...",
originalLink: "https://dev.to/this-is-learning/tips-for-improving-api-performance-in-aspnet-core-n4o",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

APIs are the backbone of modern applications, but even the cleanest code can drag if performance isn’t top of mind.
Very often, I receive this question after a session at an event or work from my colleagues: How can I improve or ensure that my APIs are fast?

These aren’t theoretical tips, they’re battle-tested improvements I’ve used (and seen developers forget all too often). 

Oh, and yes, we’ll even let GitHub Copilot take a shot at refactoring for speed. 🚀

---

## Use Asynchronous Requests Properly

In .NET, asynchronous programming isn't just a nice-to-have—it's a must for scalable APIs. Blocking calls can choke your thread pool, delay responses, and reduce overall throughput. Fortunately, ASP.NET Core makes writing async code pretty painless.

> ⚠️ **Warning:** If you see `.Result` or `.Wait()` in your code, chances are you’re leaving performance on the table—or worse, risking deadlocks.

### Real-World Example

```csharp
// ❌ Bad (Blocking)
[HttpGet("weather")]
public IActionResult GetWeather()
{
    var forecast = _weatherService.GetForecast().Result;
    var log = _dbContext.Logs.FirstOrDefault();
    return Ok(new { forecast, log });
}

// ✅ Good (Async All The Way)
[HttpGet("weather")]
public async Task<IActionResult> GetWeather()
{
    var forecast = await _weatherService.GetForecastAsync();
    var log = await _dbContext.Logs.FirstOrDefaultAsync();
    return Ok(new { forecast, log });
}
```

> Tip: Always **make the entire call chain async**—from controller to service to data layer.

---

## Use Pagination for Large Data Collections

Returning thousands of records in a single API call is one of the fastest ways to tank performance. Pagination helps by delivering data in manageable chunks.

```csharp
[HttpGet("products")]
public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
{
    var products = await _dbContext.Products
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return Ok(products);
}
```

### Bonus: Return Pagination Metadata

```csharp
var totalCount = await _dbContext.Products.CountAsync();

return Ok(new {
    data = products,
    pagination = new {
        currentPage = page,
        pageSize,
        totalCount
    }
});
```

---

## Use `AsNoTracking` Whenever Possible

By default, EF Core tracks every entity it loads. That’s unnecessary for read-only operations and adds overhead.

```csharp
// ✅ Optimized with no tracking
var products = await _dbContext.Products
    .AsNoTracking()
    .ToListAsync();
```

### Combine With Projection

```csharp
var productList = await _dbContext.Products
    .AsNoTracking()
    .Select(p => new ProductDto {
        Id = p.Id,
        Name = p.Name,
        Price = p.Price
    })
    .ToListAsync();
```

[UPDATE]: some of you commented about the fact that with projections, .AsNoTracking is implicit, so, in this case, you don't need the code above.

---

## Enable Gzip or Brotli Compression

Compressing your responses can **dramatically reduce payload size**, especially for JSON-heavy APIs.
Pay attention, it uses some CPU resources for each request! 💀

### Setup

```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<BrotliCompressionProviderOptions>(opts =>
{
    opts.Level = CompressionLevel.Fastest;
});

builder.Services.Configure<GzipCompressionProviderOptions>(opts =>
{
    opts.Level = CompressionLevel.SmallestSize;
});

app.UseResponseCompression();
```

> ✅ ASP.NET Core will prefer Brotli if the client supports it.

---

## Use Cache for Frequently Accessed Data

Stop reloading the same data on every request. Use `IMemoryCache` or `IDistributedCache` to improve response time and reduce DB load.

### In-Memory Example

```csharp
public class ProductService
{
    private readonly IMemoryCache _cache;
    private readonly AppDbContext _db;

    public ProductService(IMemoryCache cache, AppDbContext db)
    {
        _cache = cache;
        _db = db;
    }

    public async Task<List<Product>> GetFeaturedProductsAsync()
    {
        return await _cache.GetOrCreateAsync("featured_products", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return await _db.Products
                .Where(p => p.IsFeatured)
                .AsNoTracking()
                .ToListAsync();
        });
    }
}
```

> 🫠 For distributed environments, use Redis (there is also a Redis service on Azure) for consistency across instances.

---

## Avoid Overfetching With Proper DTOs

Entities often contain fields your frontend doesn't need, and shouldn’t see.

### Entity vs DTO

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string InternalCode { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsArchived { get; set; }
}

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

### Query with DTO

```csharp
var products = await _dbContext.Products
    .AsNoTracking()
    .Select(p => new ProductDto
    {
        Id = p.Id,
        Name = p.Name
    })
    .ToListAsync();
```

---

## Ask GitHub Copilot to Refactor Your Code (Agent Mode 😎)

Copilot isn’t just for boilerplate, it can help you spot real performance issues.

### Example Prompts

```markdown
"Analyze this ASP.NET Core controller and suggest improvements for performance."
```

```markdown
"Refactor this service class to reduce database queries, avoid overfetching, and use caching."
```

> 🤖 Copilot can detect blocking calls, suggest `.AsNoTracking()`, promote pagination, and even refactor long service methods.

The more specific your prompt, the better the result.

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

{% embed https://dev.to/kasuken %}
