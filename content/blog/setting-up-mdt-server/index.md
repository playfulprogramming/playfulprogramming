---
{
	title: "Set Up MDT For Sustainable Medium-Scale Windows Deployments",
	description: "",
	published: '2021-01-11T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['windows', 'sysadmin'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Early in the organization's life, we were simply deploying Windows by installing it on every computer and setting them up one by one. We quickly realized this was not optimal and proceeded to do research on how to properly do Windows deployment. My boss had found [this article](https://technet.microsoft.com/en-us/library/ee523217), and we proceeded to setup and capture a fat image on Windows 7. From there, we places install.wim on a flashdrive with a full source directory of Windows 7 Pro install disk. We then moved to PXE using Serva, and have since moved to the world of Microsoft Deployment Toolkit (MDT). We now also use a virtual machine, as you can only capture an image so many times. By using a Virtual Machine as the base, you can snapshot before genericizing, capture the image, and revert to the snapshot as to avoid the 3 time genericize warning.

# Setup

## Installing Windows

### VM Creation

We'll start this setup by creating a Virtual Machine. You'll be installing Windows Server 2012 R2 in a graphical interface setup.

_We're assuming that you're using VirtualBox in this document, but things should be moved to Hyper-V for a myriad of support and feature-set reasons._

Start by clicking "New" on the main VirtualBox page.

![](.\configure_vm\make_vm\1.png)

Click Expert Mode. This will allow you to see settings better and ensure setup is done properly.
We're going to set the operating system `Type` to `Microsoft Windows`, `Version` to `Windows 2012 (64-bit)`.
Next, set the `Memory size` to the ammount of RAM you wish to alliocate to the virtual machine. The minimum system requirements for Windows Server 2012 for RAM is 512MB, but it is highly suggested to at least set aside 4GB of RAM.
Finally, we're going to set to create a new virtual hard disk.

![](.\configure_vm\make_vm\2.png)

When the `Create Virtual Hard Disk` prompt is brought up, you can assign how large to make the virtual disk, what hard disk file type, method of storing physical hard disks (Dynamic or fixed), and disk location. As you see here, I have left most of the settings as they are by default and given the disk 150GB. The minimum system requirements for disk size is 32 GB (more if the RAM is above 16GB), but given the disk will contain many disk images, drivers, and applications; I'd allot a fair bit. It is important that you try to keep things as close as needed, as shrinking a virtual disk can be frustrating and difficult to do, whereareas expanding a virtual disk is fairly simple.

![](.\configure_vm\make_vm\3.png)

Click create, and the Virtual Machine will be created. Now, click on the virtual machine you've just created and click on settings to modify the settings for this virtual machine. There's still more to do.

### VM Settings

#### Network

In order to bypass issues with host network configuration, allow PXE to work on the network, and others, you'll need to set your Network Settings.
First, set your `Adapter 1` to be `Attached to:` a `Bridged Adapter` with the name of your Ethernet connection you wish to broadcast PXE/DHCP/TFTP to.
Click the dropdown list for `Advanced` settings, modify `Promiscuous Mode:` to be `Allow All`

![](.\configure_vm\make_vm\4.png)

#### Storage

In order to select the disk image for Windows 2012 R2 installer to boot from, you need to select is as the `Virtual Optical Disk File`. Click on the disk icon to the right of `Optical Drive: SATA Port 1`, and select `Choose Virtual Optical Disk File`. It will bring up an explorer file picker to help you find the image file for the installer. Alternatively, you may select `Host Drive 'DriveLetter:'` where DriveLetter is the letter for the optical disk drive you have your installer disk in.

![](.\configure_vm\make_vm\5.png)

You may then accept the changes by clicking `OK`.

### Windows Installer Boot

These next few steps will need to be executed very quickly:

- Start your virtual machine.
- Have VM Window in focus
- Press F12 on this screen
  

![](.\configure_vm\boot\1.png)

This process will pass the key command F12 to the virtual machine which will bring you to a boot selection screen.

![](.\configure_vm\boot\2.png)
As we have configured our install disk as a CD-ROM device, press `c`.

### Windows Installation

If the key combo went well, you should see the following screen. Select your language and keyboard/input method and click `Next`.

![](.\install_windows\1.png)

Press `Install Now`

![](.\install_windows\2.png)

The installer should now prompt you for a product key. Please refer to purchasing or IT manager for a product key.

![](.\install_windows\3.png)

If the product key was accepted, it should now ask you if you wish to install with a GUI or only the Server Core. Select GUI and hit `Next`

![](.\install_windows\4.png)

Select `Custom: Install Windows only (advanced)`

![](.\install_windows\5.png)

Select the full `Unallocated Space` partition, select next, and grab a cup O' joe while you wait for Windows Server to install.

![](.\install_windows\6.png)

### Post-Installation

After the machine has finished installing (which may include many reboots), it will prompt you to create a password for the default `Administrator` account.

![](.\install_windows\7.png)

After setting the password and logging into the account, you should see `Server Manager` popup. This is your first login on the MDT Server!

![](.\install_windows\8.png)

# Windows Server Configuration

After that, you'll want to rename the machine for ease of use in scripts and diagnostics. Click the start button, find `My PC`, right click, and select `Properties`.

![](.\setup_windows\rename_machine\1.png)

![](.\setup_windows\rename_machine\2.png)
This should leave you on a system information screen. Click `Change settings`, and click `Change` on the `System Properties` dialog under the `Computer Name` tab.

![](.\setup_windows\rename_machine\3.png)

![](.\setup_windows\rename_machine\4.png)

This should allow you to rename your machine to whatever you wish it to be. Please follow our current naming standard in regards to this. When you are finished, select `OK`, and `Apply`. It should ask you to restart. Go ahead and do this now.

![](.\setup_windows\rename_machine\5.png)

## VitualBox Guest Additions

In order to have things work perfectly in VirtualBox, install VirtualBox Guest Additions. To begin, click on the `Devices` tab in the top of the `VirtualBox` application. Select `Install Guest Additions CD Image`. This will mount a virtual optical drive into Windows Server. Select the notification and begin the installation.

![](.\setup_windows\install_guest_additions\1.png)

![](.\setup_windows\install_guest_additions\2.png)

![](.\setup_windows\install_guest_additions\3.png)

![](.\setup_windows\install_guest_additions\4.png)

![](.\setup_windows\install_guest_additions\5.png)

![](.\setup_windows\install_guest_additions\6.png)

At some point, it may ask you to install drivers from `Oracle`. This is normal, as they own and maintain VirtualBox. Accept and continue.

![](.\setup_windows\install_guest_additions\7.png)

After you have completed, you should restart your machine.

![](.\setup_windows\install_guest_additions\8.png)

### Setup Shared Drive as F (optional):

As an extra goodie, you should likely setup a shared drive in the guest operating system to the host in order to easily share files to the guest. Do this by opening settings for the VM in VirtualBox. Go to the `Shared Folders` tab, and select the little `+` icon on the right hand side. Select the location where you wish to share, and select your options.

![](.\configure_vm\add_shared_folder\1.png)

![](.\configure_vm\add_shared_folder\2.png)

![](.\configure_vm\add_shared_folder\3.png)

## ADK Installation

The ADK is what allows Windows to have some method of deploying machines. This is how they are pushed on the network. To begin installation, [download ADK](https://developer.microsoft.com/en-us/windows/hardware/windows-assessment-deployment-kit), begin the executable and download the ADK. It is suggested to make a backup of this elsewhere in case a backup is needed later.

![](.\install_adk\online.png)

After doing so, select all options to install, agree to licenses, choose to participate in MS testing, etc. A system reboot is not required after doing so.

![](.\install_adk\1.png)

![](.\install_adk\2.png)

![](.\install_adk\3.png)

![](.\install_adk\4.png)

![](.\install_adk\5.png)

## MDT Installation

MDT, on the other hand, is what allows you to create and manage images to push to assets using WDT (installed with ADK). Start [downloading MDT](https://technet.microsoft.com/en-US/windows/dn475741), and begin the executable. Again agree to licenses, policies, install everything, etc. A system restart is not required after installation.

![](.\install_mdk\1.png)

![](.\install_mdk\2.png)

![](.\install_mdk\3.png)

![](.\install_mdk\4.png)

![](.\install_mdk\5.png)

![](.\install_mdk\6.png)

We will now need to configure a static IP address in order to allow machines to properly connect when using PXE. Start by right clicking on the network panel icon and selecting `Open Network and Sharing Center`.

![](.\static_ip\1.png)
After selecting your network connection (in this image, mine was the link looking `Ethernet` on the right side of the screen), select `Properties` on the popup.

![](.\static_ip\2.png)
Find the option called `Internet Protocol Version 4` (as 6 is not quite ready for the prime time), and select the button `Properties`. Assign it a manual IP address and subnet mask.

![](.\static_ip\3.png)

![](.\static_ip\4.png)

## Add WDS & DHCP features

![](.\add_features\1.png)

![](.\add_features\2.png)

![](.\add_features\3.png)

![](.\add_features\4.png)

![](.\add_features\5.png)

![](.\add_features\6.png)

![](.\add_features\7.png)

![](.\add_features\8.png)

![](.\add_features\9.png)

![](.\add_features\10.png)

![](.\add_features\11.png)

![](.\add_features\12.png)

![](.\add_features\13.png)

![](.\add_features\14.png)

![](.\add_features\15.png)

![](.\add_features\16.png)

## WDS Config:

Respond to all PXE, don't require admin
Don't listen on DHCP ports
Always continue PXE boot

![](.\wds_setup\1.png)

![](.\wds_setup\2.png)

![](.\wds_setup\3.png)

![](.\wds_setup\4.png)

![](.\wds_setup\5.png)

![](.\wds_setup\6.png)

![](.\wds_setup\7.png)

![](.\wds_setup\8.png)

![](.\wds_setup\9.png)

## Set up DHCP scope

192.168.1.100
192.168.1.150
Activate scope

![](.\dhcp\1.png)

![](.\dhcp\2.png)

![](.\dhcp\3.png)

![](.\dhcp\4.png)

![](.\dhcp\5.png)

![](.\dhcp\6.png)

![](.\dhcp\7.png)

![](.\dhcp\8.png)

![](.\dhcp\9.png)

![](.\dhcp\10.png)

![](.\dhcp\11.png)

![](.\dhcp\12.png)

## MDT:

New Deployment Share:
Sharename: DeployShare
Don't Ask Anything

![](.\mdt\new_deployment_share\1.png)

![](.\mdt\new_deployment_share\2.png)

![](.\mdt\new_deployment_share\3.png)

![](.\mdt\new_deployment_share\4.png)

![](.\mdt\new_deployment_share\5.png)

![](.\mdt\new_deployment_share\6.png)

![](.\mdt\new_deployment_share\7.png)

![](.\mdt\new_deployment_share\8.png)

![](.\mdt\new_deployment_share\9.png)

Bootstrap.ini file
CustomSettings.ini file
Add Powershell, DISM Cmdlets, Secure Boot, Storage Management CMDlets (for x86 AND x64)

![](.\mdt\windows_pe_settings\1.png)

![](.\mdt\windows_pe_settings\2.png)

![](.\mdt\windows_pe_settings\3.png)

![](.\mdt\windows_pe_settings\4.png)

![](.\mdt\windows_pe_settings\5.png)

![](.\mdt\windows_pe_settings\6.png)

![](.\mdt\windows_pe_settings\7.png)

![](.\mdt\windows_pe_settings\8.png)

## Create Driver Folders

![](.\mdt\driver_folder\1.png)

![](.\mdt\driver_folder\2.png)

![](.\mdt\driver_folder\3.png)

![](.\mdt\driver_folder\4.png)

![](.\mdt\driver_folder\5.png)

![](.\mdt\driver_folder\6.png)

![](.\mdt\driver_folder\7.png)

![](.\mdt\driver_folder\8.png)

![](.\mdt\driver_folder\9.png)

![](.\mdt\driver_folder\10.png)

![](.\mdt\driver_folder\11.png)

## Import OS (just WIM, no setup files)

![](.\mdt\import_os\1.png)

![](.\mdt\import_os\2.png)

![](.\mdt\import_os\3.png)

![](.\mdt\import_os\4.png)

![](.\mdt\import_os\5.png)

![](.\mdt\import_os\6.png)

![](.\mdt\import_os\7.png)

![](.\mdt\import_os\8.png)

New Task Sequence:
Standard Client Task Sequence
No Prod Key
Name & Org: Your Org Name Here
Web: server.domain.tld (ie: example.com)
No admin pass

![](.\mdt\new_task_sequence\1.png)

![](.\mdt\new_task_sequence\2.png)

![](.\mdt\new_task_sequence\3.png)

![](.\mdt\new_task_sequence\4.png)

![](.\mdt\new_task_sequence\5.png)

![](.\mdt\new_task_sequence\6.png)

![](.\mdt\new_task_sequence\7.png)

![](.\mdt\new_task_sequence\8.png)

## Driver Update Task Sequence

![](.\mdt\driver_injection\1.png)

![](.\mdt\driver_injection\2.png)

![](.\mdt\driver_injection\3.png)

![](.\mdt\driver_injection\4.png)

![](.\mdt\driver_injection\5.png)

![](.\mdt\driver_injection\6.png)

![](.\mdt\driver_injection\7.png)

Windows 10 Additions
While this doesn't work in it's current state - It seems that only a small bug is holding back it's progress.
Update Deployment Share, Completely Regen Boot Images

![](.\win_10_customizations\1.png)

![](.\win_10_customizations\2.png)

![](.\win_10_customizations\3.png)

![](.\win_10_customizations\4.png)

![](.\win_10_customizations\5.png)

![](.\win_10_customizations\6.png)

![](.\win_10_customizations\7.png)

![](.\win_10_customizations\8.png)

![](.\win_10_customizations\9.png)

![](.\win_10_customizations\10.png)

![](.\win_10_customizations\11.png)

## Regenerate Windows PE

![](.\regenerate_pe\1.png)

![](.\regenerate_pe\2.png)

![](.\regenerate_pe\3.png)

![](.\regenerate_pe\4.png)

## Add boot images to WDS

![](.\add_image_to_wds\1.png)

![](.\add_image_to_wds\2.png)

![](.\add_image_to_wds\3.png)

![](.\add_image_to_wds\4.png)

![](.\add_image_to_wds\5.png)

![](.\add_image_to_wds\6.png)

![](.\add_image_to_wds\7.png)

https://slofile.com/slack/winadmins
