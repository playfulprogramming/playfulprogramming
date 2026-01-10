---
{
title: "GitHub Actions Trigger Via Webhooks",
published: "2021-03-29T12:01:29Z",
tags: ["github", "devops", "action"],
description: "In this article, we are going to look at how we can build a webhook to trigger a GitHub action workfl...",
originalLink: "https://mainawycliffe.dev/blog/github-actions-trigger-via-webhooks",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this article, we are going to look at how we can build a webhook to trigger a GitHub action workflow manually. This can be especially useful when you want to run a workflow where the triggers are external to the repository.

For instance, in a blogging platform, you might want to run a workflow to rebuild your statically generated website when the content is updated in a headless CMS. Most headless CMSs will request webhooks which they will send requests to when various events take place. For instance, when a new article is published or an old one is updated, you might want to just trigger a rebuild of your website.

## Prerequisite

- GitHub Personal Access Token (PAT) - follow instructions [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

> NB: Please ensure you have selected the `workflow` on the scope of the GitHub Personal Access Token (`PAT)`.

## Basics First

GitHub actions provides a `repository_dispatch` event to allow us to manually trigger a GitHub action workflow. To use this, we are going to configure our GitHub action workflow to run on `repository_dispatch`.

And then, we will specify the types of event upon which they will be triggered by. These event types are user defined and can be anything you wish them to be.

> You can learn more about `repository_dispatch` [here](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch).

For instance, here is an example of a GitHub action workflow config which runs when a new blog post is published:

```yaml
on:
  # publish blog using webhook
  repository_dispatch:
    types: [publish_blog]
 
 # steps
```

In the case above, we will make a post request to create repository dispatch action endpoint with `event_type` of `publish_blog` and that's when the GitHub Action will get triggered and not by any other event type. The `event_type` allows you to trigger a specific GitHub action workflow.

### Triggering the Action

In order to trigger the action above, we are going to send a POST request to the GitHub API endpoint for [creating a repository dispatch event](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event). The URL follows the following format:

```
https://api.github.com/repos/[USERNAME]/[REPOSITORY]/dispatches
```

> Replace the `[USERNAME]` with your GitHub owner i.e. your username or organization and `[REPOSITORY]` with the name of the repository.

To specify the GitHub Workflow to trigger, you need to provide `event_type` in the body. The `event_type` specified must be listed in the types array section of the `repository_dispatch`.

### NodeJS Example

For this example, we are going to use [Got](https://www.npmjs.com/package/got), a Node JS library for sending HTTP requests.

```typescript
const url = 'https://api.github.com/repos/[USERNAME]/[REPOSITORY]/dispatches';
const githubPAT = "GITHUB_PAT"; // keep this secret
await got.post(url, {
  json: {
    event_type: 'publish_blog',
  },
  headers: {
    Authorization: "token " + githubPAT,
  },
});
```

> **NB:** Remember to substitute `[USERNAME]`, `[REPOSITORY]` and `GITHUB_PAT` with the appropriate values.

The above request is going to trigger all GitHub Actions workflows which are listening to event type `publish_blog`.

## Building a Webhook

Now that we have the basics out, we are going to build a Webhook which we can use to trigger our workflow. While the GitHub dispatch event does qualify to be a webhook, you might want to simplify the API being exposed. This is because some systems where you might want to use the webhook in, will not be that configurable. Some will just give you the option of entering a URL and nothing more, which makes it difficult to use the GitHub Dispatches API directly.

For the purpose of this article, we will be using [Firebase Cloud Functions,](https://firebase.google.com/docs/functions) but any rest endpoint will do. This will expose a public `GET` endpoint that we can pass an `action` query param, which will be the type of event we want to trigger and will default to `publish_blog`. We will use [Firebase Functions Config](https://firebase.google.com/docs/functions/config-env) to pass the GitHub PAT to the function.

```typescript
export const triggerGithubActionWorkflow = https.onRequest(async (req, res) => {
  const dispatchAction = req.query?.action ?? 'publish_blog';
  const url =
    'https://api.github.com/repos/[USERNAME]/[REPOSITORY]/dispatches';
  const githubPAT = config().github.pat;
  await got.post(url, {
    json: {
      event_type: dispatchAction,
    },
    headers: {
      Authorization: "token " + githubPAT,
    },
  });
  res
    .send({
      message: `Dispatch Github action event emitted successfully!`,
    })
    .status(200);
});
```

> **NB:** The above Firebase function is public and might wise to add some security measures to prevent anyone from triggering your GitHub Action workflow.

## Conclusion

In this article, we looked at how we can trigger GitHub Action workflows Webhooks. We used the [create repository dispatch](https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#repository_dispatch) GitHub API endpoint to trigger our GitHub Action Workflow and created our own REST Endpoint to act as a Webhook to integrate with third party APIs.

Like I pointed out above, our example could use more security measures to ensure that not just anyone with the REST Endpoint can trigger the GitHub Action Workflow. This will most depend on how the web hook is called, if it's part of a dashboard, you could ensure the user in question has permission to perform the action in question or it could be as simple as using passphrase.
