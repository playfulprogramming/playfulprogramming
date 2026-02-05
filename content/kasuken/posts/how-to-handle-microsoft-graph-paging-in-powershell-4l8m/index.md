---
{
title: "How To Handle Microsoft Graph Paging in PowerShell",
published: "2023-10-17T05:14:18Z",
tags: ["powershell", "azure"],
description: "When you query the Microsoft Graph API, you may encounter a limitation: the API only returns a...",
originalLink: "https://dev.to/this-is-learning/how-to-handle-microsoft-graph-paging-in-powershell-4l8m",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

When you query the Microsoft Graph API, you may encounter a limitation: the API only returns a maximum of 1000 items per request. This means that if you want to retrieve more than 1000 items, you need to handle paging.

Each page contains a subset of the items, and you can request the next page by using a special URL, called a nextLink. The nextLink is returned by the API along with the current page of items, and it contains all the information needed to get the next page, such as the query parameters, filters, and skip tokens.

In this blog post, I will show you how to handle paging in PowerShell, using the Invoke-RestMethod cmdlet and a simple loop.

## Prerequisites

To follow along with this blog post, you will need:

- A Microsoft 365 subscription with an Azure AD tenant.
- An Azure AD app registration with the User.Read.All permission granted.

A function to retrieve the token:

```powershell
Function Get-Graph-Token {
    $Body = @{
        Grant_Type    = "client_credentials"
        Scope         = "https://graph.microsoft.com/.default"
        Client_Id     = $ClientID
        Client_Secret = $ClientSecret
    }
     
    $Connection = Invoke-RestMethod `
        -Uri https://login.microsoftonline.com/$TenantID/oauth2/v2.0/token `
        -Method POST `
        -Body $body
     
    #Get the Access Token 
    $AuthHeader = @{
        'Authorization' = "Bearer $($Connection.access_token)"
    }

    return $AuthHeader
}
```

## Step 1: Define the initial query URL

The first step is to define the initial query URL for the Microsoft Graph API. This URL will contain the endpoint for getting users (/users), and optionally any query parameters or filters that you want to apply. For example, if you want to get only active users and select some specific properties, you can use the following URL:

```powershell
$queryUrl = "https://graph.microsoft.com/v1.0/users?$filter=accountEnabled eq true&$select=id,userPrincipalName,givenName,surname"

```

## Step 2: Invoke the query and store the results

The next step is to invoke the query using the Invoke-RestMethod cmdlet and store the results in a variable. The Invoke-RestMethod cmdlet will send an HTTP GET request to the query URL and return a PowerShell object with two properties: value and @odata.nextLink. The value property contains an array of items (users) for the current page, and the @odata.nextLink property contains the URL for the next page (if any).

```powershell
# Invoke the query and store the results
$results = Invoke-RestMethod -Uri $queryUrl -Headers $headers

```

Note that you need to pass the appropriate headers for authentication and content type. In this example, I assume that you have already obtained an access token and stored it in a variable called $token (using the function at the top of the article). You can use the following code to create the headers:

```powershell
# Create headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

```

## Step 3: Loop through the pages and append the results

The final step is to loop through the pages and append the results to a single array. You can use a while loop that checks if there is a nextLink property in the results object. If there is, it means that there are more pages to fetch. In that case, you can invoke the nextLink URL using the same Invoke-RestMethod cmdlet and append the value property to your existing array of items. You can use the += operator to append arrays in PowerShell.

```powershell
# Initialize an empty array for all items
$allItems = @()

# Loop through the pages
while ($true) {

    # Append the current page of items to the array
    $allItems += $results.value

    # Check if there is a nextLink property
    if ($results.'@odata.nextLink') {

        # Invoke the nextLink URL and store the results
        $results = Invoke-RestMethod -Uri $results.'@odata.nextLink' -Headers $headers

    } else {

        # Break out of the loop
        break

    }
}

```

You can use also the following code to obtain the same results. I am not a big fan of “while”, and I prefer the code below. But it’s just my opinion and taste. 😊

```powershell
$allItems = @()

$items = (Invoke-RestMethod -Uri $queryUrl -Headers $AuthHeader -Method Get -ContentType "application/json")

		if ($items.'@odata.nextLink') {
		
		do {
		
		    $items = (Invoke-RestMethod -Uri $items.'@odata.nextLink' -Headers $AuthHeader -Method Get -ContentType "application/json")
		    $allItems += $items.value
		
		} until (
		    !$items.'@odata.nextLink'
		)    
}
```

## Conclusion

I hope you found this blog post useful and learned something new. If you have any questions or feedback, please feel free to leave a comment below or contact me on Twitter @Bing. Thank you for reading! 😊

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
