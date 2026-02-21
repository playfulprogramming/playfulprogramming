---
{
title: "CI/CD pipelines with AWS Amplify",
published: "2022-12-30T09:54:59Z",
edited: "2023-01-05T08:13:01Z",
tags: [],
description: "The company I work for is an AWS partner and it is natural that many of the applications we build are...",
originalLink: "https://https://dev.to/playfulprogramming/cicd-pipelines-with-aws-amplify-5a1b",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "CI/CD pipelines with AWS Amplify",
order: 1
}
---

The company I work for is an AWS partner and it is natural that many of the applications we build are based on the services offered by Amazon.

We're migrating our CI/CD pipelines to AWS Amplify and I will show you how we can achieve great results with just a few clicks.

---

The example is based on a [Next.js](https://nextjs.org/) application hosted on GitHub.<br>

![GitHub](./ztpqaq2x8wf2iozb0ix0.png)<br>

To initialize the application we can use the command:
`npx create-next-app@latest --typescript`<br>
Once the starter is created, we edit the file
`pages/index.tsx`
replacing the boilerplate with this code:<br>

![pages index](./q4u9k0lk1mum9kh7q6dd.png)<br>

An environment variable is used here. We have to configure it in the Next.js configuration file
`next.config.js`

````json
const nextConfig = {
  [...]
  env: { PROJECT_NAME: process.env.PROJECT_NAME, },
}
module.exports = nextConfig
````

We can test the app locally by creating a `.env.local` file to set the environment variable<br>

![EnvLocal](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oiiw2gmq2bn5brfa1chm.png)<br>

After we sync the project with remote GitHub, we're ready to move on to the deployment part.

## AWS Amplify

Once logged into the AWS console, let's search for the Amplify service.<br>

![AWSDash](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0k57xtwmnar2mp6mh64l.png)<br>

### Configuration

Click on _Host web app_<br>

![HostWebApp](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uxbtbjd3c08sbyo4dpbj.png)<br>

here we can connect our GitHub account and select the project we just created<br>

![GitHubSelection](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9k9kkyrr47k5yslwhaf8.png)<br>

![GitHubRepo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/st7o8kfa2abxptwlhfq5.png)<br>

Click on _Next_, here we can configure the build and we can set our environment variable<br>

![Build](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/24l3kju98ntq8j503z4d.png)<br>

![Save](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cbcbjmuu7hbpr1soyhlo.png)<br>

### Build & Deploy

🚀 The build and the deployment will be performed automatically<br>

![Deploy](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z4485myamsoffdcfawxn.png)<br>

### Final result

![FinalResult](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p1m52467qd5gqu594u0d.png)

---

This is the first article on AWS Amplify, if you find the topic interesting give ❤️ and I will write more about it. Bye 👋

You can [follow me on Twitter](https://twitter.com/giorgio_boa), where I'm posting or retweeting interesting articles.

<!-- ::user id="gioboa" -->
