---
{
    title: 'Windows Subsystem for Linux',
    description: 'Utilize the best of both worlds — Windows and Linux — without having to dual boot. Windows Subset for Linux (WSL) lets you run software designed for Linux in Windows.',
    published: '2022-05-24T22:07:20.000Z',
    edited: '2022-05-24T22:07:20.000Z',
    authors: ['splatkillwill'],
    tags: ['windows', 'linux'],
    attached: [],
    license: 'cc-by-nc-nd-4',
    originalLink: "https://gatimus.com/blog/windows-subsystem-for-linux"
}
---

Windows Subsystem for Linux (WSL) lets you run software designed for Linux. This gives Windows users access to tools and web developers environments closer resembling that of their peers or the webservers hosting their code.

## Getting Started

First make sure Windows is updated, WSL required additional setup steps prior to version 2004. Then run open PowerShell (as Admin) and run `wsl --list --online`. This will list all the available OS's for WSL.

```shell
PS C:\Users\user> wsl --list --online
The following is a list of valid distributions that can be installed.
Install using 'wsl --install -d <Distro>'.

NAME            FRIENDLY NAME
Ubuntu          Ubuntu
Debian          Debian GNU/Linux
kali-Linux      Kali Linux Rolling
openSUSE-42     openSUSE Leap 42
SLES-12         SUSE Linux Enterprise Server v12
Ubuntu-16.04    Ubuntu 16.04 LTS
Ubuntu-18.04    Ubuntu 18.04 LTS
Ubuntu-20.04    Ubuntu 20.04 LTS
```

## Installing

Pick your favorite flavor, mine is Ubuntu or Debian if I think I might need any older tools. Then run `wsl --install -d <Distro>`.

```shell
PS C:\Users\user> wsl --install -d Ubuntu
Downloading: Ubuntu
```

After a while you will see this prompt. Enter a user name that you want to use for the Linux environment and password twice.

```
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: user
New password:
Retype new password:
```

If all goes well you should land in a Linux prompt like this.

```
passwd: password updated successfully
Installation successful!
...
user@MACHINE_NAME:~$
```

## Setup

Run `sudo apt update` to refresh all your apt-get repos.

```shell
user@MACHINE_NAME:~$ sudo apt update
[sudo] password for user:
Get:1 http://archive.ubuntu.com/ubuntu focal InRelease [265 kB]
...
Get:45 http://archive.ubuntu.com/ubuntu focal-backports/multiverse amd64 c-n-f Metadata [116 B]
Fetched 22.0 MB in 7s (2985 kB/s)
Reading package lists... Done
Building dependency tree
Reading state information... Done
243 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

Then all your favorite tools.

```shell
user@MACHINE_NAME:~$ sudo apt install build-essential git cmake
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
...
Do you want to continue? [Y/n] Y
...
user@MACHINE_NAME:~$
```

> Note: If you are looking to get into C or C++ development `build-essential` is a good package to remember to get compilers

### Visual Studio Code Integration

You can use your regular Windows installation of Visual Studio Code to interact directly with the Linux environment. Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack or just [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl). Then you can use the Remote Explorer to browse WSL Targets (WSL OS's you've installed). All the projects and files are in and commands run in the Linux environment.

![Visual Studio Code showing a side panel with a list of "WSL Targets". There are two targets: Debian and Ubuntu with a project called "my-project" active in Ubuntu](./Screenshot_2021-10-17_171944.jpg)

> Note: The `Remote Development` extension pack also includes `Remote - SSH` which allows you to interact with remote Linux environments exactly the same way

To test it out we can throw a `hello.cpp` in there.

```cpp
#include <iostream>

int main()
{
  std::cout << "Hello World!\n";
  return 0;
}
```

![The files sidebar open in a VSCode instance showing a project containing C plus plus files open in WSL Ubuntu](./Screenshot_2021-10-21_205232.jpg)

<!-- Does this need a conclusion paragraph (I suck at those) -->
