---
{
title: "Fetching and Publishing Settings for Azure Functions with Azure Functions Core Tools Command Line",
published: "2023-12-05T13:46:00Z",
edited: "2023-12-05T14:31:57Z",
tags: ["azure", "azurefunctions", "tooling", "webdev"],
description: "During my daily activities I develop a lot of Azure Functions. Every time I struggle to synchronize...",
originalLink: "https://dev.to/this-is-learning/fetching-and-publishing-settings-for-azure-functions-with-azure-functions-core-tools-command-line-4akj",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

During my daily activities I develop a lot of Azure Functions. Every time I struggle to synchronize my local settings to the remote settings on Azure.

In this article, I will show you how to use the Core Tools to fetch and publish settings for Azure Functions. By using the Core Tools, you can ensure that your local and remote environments are consistent and avoid errors due to missing or outdated settings.

Let’s get started!

## Fetching Settings from Azure

If you have already deployed your Azure Functions project to Azure, you may want to fetch the settings from the cloud and apply them to your local project. This can help you ensure that your local and remote environments are consistent and avoid errors due to missing or outdated settings.

To fetch settings from Azure, you can use the `func azure functionapp fetch-app-settings` command. This command downloads the settings from your Azure Function App and stores them in a local file named `local.settings.json`. This file is used by the Core Tools to load the settings when you run your functions locally.

The syntax of the command is:

```bash
func azure functionapp fetch-app-settings <function-app-name>

```

where `<function-app-name>` is the name of your Azure Function App.

For example, if your Azure Function App is named `my-function-app`, you can run the following command:

```bash
func azure functionapp fetch-app-settings my-function-app
```

This will download the settings from `my-function-app` and save them in `local.settings.json`.

You can view the contents of `local.settings.json` using any text editor. The file has the following structure:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "<storage-account-connection-string>",
    "FUNCTIONS_WORKER_RUNTIME": "<worker-runtime>",
    "FUNCTIONS_EXTENSION_VERSION": "<extension-version>",
    // other app settings
  },
  "ConnectionStrings": {
    // connection strings
  },
  "Host": {
    // host settings
  }
}
```

The `Values` section contains the app settings, such as the storage account connection string, the worker runtime, the extension version, and any custom settings you have defined. The `ConnectionStrings` section contains the connection strings for your data sources, such as Azure SQL Database, Cosmos DB, Service Bus, etc. The `Host` section contains the host settings, such as the HTTP route prefix, the CORS policy, the logging level, etc.

Note that the `IsEncrypted` property is set to `false`, which means that the settings are stored in plain text. This is fine for local development, but you should not commit this file to source control or share it with others. If you want to encrypt the settings, you can use the `func settings encrypt` command.

## Publishing Settings to Azure

If you have made changes to your local settings and want to apply them to your Azure Function App, you can use the `func azure functionapp publish` command. This command deploys your Azure Functions project to Azure and optionally updates the settings on the cloud.

The syntax of the command is:

```bash
func azure functionapp publish <function-app-name> [options]
```

where `<function-app-name>` is the name of your Azure Function App and `[options]` are optional parameters that control the behavior of the command.

Some of the options that are relevant for publishing settings are:

- `-publish-local-settings`: This option publishes all the settings in `local.settings.json` to your Azure Function App. This will overwrite any existing settings on the cloud with the same name. If you want to exclude some settings from being published, you can use the `-publish-settings-only` option instead and specify the settings you want to publish.
- `-overwrite-settings`: This option forces the command to overwrite the settings on the cloud even if they have been modified since the last fetch. By default, the command will prompt you to confirm the overwrite if it detects any changes.
- `-nozip`: This option disables the zip deployment method and uses the run-from-package method instead. This can improve the performance and reliability of your Azure Function App, but it requires that your project folder is accessible from the cloud. For more information, see \[here].

For example, if you want to publish your local project and settings to `my-function-app` using the run-from-package method and overwrite any existing settings, you can run the following command:

```bash
func azure functionapp publish my-function-app --publish-local-settings --overwrite-settings --nozip
```

This will deploy your project and settings to `my-function-app` and display the output of the command.

## Conclusion

In this article, I have shown you how to use the Azure Functions Core Tools to fetch and publish settings for Azure Functions.
You can use the Core Tools to download the settings from your Azure Function App and save them in a local file named `local.settings.json`. You can also use the Core Tools to deploy your project and settings to your Azure Function App and optionally overwrite the existing settings on the cloud. By using the Core Tools, you can ensure that your local and remote environments are consistent and avoid errors due to missing or outdated settings.

Thanks for reading and keep learning!

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

{% embed https://dev.to/kasuken %}
