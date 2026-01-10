---
{
title: "Building a Contact Form with Microsoft Azure and Blazor",
published: "2023-09-08T13:01:32Z",
edited: "2023-09-13T11:19:14Z",
tags: ["blazor", "csharp", "azure", "webdev"],
description: "In this blog post, I will show you how to create a simple contact form for your website using Blazor...",
originalLink: "https://dev.to/this-is-learning/building-a-contact-form-with-microsoft-azure-and-blazor-3fbh",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this blog post, I will show you how to create a simple contact form for your website using Blazor WebAssembly and Microsoft Azure. The contact form will allow visitors to send you an email with their name, email address, subject and message. The email will be sent using the Email Communication Service resource in Azure Communication Services.

## Prerequisites

To follow along with this tutorial, you will need:

- Visual Studio 2022 or later with the ASP.NET and web development workload installed.
- An Azure subscription. If you don’t have one, you can create a free account [here](https://azure.microsoft.com/en-us/free/).
- An Azure Communication Services resource. You can create one by following the steps [here](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource).
- of course, an email address that you want to receive the messages from the contact form.

## Creating the Blazor WebAssembly project

The first step is to create a new Blazor WebAssembly project in Visual Studio. To do that, follow these steps:

1. Open Visual Studio and select **Create a new project**.
2. In the **Create a new project** dialog, search for **Blazor** and select **Blazor WebAssembly App**. Click **Next**.
3. In the **Configure your new project** dialog, enter a name for your project, such as **BlazorContactForm**, and choose a location to save it. Click **Next**.
4. In the **Additional information** dialog, make sure that **.NET 7 (Current)** is selected as the target framework, Click **Create**.

Visual Studio will create a solution with three projects: a client-side project for the Blazor WebAssembly app.

## Creating the form model class

The next step is to create a form model class that will store the information that is collected from the users through the contact form. The form model class will also have some data annotations attributes to specify validation rules for the input fields.

To create the form model class, follow these steps:

1. In Solution Explorer, right-click on the **BlazorContactForm** project and select **Add > Class**.
2. In the **Add New Item** dialog, enter **ContactFormModel.cs** as the name of the class and click **Add**.
3. Replace the code in the class file with the following:

```csharp
using System.ComponentModel.DataAnnotations;

namespace BlazorContactForm.Shared
{
    public class ContactFormModel
    {
        [Required(ErrorMessage = "Please enter your name.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter your email address.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter a subject.")]
        public string Subject { get; set; }

        [Required(ErrorMessage = "Please enter a message.")]
        public string Message { get; set; }
    }
}
```
The code above defines four properties for the form model class: Name, Email, Subject and Message. Each property has a Required attribute that indicates that it is mandatory to fill in. The Email property also has an EmailAddress attribute that validates that the input is a valid email address.

## Creating the contact form component

The next step is to create a contact form component that will render the input fields and buttons for the contact form. The contact form component will use the Blazor framework’s built-in input components and validation features to bind to the form model class and display error messages if any.

To create the contact form component, follow these steps:

1. In Solution Explorer, right-click on the **Pages** folder in the **BlazorContactForm** project and select **Add > Razor Component**.
2. In the **Add New Item** dialog, enter **ContactForm.razor** as the name of the component and click **Add**.
3. Replace the code in the component file with the following:

```csharp
@using BlazorContactForm.Shared
@using Microsoft.AspNetCore.Components.Forms

<h1>Contact Us</h1>

<EditForm Model="@contactFormModel" OnValidSubmit="@HandleValidSubmit">
    <DataAnnotationsValidator />
    <ValidationSummary />

    <div class="form-group">
        <label for="name">Name</label>
        <InputText id="name" class="form-control" @bind-Value="@contactFormModel.Name" />
        <ValidationMessage For="@(() => contactFormModel.Name)" />
    </div>

    <div class="form-group">
        <label for="email">Email</label>
        <InputText id="email" class="form-control" @bind-Value="@contactFormModel.Email" />
        <ValidationMessage For="@(() => contactFormModel.Email)" />
    </div>

    <div class="form-group">
        <label for="subject">Subject</label>
        <InputText id="subject" class="form-control" @bind-Value="@contactFormModel.Subject" />
        <ValidationMessage For="@(() => contactFormModel.Subject)" />
    </div>

    <div class="form-group">
        <label for="message">Message</label>
        <InputTextArea id="message" class="form-control" @bind-Value="@contactFormModel.Message" />
        <ValidationMessage For="@(() => contactFormModel.Message)" />
    </div>

    <button type="submit" class="btn btn-primary">Send</button>
</EditForm>

@code {
    private ContactFormModel contactFormModel = new();

    private async Task HandleValidSubmit()
    {
        // TODO: Send the email using Azure Communication Services
    }
}
```
The code above defines an EditForm component that is bound to the contactFormModel object that is created in the code block. The EditForm component has an OnValidSubmit attribute that specifies a method to handle the form submission when the input is valid. The EditForm component also contains a DataAnnotationsValidator component that enables data annotations validation for the form model, and a ValidationSummary component that displays a list of validation errors if any.

Inside the EditForm component, there are four div elements with the form-group class that represent the input fields for the contact form. Each input field uses a built-in input component, such as InputText or InputTextArea, that is bound to a property of the form model using the @bind-Value directive attribute. Each input field also has a label element with a for attribute that matches the id attribute of the input component, and a ValidationMessage component that displays an error message for the corresponding property if it is invalid.

At the bottom of the EditForm component, there is a button element with the type attribute set to submit and the class attribute set to btn btn-primary. This button will trigger the form submission when clicked.

## Creating the email service

The next step is to create an email service that will use the Azure Communication Services SDK to send an email using the Email Communication Service resource. The email service will be registered as a dependency injection service in the ASP.NET Core backend and consumed by the contact form component in the Blazor WebAssembly app.

To create the email service, follow these steps:

1. In Solution Explorer, right-click on the **BlazorContactForm** project and select **Manage NuGet Packages**.
2. In the **Manage NuGet Packages** dialog, select **Browse** and search for **Azure.Communication.Email**. Select it and click **Install** to install the package.
3. In Solution Explorer, create a **Services** folder and right-click on it and select **Add > Class**.
4. In the **Add New Item** dialog, enter **EmailService.cs** as the name of the class and click **Add**.
5. Replace the code in the class file with the following:

```csharp
using Azure.Communication.Email;

namespace BlazorContactForm
{
    public interface IEmailService
    {
        Task SendEmailAsync(string from, string to, string subject, string message);
    }

    public class EmailService : IEmailService
    {
        private readonly EmailClient emailClient;

        public EmailService(EmailClient emailClient)
        {
            this.emailClient = emailClient;
        }

        public async Task SendEmailAsync(string from, string to, string subject, string message)
        {
            var fromEmailAddress = new EmailAddress(from);
            var toEmailAddress = new EmailAddress(to);

            await emailClient.SendAsync(Azure.WaitUntil.Started, fromEmailAddress.Address, toEmailAddress.Address, subject, message);
        }
    }
}
```

The code above defines an interface (IEmailService) and a class (EmailService) that implement it. The EmailService class has a constructor that accepts an EmailClient object as a parameter and assigns it to a private field (emailClient). The EmailClient object is a class from the Azure Communication Services SDK that provides methods for sending emails using an Email Communication Service 

The EmailService class also has a method (SendEmailAsync) that takes four parameters: from, to, subject and message. These parameters represent the sender’s email address, the recipient’s email address, the email subject and the email message, respectively. The method uses the emailClient field to create an EmailAddress object for the sender and the recipient, an EmailContent object for the subject and the message, and then calls the SendEmailAsync method of the emailClient to send the email.

## Registering and configuring the email service

The next step is to register and configure the email service in the ASP.NET Core backend. To do that, follow these steps:

1. In Solution Explorer, create and open a file called **appsettings.json** in the wwwroot folder.
2. Add a new section called **EmailSettings** with two properties: **ConnectionString** and **FromAddress**. The ConnectionString property should have the value of the connection string of your Azure Communication Services resource. You can find it in the Azure portal under **Overview > Keys**. The FromAddress property should have the value of your email address that you want to use as the sender of the emails. The file should look like this:

```json
{
  "EmailSettings": {
    "ConnectionString": "endpoint=https://<your-resource-name>.communication.azure.com/;accesskey=<your-access-key>",
    "FromAddress": "<your-email-address>"
  },
  // Other settings
}
```
1. In Solution Explorer, open the **Startup.cs** file.
2. In the ConfigureServices method, add the following code to register and configure the email service:

```csharp
builder.Services.AddSingleton<EmailClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var emailSettings = configuration.GetSection("EmailSettings");
    var endpoint = emailSettings["ConnectionString"];
    var connectionString = endpoint;
    return new EmailClient(connectionString);
});

builder.Services.AddScoped<IEmailService, EmailService>();
```
The code above uses the AddSingleton method to register an EmailClient object as a singleton service and pass it the connection string from the appsettings.json file. The code also uses the AddScoped method to register an IEmailService object as a scoped service and use the EmailService class as its implementation.

## Consuming the email service in the contact form component

The final step is to consume the email service in the contact form component and use it to send an email when the form is submitted. To do that, follow these steps:

1. In Solution Explorer, open the **ContactForm.razor** file in the **BlazorContactForm** project.
2. At the top of the file, add a using directive for the BlazorContactForm.Server.Services namespace and an inject directive for the IEmailService interface:

```csharp
@using BlazorContactForm.Server.Services
@inject IEmailService EmailService
```
In the code block, add a private field for storing your email address that you want to receive the messages from:

```csharp
@code {
    private ContactFormModel contactFormModel = new();
    private string toAddress = "<your-email-address>";
    
    // Other code
}
```
In the HandleValidSubmit method, add a try-catch block that calls the SendEmailAsync method of the EmailService object and passes it the from address from the form model, the to address from the field, and the subject and message from the form model:

```csharp
private async Task HandleValidSubmit()
{
    try
    {
        await EmailService.SendEmailAsync(contactFormModel.Email, toAddress, contactFormModel.Subject, contactFormModel.Message);
        // TODO: Display a success message
    }
    catch (Exception ex)
    {
        // TODO: Display an error message
    }
}
```
The code above uses a try-catch block to handle any possible exceptions that may occur when sending an email. If no exception occurs, it means that the email was sent successfully. If an exception occurs, it means that there was an error while sending an email.

1. To display a success or error message to the user, add a private field for storing a message string and a private method for clearing it after a few seconds:

```csharp
@code {
    private ContactFormModel contactFormModel = new();
    private string toAddress = "<your-email-address>";
    private string message;

    private async Task ClearMessage()
    {
        await Task.Delay(3000);
        message = null;
        StateHasChanged();
    }

    // Other code
}
```
The code above defines a message field that will hold either a success or error message depending on whether or not an exception occurs when sending an email. The code also defines a ClearMessage method that will wait for three seconds and then set the message field to null and call the StateHasChanged method to trigger a UI update.

1. To display the message field in the UI, add a div element with the alert class and a conditional attribute that shows or hides it depending on whether or not the message field is null or empty. The div element should be placed after the EditForm component:

```razor
<div class="alert @message?.StartsWith("Error") ? "alert-danger" : "alert-success" @hidden="@string.IsNullOrEmpty(message)">
    @message
</div>
```
The code above uses a conditional expression to set the alert class to either alert-danger or alert-success depending on whether or not the message field starts with “Error”. The code also uses a hidden attribute to show or hide the div element depending on whether or not the message field is null or empty.

1. To assign a value to the message field and call the ClearMessage method in the HandleValidSubmit method, modify the try-catch block as follows:

```csharp
private async Task HandleValidSubmit()
{
    try
    {
        await EmailService.SendEmailAsync(contactFormModel.Email, toAddress, contactFormModel.Subject, contactFormModel.Message);
        message = "Your email has been sent successfully.";
        await ClearMessage();
    }
    catch (Exception ex)
    {
        message = $"Error: {ex.Message}";
        await ClearMessage();
    }
}
```
The code above assigns a success message to the message field if no exception occurs, or an error message with the exception message if an exception occurs. The code also calls the ClearMessage method after assigning a value to the message field.

## Conclusion

In this blog post, you learned how to create a contact form for a website with Blazor WebAssembly, and using Email Communication Service resource in Azure Communication Services. You learned how to:

- Create a Blazor WebAssembly project with ASP.NET Core hosted and Progressive Web Application options.
- Create a form model class with data annotations attributes for validation.
- Create a contact form component with built-in input components and validation features.
- Create an email service with Azure Communication Services SDK for sending emails.
- Register and configure the email service in the ASP.NET Core backend.
- Consume the email service in the contact form component and use it to send an email when the form is submitted.
- Display a success or error message to the user after sending an email.

You can find the entire source code of the project on gist: https://gist.github.com/kasuken/fd5261904882d0525ceaa3cd10a3aa59

I hope you enjoyed this tutorial and found it useful. If you have any questions or feedback, please leave them in the comments below. Thank you for reading!

---

![Dev Dispatch](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!