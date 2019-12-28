# Call Android code from C#

For example, take the following library: https://github.com/jaredrummler/AndroidDeviceNames

You must make your callback extend the type of callback that is used in the library. For example, take the following code sample from the README of the aformentioned library:

```java
DeviceName.with(context).request(new DeviceName.Callback() {
  @Override public void onFinished(DeviceName.DeviceInfo info, Exception error) {
    String manufacturer = info.manufacturer;  // "Samsung"
    String name = info.marketName;            // "Galaxy S8+"
    String model = info.model;                // "SM-G955W"
    String codename = info.codename;          // "dream2qltecan"
    String deviceName = info.getName();       // "Galaxy S8+"
    // FYI: We are on the UI thread.
  }
});
```

While this example may seem straightforward, let's disect what we're doing step-by-step here. This will allow us to make the migration to C# code much simpler to do mentally.

```java
// Create a new "DeviceName.Callback" instance
DeviceName.Callback handleOnFinished = new DeviceName.Callback() {
  // Provide an implementation of the `onFinished` function in the `Callback` class
  // Notice that there are two parameters for this method: one for info, the other for errors
  @Override public void onFinished(DeviceName.DeviceInfo info, Exception error) {
    // ... Assignment logic here
  }
};

// Pass the `DeviceName.Callback` instance to the `DeviceName.with` in order to get a request instance
DeviceName.Request withInstance = DeviceName.with(context);

// Use that request instance to call the `onFinished` callback from above to run the related code
withInstance.request(handleOnFinished);
```

You can see that we have a few steps here:

1) Make a new `Callback` instance
2) Provide an implementation of `onFinished` for said instance
3) Call `DeviceName.with` to create a request we can use later
4) Call that request's `request` method with the `Callback` instance

For each of these steps, we need to have a mapping from the Java code to C# code. Let's walk through these steps one-by-one

## Create `Callback` Instance

In order to create an instance of a `Callback` in C# code, we first need a C# class that maps to the `Java` interface. To do so, let's start by extending the Android library interface. We can do this by using the `base` function and the name of the Java package path. You're able to use `$` to refer to the interface name from within the Java package.

```c#
private class DeviceCallback : AndroidJavaProxy
{
  // $ refers to interface name
  public DeviceCallback() : base("com.jaredrummler.android.device.DeviceName$Callback") {}
}
```

> [This package path can be found in the library's code at the following path](https://github.com/jaredrummler/AndroidDeviceNames/blob/e23b73dbb81be6cb64dfa541a3e93800ee26b185/library/src/main/java/com/jaredrummler/android/device/DeviceName.java#L17). The `DeviceName` is referring to the path of the `.java` file name.

We can then provide an implementation of the `onFinished` method of that `Callback`. Recall how we previously had two params? Well, now the implementation will require we use the `AndroidJavaObject` type for both of those params. 

Otherwise — if we type the function with a C# interface or class that matches the Java implementation — the method will not be called when we expect it to. This is due to function overloading expecting to get the `AndroidJavaObject` from the code Unity has developed to call mapped functions and classes.

This [`AndroidJavaObject` type has a myriad of methods that can be called to assist in gathering data from or interfacing with from the Java object](https://docs.unity3d.com/ScriptReference/AndroidJavaObject.html). One of such methods is the [`Get` method](https://docs.unity3d.com/ScriptReference/AndroidJavaObject.Get.html). When called on an `AndroidJavaObject` instance in C#, it will allow you to grab a value from Java. Likewise, if you intend to call a method from the Java code, you can use [`AndroidJavaObject.Call`](https://docs.unity3d.com/ScriptReference/AndroidJavaObject.Call.html).

```c#
private class DeviceCallback : AndroidJavaProxy
{
  public DeviceCallback() : base("com.jaredrummler.android.device.DeviceName$Callback") {}
  // These both MUST be `AndroidJavaObject`s. If not, it won't match the Java method type and therefore won't be called
  void onFinished(AndroidJavaObject info, AndroidJavaObject err)
  {
    // When running `AndroidJavaObject` methods, you need to provide a type for the value to be assigned to
    string manufacturer = info.Get<string>("manufacturer"); // "Samsung"
    string readableName = info.Get<string>("marketName"); // "Galaxy S8+"
    string model = info.Get<string>("model"); // "SM-G955W"
    string codename = info.Get<string>("codename"); // "dream2qltecan"
    string deviceName = info.Call<string>("getName"); // "Galaxy S8+"
  }
}
```

