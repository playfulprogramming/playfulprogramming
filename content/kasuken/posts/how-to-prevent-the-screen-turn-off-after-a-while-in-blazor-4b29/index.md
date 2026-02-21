---
{
title: "How to prevent the screen turn off after a while in Blazor",
published: "2023-07-12T12:39:00Z",
tags: ["dotnet", "webassembly", "blazor", "webdev"],
description: "One of the challenges of web development is to keep the screen awake when an application needs to...",
originalLink: "https://https://dev.to/playfulprogramming/how-to-prevent-the-screen-turn-off-after-a-while-in-blazor-4b29",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

One of the challenges of web development is to keep the screen awake when an application needs to keep running. For example, if you are reading an ebook, following a recipe, or scanning a QR code, you don't want the screen to dim or lock automatically. This can be annoying for the user and affect the usability of your app.

The Screen Wake Lock API provides a way to prevent devices from dimming or locking the screen when an application needs to keep running. It is a simple and platform-independent solution that works on any modern browser that supports Web APIs.

In this article, I will show you how to use the Screen Wake Lock API in a Blazor application using the JavaScript interop feature.

## Prerequisites

To follow this tutorial, you will need:

- Visual Studio 2022 or Visual Studio Code with the C# extension
- .NET 7 SDK

## Creating a Blazor app

To create a Blazor app, you can use the Blazor WebAssembly App template in Visual Studio or run the following command in a terminal:

```
dotnet new blazorwasm -o ScreenWakeLockDemo
```

This will create a Blazor WebAssembly app with a default layout and some sample pages. You can run the app by pressing F5 in Visual Studio or typing `dotnet run` in the terminal.

## Adding the Screen Wake Lock API

To use the Screen Wake Lock API, you need to access the `navigator.wakeLock` property from JavaScript. This property returns a `WakeLock` object that allows you to request and release a wake lock of type `screen`.

To call JavaScript functions from C#, you can use the `IJSRuntime` service that is injected into your Blazor components. You can also create a C# wrapper class that encapsulates the JavaScript interop logic and exposes a simple and type-safe API.

In this example, I will create a `ScreenWakeLockService` class that implements the following interface:

```csharp
public interface IScreenWakeLockService
{
    // Requests a screen wake lock and returns a sentinel object
    Task<WakeLockSentinel> RequestWakeLockAsync();

    // Releases a screen wake lock given a sentinel object
    Task ReleaseWakeLockAsync(WakeLockSentinel sentinel);

    // Checks if the browser supports the screen wake lock API
    Task<bool> IsSupportedAsync();
}

```

The `WakeLockSentinel` class is a simple wrapper around a JavaScript object reference that represents the underlying platform wake lock. It has an `Id` property that is used to identify and release the wake lock.

```csharp
public class WakeLockSentinel
{
    public WakeLockSentinel(int id, IJSObjectReference jsObjectReference)
    {
        Id = id;
        JsObjectReference = jsObjectReference;
    }

    public int Id { get; }

    public IJSObjectReference JsObjectReference { get; }
}

```

The implementation of the `ScreenWakeLockService` class is as follows:

```csharp
public class ScreenWakeLockService : IScreenWakeLockService
{
    private readonly IJSRuntime _jsRuntime;
    private readonly ConcurrentDictionary<int, WakeLockSentinel> _wakeLocks;
    private int _nextId;

    public ScreenWakeLockService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
        _wakeLocks = new ConcurrentDictionary<int, WakeLockSentinel>();
        _nextId = 0;
    }

    public async Task<WakeLockSentinel> RequestWakeLockAsync()
    {
        // Check if the browser supports the screen wake lock API
        var isSupported = await IsSupportedAsync();
        if (!isSupported)
        {
            throw new NotSupportedException("The browser does not support the screen wake lock API.");
        }

        // Request a screen wake lock and get a JS object reference
        var jsObjectReference = await _jsRuntime.InvokeAsync<IJSObjectReference>("navigator.wakeLock.request", "screen");

        // Create a sentinel object and store it in a dictionary
        var id = Interlocked.Increment(ref _nextId);
        var sentinel = new WakeLockSentinel(id, jsObjectReference);
        _wakeLocks.TryAdd(id, sentinel);

        // Return the sentinel object
        return sentinel;
    }

    public async Task ReleaseWakeLockAsync(WakeLockSentinel sentinel)
    {
        // Check if the sentinel object is valid
        if (sentinel == null || sentinel.JsObjectReference == null)
        {
            throw new ArgumentNullException(nameof(sentinel));
        }

        // Release the screen wake lock and dispose the JS object reference
        await sentinel.JsObjectReference.InvokeVoidAsync("release");
        await sentinel.JsObjectReference.DisposeAsync();

        // Remove the sentinel object from the dictionary
        _wakeLocks.TryRemove(sentinel.Id, out _);
    }

    public async Task<bool> IsSupportedAsync()
    {
        // Check if the navigator.wakeLock property exists
        return await _jsRuntime.InvokeAsync<bool>("eval", "typeof navigator.wakeLock !== 'undefined'");
    }
}

```

The `RequestWakeLockAsync` method checks if the browser supports the screen wake lock API and then invokes the `navigator.wakeLock.request` function with the `"screen"` argument. This returns a promise that resolves to a `WakeLockSentinel` object in JavaScript, which is wrapped by a `IJSObjectReference` in C#. The method then creates a `WakeLockSentinel` instance with a unique id and stores it in a concurrent dictionary for later use.

The `ReleaseWakeLockAsync` method takes a `WakeLockSentinel` instance as an argument and invokes the `release` method on the corresponding JavaScript object. It then disposes the `IJSObjectReference` and removes the sentinel from the dictionary.

The `IsSupportedAsync` method simply checks if the `navigator.wakeLock` property exists in JavaScript and returns a boolean value.

To use this service in your Blazor components, you need to register it as a singleton in the `Program.cs` file:

```csharp
builder.Services.AddSingleton<IScreenWakeLockService, ScreenWakeLockService>();

```

## Using the Screen Wake Lock Service

Now that you have created a screen wake lock service, you can use it in your Blazor components to request and release a screen wake lock. For example, you can create a simple component that has a toggle button to enable or disable the screen wake lock:

```csharp
@page "/screenwakelock"
@inject IScreenWakeLockService ScreenWakeLockService

<h1>Screen Wake Lock Demo</h1>

@if (_isSupported)
{
    <p>The browser supports the screen wake lock API.</p>
    <button @onclick="ToggleWakeLock">@(_isLocked ? "Disable" : "Enable") screen wake lock</button>
}
else
{
    <p>The browser does not support the screen wake lock API.</p>
}

@code {
    private bool _isSupported;
    private bool _isLocked;
    private WakeLockSentinel _sentinel;

    protected override async Task OnInitializedAsync()
    {
        // Check if the browser supports the screen wake lock API
        _isSupported = await ScreenWakeLockService.IsSupportedAsync();
    }

    private async Task ToggleWakeLock()
    {
        try
        {
            if (_isLocked)
            {
                // Release the screen wake lock
                await ScreenWakeLockService.ReleaseWakeLockAsync(_sentinel);
                _sentinel = null;
                _isLocked = false;
            }
            else
            {
                // Request a screen wake lock
                _sentinel = await ScreenWakeLockService.RequestWakeLockAsync();
                _isLocked = true;
            }
        }
        catch (Exception ex)
        {
            // Handle possible errors or rejections
            Console.WriteLine(ex.Message);
        }
    }
}

```

This component injects the `IScreenWakeLockService` into a field and calls its methods in the `OnInitializedAsync` and `ToggleWakeLock` methods. It also handles possible errors or rejections that may occur when requesting or releasing a screen wake lock.

## Use cases for the Screen Wake Lock API

The Screen Wake Lock API can be useful for any web app that needs to keep running while the user is not interacting with it. Some examples are:

- Reading apps that display long texts or ebooks
- Cooking apps that show recipes or timers
- Presentation apps that show slides or videos
- Gaming apps that use device motion or voice control
- Scanning apps that use QR codes or barcodes
- Fitness apps that track workouts or heart rate

## Conclusion

In this article, I showed you how to prevent the screen turn off in a Blazor application using the Screen Wake Lock API with the JavaScript interop feature. I will also explain some use cases for the screen wake lock API and how to handle possible errors and rejections.
