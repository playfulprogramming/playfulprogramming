# Call Android code from C# {#call-android-from-c-sharp}

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

// Create a `DeviceName.Request` by passing the current context into the `DeviceName.with` method
DeviceName.Request withInstance = DeviceName.with(context);

// Use that request instance to pass the `DeviceName.Callback` instance from above to run the related code
withInstance.request(handleOnFinished);
```

You can see that we have a few steps here:

1) Make a new `Callback` instance
1a) Provide an implementation of `onFinished` for said instance
2) Call `DeviceName.with` to create a request we can use later
2a) This means that we have to gain access to the currently running context in order to gain device acccess. When calling the code from Unity, it means we have to get access to the `UnityPlayer` context that Unity engine runs on
3) Call that request's `request` method with the `Callback` instance

For each of these steps, we need to have a mapping from the Java code to C# code. Let's walk through these steps one-by-one

## Create `Callback` Instance {#android-c-sharp-callback}

In order to create an instance of a `Callback` in C# code, we first need a C# class that maps to the `Java` interface. To do so, let's start by extending the Android library interface. We can do this by using the `base` constructor of `AndroidJavaProxy` and the name of the Java package path. You're able to use `$` to refer to the interface name from within the Java package.

```c#
private class DeviceCallback : AndroidJavaProxy
{
  // `base` calls the constructor on `AndroidJava` to pass the path of the interface
  // `$` refers to interface name
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
    var manufacturer = info.Get<string>("manufacturer"); // "Samsung"
    var readableName = info.Get<string>("marketName"); // "Galaxy S8+"
    var model = info.Get<string>("model"); // "SM-G955W"
    var codename = info.Get<string>("codename"); // "dream2qltecan"
    var deviceName = info.Call<string>("getName"); // "Galaxy S8+"
  }
}
```

## Get Current Context {#get-unity-context}

Just as all Android applications have some context to their running code, so too does the compiled Unity APK. When compiling down to Android, Unity includes a package called the "UnityPlayer" to run the compiled Unity code. The package path for the player in question is `com.unity3d.player.UnityPlayer`.

While there is not a docs reference page for this Java class, [some of the company's code samples](https://docs.unity3d.com/530/Documentation/Manual/PluginsForAndroid.html) provide us with some useful methods and properties on the class. For example, that page mentions a static property of `currentActivity` that will give us the context we need to pass to `DeviceName.with` later on:

```c#
var player = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
var activity = player.GetStatic<AndroidJavaObject>("currentActivity");
```

We can then gain access to the `DeviceName` Java class. If we look at [the related Java code from the previous section](#call-android-from-c-sharp), we can see that we're calling `DeviceName.with` without making a new instance of `DeviceName`:

```java
DeviceName.Request withInstance = DeviceName.with(context);
```

This means that `with` must be a static method on the `DeviceName` class. In order to call static Java methods, we'll use the `AndroidJavaClass.CallStatic` method in C#.

```c#
var jc = new AndroidJavaClass("com.jaredrummler.android.device.DeviceName");
var withCallback = jc.CallStatic<AndroidJavaObject>("with", activity);
```

Finally, we can add the call to `request` with an instance of the `DeviceCallback` class

```c#
var deviceCallback = new DeviceCallback();
withCallback.Call("request", deviceCallback);
```

## Complete Code Example {#android-c-sharp-code-sample}

Line-by-line explainations are great, but often miss the wholistic image of what we're trying to acheieve. The following is a more complete code sample that can be used to get device information from an Android device from Unity.

```c#
public class DeviceInfo {
  public string manufacturer;  // "Samsung"
  public string readableName;  // "Galaxy S8+"
  public string model;         // "SM-G955W"
  public string codename;      // "dream2qltecan"
  public string deviceName;    // "Galaxy S8+"
}

class DeviceName : MonoBehaviour {
  private class DeviceCallback : AndroidJavaProxy {
    // Add in a field for us to gain access to the device info after the callback has ran
    public DeviceInfo deviceInfo;
    public DeviceCallback() : base("com.jaredrummler.android.device.DeviceName$Callback") {}
    void onFinished(AndroidJavaObject info, AndroidJavaObject err) {
      deviceInfo.manufacturer = info.Get<string>("manufacturer");
      deviceInfo.readableName = info.Get<string>("marketName");
      deviceInfo.model = info.Get<string>("model");
      deviceInfo.codename = info.Get<string>("codename");
      deviceInfo.deviceName = info.Call<string>("getName");
    }
  }

  private void Start() {
    var player = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
    var activity = player.GetStatic<AndroidJavaObject>("currentActivity");
    var jc = new AndroidJavaClass("com.jaredrummler.android.device.DeviceName");
    var withCallback = jc.CallStatic<AndroidJavaObject>("with", activity);
    var deviceCallback = new DeviceCallback();
    withCallback.Call("request", deviceCallback);
    Debug.Log(deviceCallback.deviceInfo.deviceName);
  }
}
```

