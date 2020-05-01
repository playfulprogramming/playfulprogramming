---
{
	title: "Setup Android Studio Emulator for AMD Ryzen CPUs",
	description: "Historically, the Android Emulator has only ran on Intel CPUs. While that's no longer the case, it can be tricky to setup. Let's walk through how to do so!",
	published: '2020-05-05T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['tooling', 'windows'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

In the past, Android Studio did not support AMD's CPUs for hardware emulation of an Android device. [That all changed in 2018 when Google added Hyper-V support to the Android Emulator](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html).

However, while working on my Ryzen CPU powered desktop, I had difficulties getting the program working on my machine. 

# BIOS Setup {#bios}

In order to use Hyper-V, we have to have various settings configured on our motherboards.

Two of the settings we need to enable are:

- `IOMMU` - Provides resources to be passed directly to virtual machines
- `SVM Mode` - "Secure Virtual Machine" features, enabling applications to use features for VMs

I personally have a Gigabyte motherboard (the Gigabyte GA-AB350M-Gaming 3), so I'll showcase the places I had to find the options for these motherboard settings.

## SVM Mode {#gigabyte-svm}

To enable SVM mode, first start at the first screen to the left, labeled **"M.I.T"**.

![The MIT menu item](./mit_menu.jpg)

Then, select **"Advanced Frequency Settings"**.

![The Advanced Frequency Settings page](./frequency_settings.jpg)

Finally, open the **"Advanced CPU Core Settings"**.

![The CPU Core settings page](./svm_mode.jpg)

Once on this page, you should see **"SVM Mode"** as the fourth option from the bottom. _Toggle that to **"Enabled"**_, then move onto enabling IOMMU

## IOMMU {#gigabyte-iommu}

Enabling IOMMU on a Gigabyte AMD motherboard is much easier then enabling SVM mode. Simply _go to the **"Chipset"** root tab and it should be the first option at the top_. Even if it's set to "Auto", go ahead and _update that to be **"Enabled"**_.

![The chipset tab](./iommu.jpg)



Once changed, tab over to "Save & Exit" and select "Exit and save changes".

# Windows Features Setup {#windows-features}

Now that we have our BIOS (UEFI, really) configured properly, we can enable the Windows features we need for the Android Emulator.

To start, press <kbd>Win</kbd> + <kbd>R</kbd>, which should bring up the **"Run"** dialog. Once open, _type `OptionalFeatures` and press **"OK"**_. 

![The "run dialog" box with the typed suggestion](./run_dialog.png)

Once that's ran, you'll see a **"Turn Windows features on or off"** window.

![](./windows_10_add_features.png)

You'll want to turn on the following options:

- Hyper-V
- Windows Hypervisor Platform
- Windows Sandbox

After these three settings are selected, press **"OK"** and allow the features to install. After your features are installed, your machine will need a reboot. Go ahead and restart your machine before proceeding to installing Android Studio.

# Setup Android Studio {#android-studio}

You have a few different methods for installing Android Studio. You can choose to use [Google's installer directly](https://developer.android.com/studio/install), you can [utilize the Chocolatey CLI installer](https://chocolatey.org/packages/AndroidStudio), or even use [JetBrain's Toolbox utility to install and manage an instance of Android Studio](https://www.jetbrains.com/toolbox-app/). _Any of these methods work perfectly well_, it's down to preference, really. 

Once you get Android Studio installed, go ahead and _open the SDK Manager settings screen_ from the **"Configure"** dropdown.

![The startup screen showing "configure" dropdown](./android_studio_configure.png)

Once you see the popup dialog, you'll want to _select the "SDK Tools" tab_. There should be a selection of tools that you can install or update. One of those selections (in about the middle of the list) should be called _"Android Emulator Hypervisor Driver for AMD Processors (installer)"_

![The mentioned screen with the AMD hypervisor selected](./select_amd_hypervisor.png)





Once selecting it, press **"Apply"** to download the installer. _Because the "Apply" button only downloads the installer, we'll need to run it manually._ 

## Run the Installer {#amd-hypervisor-installer}

To find the location of the installer, you'll want to to go to the install location for your Android SDK. For me (who used the Jetbrains Toolbox to install Android Studio), that path was: `%AppData%/../Local/Android/Sdk`. To find the hypervisor installer, it's located under the subpaths:

```
SDK_INSTALL_LOCATION\extras\google\Android_Emulator_Hypervisor_Driver
```

![The location of the hypervisor visually using OneCommander app](./hypervisor_filesystem_path.png)

> If you like having this macOS-like preview pane of files, you can find it in the OneCommander application. We covered this app in [our "Ultimate Windows Development Environment Guide" article](posts/ultimate-windows-development-environment-guide/#Paid)

Once you have the path located, you'll want to run the `silent_installer.bat` inside of an elevated shell. I did this by pressing <kbd>Win</kbd> + <kbd>X</kbd> and pressing **"Windows PowerShell (Admin)"**. Once that was opened, I copied the path to the PowerShell window via `cd` and ran the installer.

![The Win+X dialog](./win_x.png)

![The "Success" of the installer once ran](./installer_ran.png)



You should see the message _"DeleteService SUCCESS"_ if everything ran as expected.


