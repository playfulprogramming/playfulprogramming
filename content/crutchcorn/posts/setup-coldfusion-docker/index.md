---
{
    title: "Setup ColdFusion in Docker",
    description: "",
    published: '2024-12-12T20:12:03.284Z',
    tags: ['coldfusion'],
    license: 'cc-by-4'
}
---

[Adobe ColdFusion](https://www.adobe.com/products/coldfusion-family.html) is having a comeback moment of sorts. While many associate the language with its time in the 90s, it has been seeing growth and continual improvements in the past few years.

One area where ColdFusion has seen intense growth is in local developer experience.

Nowadays, you can setup a Visual Studio Code environment and run a ColdFusion server in Docker to easily manage a free and easy to configure programming environment.

Let's explore how to set that up.

# Docker

We'll first start with a pretty fundamental prerequisite: Installing Docker.

You can choose between [Docker Desktop GUI](https://www.docker.com/products/docker-desktop/) and the [Docker Engine CLI](https://docs.docker.com/engine/install/). Follow the installation steps for one of the tools to get started.

-----

Regardless of the tool you have selected, you should be able to access the `docker` CLI command.

We can use this `docker` utility to create a container for ColdFusion using the following command:

```shell
docker container create --name coldfusion -p 8500:8500 -p 7071:7071 -p 45564:45564 -p 8122:8122 -e acceptEULA=YES -e password=YOUR_PASSWORD_HERE -v LOCAL_PATH_HERE:/app adobecoldfusion/coldfusion:latest
```

<details>
<summary>Example Command</summary>

```shell
docker container create --name coldfusion -p 8500:8500 -p 7071:7071 -p 45564:45564 -p 8122:8122 -e acceptEULA=YES -e password=ColdFusion123 -v C:\Users\crutchcorn\git\ColdFusion\webroot:/app adobecoldfusion/coldfusion:latest
```

</details>

![Terminal output of the CLI command showing a created container](./docker-run.png)

This command:

- Names the created container `coldfusion`
- Forwards four ports needed for ColdFusion from the container to the host operating system
- Accepts the EULA for ColdFusion
- Sets `YOUR_PASSWORD_HERE` as the password for the admin account you'll use to configure the ColdFusion dashboard 
- Exposes the host machine's `LOCAL_PATH_HERE` folder as an empty folder you'll use to upload files to your ColdFusion instance.

------

Now that we have our container created, we can start it using the command:

```shell
docker start coldfusion
```

# Looking at the ColdFusion Dashboard

# Uploading Files

```html
<!-- index.cfm -->
<cfscript>
function testStuff(){
    writeOutput(NOW());
}

testStuff();
</cfscript>
```